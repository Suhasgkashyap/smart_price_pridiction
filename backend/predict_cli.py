"""
CLI Predictor for Smart House Price Predictor.
Reads input features as JSON string from sys.argv[1],
loads house_price_model.pkl, and outputs JSON prediction.
"""

import sys
import os
import json
import pandas as pd
import joblib

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'house_price_model.pkl')

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing input JSON argument"}))
        sys.exit(1)

    try:
        data = json.loads(sys.argv[1])
        model = joblib.load(MODEL_PATH)

        input_df = pd.DataFrame([{
            'location': str(data.get('location', 'Shivamogga')),
            'area': float(data.get('area', 1500)),
            'bedrooms': int(data.get('bedrooms', 3)),
            'bathrooms': int(data.get('bathrooms', 2)),
            'property_age': int(data.get('property_age', 5)),
            'parking': int(data.get('parking', 1)),
            'floors': int(data.get('floors', 2)),
            'furnishing_status': str(data.get('furnishing_status', 'Semi-Furnished')),
            'property_type': str(data.get('property_type', 'Apartment'))
        }])

        pred_price = float(model.predict(input_df)[0])
        pred_price = max(pred_price, 500000.0)
        pred_price = round(pred_price / 1000) * 1000
        area = float(data.get('area', 1500))
        price_per_sqft = round(pred_price / area, 2)

        output = {
            "status": "success",
            "predicted_price": pred_price,
            "price_per_sqft": price_per_sqft,
            "estimated_range": {
                "min": round((pred_price * 0.95) / 1000) * 1000,
                "max": round((pred_price * 1.05) / 1000) * 1000
            },
            "input_features": data,
            "model_used": "Gradient Boosting Regressor"
        }
        print(json.dumps(output))

    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    main()
