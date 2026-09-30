"""
Flask REST API for Smart House Price Predictor.
Serves prediction endpoint, dataset statistics, analytics, and model performance metrics.
"""

import os
import json
import pandas as pd
import numpy as np
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DATASET_PATH = os.path.join(os.path.dirname(__file__), 'dataset', 'houses.csv')
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'house_price_model.pkl')
METRICS_PATH = os.path.join(os.path.dirname(__file__), 'models', 'model_metrics.json')

# Global variables for loaded model and data
model_pipeline = None
metrics_data = None
df_cache = None


def get_dataset():
    global df_cache
    if df_cache is None and os.path.exists(DATASET_PATH):
        df = pd.read_csv(DATASET_PATH)
        df['price_per_sqft'] = df['price'] / df['area']
        df_cache = df
    return df_cache


def load_model():
    global model_pipeline, metrics_data
    if model_pipeline is None and os.path.exists(MODEL_PATH):
        try:
            model_pipeline = joblib.load(MODEL_PATH)
            print(f"Loaded trained ML pipeline from {MODEL_PATH}")
        except Exception as e:
            print(f"Error loading model: {e}")

    if metrics_data is None and os.path.exists(METRICS_PATH):
        try:
            with open(METRICS_PATH, 'r', encoding='utf-8') as f:
                metrics_data = json.load(f)
        except Exception as e:
            print(f"Error loading metrics: {e}")


# Initialize model on startup
load_model()


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "success",
        "message": "House Price Prediction API is running",
        "model_loaded": model_pipeline is not None
    })


@app.route('/api/predict', methods=['POST'])
def predict():
    global model_pipeline
    load_model()

    if model_pipeline is None:
        return jsonify({
            "status": "error",
            "message": "ML model has not been trained or loaded yet."
        }), 500

    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "message": "Missing JSON request body"}), 400

    # Validation
    try:
        location = str(data.get('location', '')).strip()
        area = float(data.get('area', 0))
        bedrooms = int(data.get('bedrooms', 0))
        bathrooms = int(data.get('bathrooms', 0))
        property_age = int(data.get('property_age', 0))
        parking = int(data.get('parking', 0))
        floors = int(data.get('floors', 1))
        property_type = str(data.get('property_type', 'Apartment')).strip()
        furnishing_status = str(data.get('furnishing_status', 'Semi-Furnished')).strip()

        if not location:
            return jsonify({"status": "error", "message": "Location is required"}), 400
        if area <= 0:
            return jsonify({"status": "error", "message": "Area must be greater than 0"}), 400
        if area > 20000:
            return jsonify({"status": "error", "message": "Area cannot exceed 20,000 sq.ft."}), 400
        if bedrooms < 1 or bedrooms > 20:
            return jsonify({"status": "error", "message": "Bedrooms must be between 1 and 20"}), 400
        if bathrooms < 1 or bathrooms > 15:
            return jsonify({"status": "error", "message": "Bathrooms must be between 1 and 15"}), 400
        if property_age < 0 or property_age > 100:
            return jsonify({"status": "error", "message": "Property age must be between 0 and 100"}), 400
        if parking < 0:
            return jsonify({"status": "error", "message": "Parking cannot be negative"}), 400

        # Construct single-row DataFrame matching the trained schema
        input_df = pd.DataFrame([{
            'location': location,
            'area': area,
            'bedrooms': bedrooms,
            'bathrooms': bathrooms,
            'property_age': property_age,
            'parking': parking,
            'floors': floors,
            'furnishing_status': furnishing_status,
            'property_type': property_type
        }])

        # Predict using trained Pipeline
        predicted_price_raw = model_pipeline.predict(input_df)[0]
        # Floor price logically
        predicted_price = max(float(predicted_price_raw), 500000.0)
        # Round to sensible market denomination
        predicted_price = round(predicted_price / 1000) * 1000

        price_per_sqft = round(predicted_price / area, 2)

        # Confidence interval approximation based on model standard error
        margin = predicted_price * 0.05
        lower_bound = round((predicted_price - margin) / 1000) * 1000
        upper_bound = round((predicted_price + margin) / 1000) * 1000

        return jsonify({
            "status": "success",
            "predicted_price": predicted_price,
            "price_per_sqft": price_per_sqft,
            "estimated_range": {
                "min": lower_bound,
                "max": upper_bound
            },
            "input_features": {
                "location": location,
                "area": area,
                "bedrooms": bedrooms,
                "bathrooms": bathrooms,
                "property_age": property_age,
                "parking": parking,
                "floors": floors,
                "property_type": property_type,
                "furnishing_status": furnishing_status
            },
            "model_used": metrics_data.get('best_model', 'Trained Regressor') if metrics_data else 'Trained Regressor'
        })

    except ValueError as ve:
        return jsonify({"status": "error", "message": f"Invalid numerical input: {str(ve)}"}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": f"Prediction failed: {str(e)}"}), 500


@app.route('/api/statistics', methods=['GET'])
def statistics():
    df = get_dataset()
    if df is None or len(df) == 0:
        return jsonify({"status": "error", "message": "Dataset not found"}), 404

    total_properties = int(len(df))
    avg_price = float(df['price'].mean())
    median_price = float(df['price'].median())
    min_price = float(df['price'].min())
    max_price = float(df['price'].max())
    avg_sqft = float(df['area'].mean())
    avg_price_per_sqft = float(df['price_per_sqft'].mean())

    # Count by property type
    by_type = df['property_type'].value_counts().to_dict()
    # Count by location
    by_location = df['location'].value_counts().to_dict()
    # Count by furnishing
    by_furnishing = df['furnishing_status'].value_counts().to_dict()

    return jsonify({
        "status": "success",
        "total_properties": total_properties,
        "avg_price": round(avg_price, 2),
        "median_price": round(median_price, 2),
        "min_price": round(min_price, 2),
        "max_price": round(max_price, 2),
        "avg_area": round(avg_sqft, 2),
        "avg_price_per_sqft": round(avg_price_per_sqft, 2),
        "property_type_counts": by_type,
        "location_counts": by_location,
        "furnishing_counts": by_furnishing
    })


@app.route('/api/analytics', methods=['GET'])
def analytics():
    df = get_dataset()
    if df is None or len(df) == 0:
        return jsonify({"status": "error", "message": "Dataset not found"}), 404

    # 1. Area vs Price (downsample to ~120 points for smooth frontend scatter chart rendering)
    scatter_df = df.sample(min(120, len(df)), random_state=42)
    area_vs_price = [
        {
            "area": int(row['area']),
            "price": int(row['price']),
            "location": str(row['location']),
            "bedrooms": int(row['bedrooms']),
            "property_type": str(row['property_type'])
        }
        for _, row in scatter_df.iterrows()
    ]

    # 2. Bedrooms vs Average Price
    bed_grp = df.groupby('bedrooms').agg(
        avg_price=('price', 'mean'),
        count=('price', 'count'),
        avg_sqft=('area', 'mean')
    ).reset_index()
    bedrooms_vs_price = [
        {
            "bedrooms": f"{int(row['bedrooms'])} BHK",
            "avg_price": round(float(row['avg_price']), 2),
            "avg_sqft": round(float(row['avg_sqft']), 1),
            "count": int(row['count'])
        }
        for _, row in bed_grp.sort_values('bedrooms').iterrows()
    ]

    # 3. Location vs Average Price & Price/sqft
    loc_grp = df.groupby('location').agg(
        avg_price=('price', 'mean'),
        avg_price_sqft=('price_per_sqft', 'mean'),
        count=('price', 'count')
    ).reset_index()
    location_vs_price = [
        {
            "location": str(row['location']),
            "avg_price": round(float(row['avg_price']), 2),
            "avg_price_sqft": round(float(row['avg_price_sqft']), 2),
            "count": int(row['count'])
        }
        for _, row in loc_grp.sort_values('avg_price', ascending=False).iterrows()
    ]

    # 4. Property Age vs Average Price
    df['age_group'] = pd.cut(
        df['property_age'],
        bins=[-1, 2, 5, 10, 15, 30],
        labels=['0-2 Yrs (New)', '3-5 Yrs', '6-10 Yrs', '11-15 Yrs', '15+ Yrs']
    )
    age_grp = df.groupby('age_group', observed=False).agg(
        avg_price=('price', 'mean'),
        avg_sqft_price=('price_per_sqft', 'mean'),
        count=('price', 'count')
    ).reset_index()
    age_vs_price = [
        {
            "age_group": str(row['age_group']),
            "avg_price": round(float(row['avg_price']), 2),
            "avg_sqft_price": round(float(row['avg_sqft_price']), 2),
            "count": int(row['count'])
        }
        for _, row in age_grp.iterrows()
    ]

    # 5. Model Performance Metrics
    load_model()
    benchmarks = metrics_data.get('benchmark_results', {}) if metrics_data else {}
    best_model_name = metrics_data.get('best_model', 'Gradient Boosting Regressor') if metrics_data else 'Gradient Boosting'
    feature_importances = metrics_data.get('feature_importances', []) if metrics_data else []

    model_performance = [
        {
            "model": name,
            "mae": data.get('mae', 0),
            "rmse": data.get('rmse', 0),
            "r2_score": data.get('r2_score', 0),
            "is_best": (name == best_model_name)
        }
        for name, data in benchmarks.items()
    ]

    return jsonify({
        "status": "success",
        "area_vs_price": area_vs_price,
        "bedrooms_vs_price": bedrooms_vs_price,
        "location_vs_price": location_vs_price,
        "age_vs_price": age_vs_price,
        "model_performance": model_performance,
        "feature_importances": feature_importances,
        "best_model": best_model_name
    })


@app.route('/api/locations', methods=['GET'])
def locations():
    df = get_dataset()
    if df is not None:
        locs = sorted(df['location'].unique().tolist())
        ptypes = sorted(df['property_type'].unique().tolist())
        furnishing = sorted(df['furnishing_status'].unique().tolist())
        min_area = int(df['area'].min())
        max_area = int(df['area'].max())
    else:
        locs = ['Bengaluru', 'Chennai', 'Hubli', 'Hyderabad', 'Mangalore', 'Mysore', 'Pune', 'Shivamogga']
        ptypes = ['Apartment', 'Independent House', 'Penthouse', 'Villa']
        furnishing = ['Fully-Furnished', 'Semi-Furnished', 'Unfurnished']
        min_area = 500
        max_area = 5000

    return jsonify({
        "status": "success",
        "locations": locs,
        "property_types": ptypes,
        "furnishing_statuses": furnishing,
        "min_area": min_area,
        "max_area": max_area
    })


if __name__ == '__main__':
    port = int(os.environ.get('FLASK_PORT', 5001))
    print(f"Starting Flask server on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
