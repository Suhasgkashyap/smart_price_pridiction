"""
Model Training Script for House Price Prediction System.
Trains and compares:
1. Linear Regression
2. Random Forest Regressor
3. Gradient Boosting Regressor
Evaluates MAE, MSE, RMSE, and R2 score, selects the best model,
and exports the trained Pipeline to Joblib format.
"""

import os
import json
import math
import numpy as np
import pandas as pd
import joblib

from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from preprocess import (
    prepare_train_test_data,
    build_preprocessor,
    NUMERICAL_FEATURES,
    CATEGORICAL_FEATURES
)

MODELS_DIR = 'backend/models'
MODEL_FILE = os.path.join(MODELS_DIR, 'house_price_model.pkl')
METRICS_FILE = os.path.join(MODELS_DIR, 'model_metrics.json')


def train_and_evaluate():
    os.makedirs(MODELS_DIR, exist_ok=True)
    print("=" * 60)
    print("STARTING ML MODEL TRAINING & BENCHMARKING PIPELINE")
    print("=" * 60)

    # 1. Load, clean, and split data
    X_train, X_test, y_train, y_test, full_df = prepare_train_test_data()

    print(f"Training Samples: {len(X_train)} | Test Samples: {len(X_test)}")

    # 2. Define candidate regression models
    candidate_models = {
        'Linear Regression': LinearRegression(),
        'Random Forest Regressor': RandomForestRegressor(
            n_estimators=120,
            max_depth=12,
            min_samples_split=4,
            random_state=42,
            n_jobs=-1
        ),
        'Gradient Boosting Regressor': GradientBoostingRegressor(
            n_estimators=150,
            learning_rate=0.08,
            max_depth=5,
            subsample=0.85,
            random_state=42
        )
    }

    results = {}
    pipelines = {}
    best_model_name = None
    best_r2 = -float('inf')

    # 3. Train and benchmark each model
    for name, regressor in candidate_models.items():
        print(f"\nTraining [{name}]...")
        preprocessor = build_preprocessor()
        pipe = Pipeline([
            ('preprocessor', preprocessor),
            ('regressor', regressor)
        ])

        # Fit model on training set
        pipe.fit(X_train, y_train)
        pipelines[name] = pipe

        # Predictions on test set
        y_pred = pipe.predict(X_test)

        mae = mean_absolute_error(y_test, y_pred)
        mse = mean_squared_error(y_test, y_pred)
        rmse = math.sqrt(mse)
        r2 = r2_score(y_test, y_pred)

        results[name] = {
            'mae': round(float(mae), 2),
            'mse': round(float(mse), 2),
            'rmse': round(float(rmse), 2),
            'r2_score': round(float(r2), 4),
            'description': f"{name} trained on {len(X_train)} property records"
        }

        print(f" -> MAE:     Rs. {mae:,.2f}")
        print(f" -> RMSE:    Rs. {rmse:,.2f}")
        print(f" -> R2 Score:{r2:.4f}")

        if r2 > best_r2:
            best_r2 = r2
            best_model_name = name

    print("\n" + "=" * 60)
    print(f"SELECTED BEST MODEL: [{best_model_name}] with R2 Score = {best_r2:.4f}")
    print("=" * 60)

    # 4. Save best pipeline to disk using Joblib
    best_pipeline = pipelines[best_model_name]
    joblib.dump(best_pipeline, MODEL_FILE)
    print(f"Successfully serialized winning pipeline to: {MODEL_FILE}")

    # Extract feature names if possible for importance insights
    feature_importances = []
    try:
        reg = best_pipeline.named_steps['regressor']
        if hasattr(reg, 'feature_importances_'):
            prep = best_pipeline.named_steps['preprocessor']
            cat_encoder = prep.named_transformers_['cat']
            cat_names = cat_encoder.get_feature_names_out(CATEGORICAL_FEATURES).tolist()
            all_feature_names = NUMERICAL_FEATURES + cat_names
            raw_imp = reg.feature_importances_
            pairs = sorted(zip(all_feature_names, raw_imp), key=lambda x: x[1], reverse=True)
            feature_importances = [
                {'feature': f.replace('location_', 'Loc: ').replace('property_type_', 'Type: ').replace('furnishing_status_', 'Furn: '), 'importance': round(float(imp * 100), 2)}
                for f, imp in pairs[:10]
            ]
    except Exception as e:
        print(f"Feature importance extraction note: {e}")

    summary_data = {
        'best_model': best_model_name,
        'benchmark_results': results,
        'feature_importances': feature_importances,
        'dataset_summary': {
            'total_records': len(full_df),
            'train_size': len(X_train),
            'test_size': len(X_test),
            'features': NUMERICAL_FEATURES + CATEGORICAL_FEATURES,
            'target': 'price'
        }
    }

    with open(METRICS_FILE, 'w', encoding='utf-8') as f:
        json.dump(summary_data, f, indent=2)
    print(f"Saved model metrics and benchmark data to: {METRICS_FILE}")

    return best_model_name, results


if __name__ == '__main__':
    train_and_evaluate()
