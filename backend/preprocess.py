"""
Data Preprocessing Module for House Price Prediction System.
Handles data loading, cleaning, validation, outlier filtering,
and Scikit-learn Pipeline / ColumnTransformer building.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer

# Numerical and Categorical feature definitions
NUMERICAL_FEATURES = [
    'area',
    'bedrooms',
    'bathrooms',
    'property_age',
    'parking',
    'floors'
]

CATEGORICAL_FEATURES = [
    'location',
    'furnishing_status',
    'property_type'
]

TARGET_COLUMN = 'price'


def load_and_clean_data(csv_path='backend/dataset/houses.csv'):
    """
    Loads dataset, handles missing values, removes duplicates,
    and removes statistical/unreasonable outliers.
    """
    df = pd.read_csv(csv_path)

    # 1. Remove duplicate rows if any
    initial_len = len(df)
    df = df.drop_duplicates()

    # 2. Handle missing values
    for col in NUMERICAL_FEATURES:
        if col in df.columns and df[col].isnull().any():
            df[col] = df[col].fillna(df[col].median())

    for col in CATEGORICAL_FEATURES:
        if col in df.columns and df[col].isnull().any():
            df[col] = df[col].fillna(df[col].mode()[0])

    if df[TARGET_COLUMN].isnull().any():
        df = df.dropna(subset=[TARGET_COLUMN])

    # 3. Filter out unrealistic/invalid records
    df = df[
        (df['area'] >= 300) & (df['area'] <= 10000) &
        (df['bedrooms'] >= 1) & (df['bedrooms'] <= 10) &
        (df['bathrooms'] >= 1) & (df['bathrooms'] <= 8) &
        (df['property_age'] >= 0) & (df['property_age'] <= 60) &
        (df['parking'] >= 0) & (df['parking'] <= 10) &
        (df['floors'] >= 1) & (df['floors'] <= 50) &
        (df['price'] > 500000)
    ]

    print(f"Data cleaned: {initial_len} -> {len(df)} records.")
    return df


def build_preprocessor():
    """
    Constructs a Scikit-Learn ColumnTransformer that scales numerical
    features and one-hot encodes categorical features.
    """
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), NUMERICAL_FEATURES),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), CATEGORICAL_FEATURES)
        ],
        remainder='drop'
    )
    return preprocessor


def prepare_train_test_data(csv_path='backend/dataset/houses.csv', test_size=0.2, random_state=42):
    """
    Cleans data, separates features and target, and splits into train and test sets.
    """
    df = load_and_clean_data(csv_path)

    X = df[NUMERICAL_FEATURES + CATEGORICAL_FEATURES]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )

    return X_train, X_test, y_train, y_test, df
