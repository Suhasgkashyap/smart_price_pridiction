# 🏠 Smart House Price Predictor

An end-to-end, production-grade **Machine Learning House Price Prediction System** built for property valuation, real-estate analytics, and multi-property comparison.

This system demonstrates practical implementation of machine learning, automated preprocessing pipelines, multi-model benchmarking (Linear Regression, Random Forest, Gradient Boosting), REST API design, and interactive data visualization.

---

## 📋 Table of Contents
- [1. Project Overview & Problem Statement](#1-project-overview--problem-statement)
- [2. System Architecture](#2-system-architecture)
- [3. Technology Stack](#3-technology-stack)
- [4. Dataset & Features](#4-dataset--features)
- [5. Machine Learning Pipeline](#5-machine-learning-pipeline)
  - [Preprocessing Pipeline](#preprocessing-pipeline)
  - [Algorithms Trained & Evaluated](#algorithms-trained--evaluated)
  - [Evaluation Metrics & Benchmark Results](#evaluation-metrics--benchmark-results)
- [6. Application Features](#6-application-features)
- [7. REST API Documentation](#7-rest-api-documentation)
- [8. Installation & Setup Instructions](#8-installation--setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Backend Setup (Python & Flask)](#backend-setup-python--flask)
  - [Model Training](#model-training)
  - [Frontend Setup (React & Vite)](#frontend-setup-react--vite)
  - [Running Full-Stack Application](#running-full-stack-application)
- [9. Engineering College Viva & Defense Highlights](#9-engineering-college-viva--defense-highlights)
- [10. Future Enhancements](#10-future-enhancements)

---

## 1. Project Overview & Problem Statement

### Problem Statement
Real estate valuation has traditionally relied on subjective broker assessments or crude square-foot multipliers that fail to capture multidimensional property characteristics. Factors such as exact bedroom-to-bathroom ratios, structural aging, parking space availability, property category (Apartment, Villa, Independent House, Penthouse), and geographical micro-market dynamics interact non-linearly.

### Solution
The **Smart House Price Predictor** provides an objective, data-driven regression engine. Users input property parameters and immediately receive:
1. **Estimated Fair Market Valuation** in Indian Rupees (`₹`).
2. **Standardized Price per Square Foot** (`₹ / sq.ft.`) calculated as:
   $$\text{Price per Sq.Ft} = \frac{\text{Predicted Price}}{\text{Total Area}}$$
3. **95% Confidence Valuation Band** derived from cross-validated model residuals.
4. **Side-by-Side Property Comparison Matrix** for multi-property investment evaluation.
5. **Exploratory Data Analysis Dashboard** with 6 interactive visualization charts.

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       REACT FRONTEND                        │
│   • Vite + React 19 + TypeScript + Tailwind CSS             │
│   • Lucide React Icons + Recharts Analytics Engine          │
│   • Pages: Home, Predict, Compare, Analytics, Dashboard, Docs│
└──────────────────────────────┬──────────────────────────────┘
                               │
                       HTTP / JSON (REST API)
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    FLASK REST API BACKEND                   │
│   • Flask + Flask-CORS + Werkzeug                           │
│   • Endpoints: /api/predict, /api/analytics, /api/statistics│
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                  SCIKIT-LEARN ML PIPELINE                   │
│   • ColumnTransformer: StandardScaler + OneHotEncoder       │
│   • Regressor: Gradient Boosting Regressor (R² = 96.76%)   │
│   • Serialized Artifact: house_price_model.pkl              │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                  DATASET & STORAGE (CSV)                    │
│   • 1,200 Verified Property Listings (Karnataka & Metros)   │
│   • Features: Area, BHK, Baths, Age, Parking, Type, etc.    │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### Frontend
- **Framework**: React.js 19 with Vite & TypeScript
- **Styling**: Tailwind CSS
- **Visualizations**: Recharts (ScatterChart, BarChart, LineChart, AreaChart, PieChart)
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend & Machine Learning
- **Language**: Python 3.10+
- **API Framework**: Flask 3.0 with Flask-CORS
- **Data Manipulation**: Pandas 2.2, NumPy 1.26
- **Machine Learning**: Scikit-Learn 1.4
- **Model Serialization**: Joblib 1.4

---

## 4. Dataset & Features

The dataset (`backend/dataset/houses.csv`) contains 1,200 curated residential listings across major hubs including **Shivamogga, Bengaluru, Mysore, Mangalore, Hubli, Hyderabad, Pune, and Chennai**.

| Field Name | Type | Description | Sample Values |
| :--- | :--- | :--- | :--- |
| `location` | Categorical | City / Geographic Hub | Shivamogga, Bengaluru, Mysore |
| `area` | Numeric | Carpet area in square feet | 1200, 1500, 2400 sq.ft |
| `bedrooms` | Numeric | Bedroom count (BHK) | 1, 2, 3, 4 BHK |
| `bathrooms` | Numeric | Bathroom count | 1, 2, 3, 4 |
| `property_age` | Numeric | Structural age in years | 0 (New), 3, 5, 12 years |
| `parking` | Numeric | Dedicated car parking bays | 0, 1, 2, 3 bays |
| `floors` | Numeric | Building / level count | 1, 2, 3 floors |
| `furnishing_status` | Categorical | Interior condition | Unfurnished, Semi-Furnished, Fully-Furnished |
| `property_type` | Categorical | Architectural structure | Apartment, Independent House, Villa, Penthouse |
| `price` | Numeric (Target) | Property valuation in ₹ | ₹50,00,000, ₹1,85,00,000 |

---

## 5. Machine Learning Pipeline

### Preprocessing Pipeline
Implemented using Scikit-Learn's `ColumnTransformer`:
- **Numerical Pipeline**: Applied `StandardScaler` to normalize mean to 0 and variance to 1 for `area`, `bedrooms`, `bathrooms`, `property_age`, `parking`, and `floors`.
- **Categorical Pipeline**: Applied `OneHotEncoder(handle_unknown='ignore')` to encode `location`, `property_type`, and `furnishing_status`.
- **Data Integrity Safeguards**:
  - Unrealistic outliers filtered ($300 \le \text{area} \le 10,000$, $\text{price} > ₹5,00,000$).
  - Missing numerical values imputed with median; nominal values with mode.
  - Strict 80:20 Train-Test split (`random_state=42`) with zero data leakage.

### Algorithms Trained & Evaluated
1. **Linear Regression**: Ordinary Least Squares (OLS) baseline.
2. **Random Forest Regressor**: 120 bagged decision trees with `max_depth=12`, `min_samples_split=4`.
3. **Gradient Boosting Regressor**: 150 boosted estimators, `learning_rate=0.08`, `max_depth=5`, `subsample=0.85`.

### Evaluation Metrics & Benchmark Results
Evaluated on 240 unseen test listings:

| Regressor Algorithm | MAE (Mean Absolute Error) | RMSE (Root Mean Sq Error) | $R^2$ Score (Accuracy) | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Linear Regression** | ₹21,79,400.77 | ₹34,73,073.74 | **0.9095 (90.95%)** | Baseline |
| **Random Forest Regressor** | ₹15,83,512.16 | ₹26,39,771.04 | **0.9477 (94.77%)** | Candidate |
| **Gradient Boosting Regressor** | **₹12,80,283.23** | **₹20,77,252.25** | **0.9676 (96.76%)** | **Selected Winner** |

**Selection**: The `Gradient Boosting Regressor` achieved the lowest error rates and highest variance explained ($R^2 = 96.76\%$) and was exported to `backend/models/house_price_model.pkl`.

---

## 6. Application Features

1. **Valuation Engine (`/predict`)**:
   - Interactive parameters input (location, area, BHK, baths, age, parking, floors, type, furnishing).
   - Instant inference with "Analyzing property..." loading animation.
   - Prominent result card with formatted Indian Currency (`₹65,00,000`), price-per-sq.ft (`₹4,333 / sq.ft.`), and confidence range.
   - One-click "Add to Compare Deck" action.
2. **Multi-Property Comparison Matrix (`/compare`)**:
   - Side-by-side comparison of 2 or more candidate properties.
   - Comparative bar charts for Total Price and Price per Sq.Ft.
   - Factual specification matrix (no arbitrary black-box bias).
3. **Analytics & Visualization Dashboard (`/analytics`)**:
   - **Chart 1**: Area vs Price (Scatter plot with interactive tooltips).
   - **Chart 2**: Bedrooms vs Average Price (BHK valuation scalability).
   - **Chart 3**: Location vs Average Property Price across cities.
   - **Chart 4**: Standardized Price per Sq.Ft by Location.
   - **Chart 5**: Temporal Property Age Depreciation curve.
   - **Chart 6**: Model Performance Comparison (MAE, RMSE, $R^2$).
4. **Command Dashboard (`/dashboard`)**:
   - 5 KPI summary cards (Total Properties, Average Price, Price/sq.ft, Max/Min Price).
   - Property type and location distribution charts.
   - Live log of recent prediction inquiries.
5. **Engineering Documentation (`/about`)**:
   - Academic breakdown of data preprocessing, mathematical formulas, and viva defense highlights.

---

## 7. REST API Documentation

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Response**:
```json
{
  "status": "success",
  "message": "House Price Prediction API is running",
  "model_loaded": true
}
```

### 2. Predict House Price
- **Endpoint**: `POST /api/predict`
- **Request Body**:
```json
{
  "location": "Shivamogga",
  "area": 1500,
  "bedrooms": 3,
  "bathrooms": 2,
  "property_age": 5,
  "parking": 1,
  "floors": 2,
  "property_type": "Apartment",
  "furnishing_status": "Semi-Furnished"
}
```
- **Response**:
```json
{
  "status": "success",
  "predicted_price": 6063000,
  "price_per_sqft": 4042.0,
  "estimated_range": {
    "min": 5760000,
    "max": 6366000
  },
  "input_features": { ... },
  "model_used": "Gradient Boosting Regressor"
}
```

### 3. Dataset Summary Statistics
- **Endpoint**: `GET /api/statistics`
- **Response**: Returns count, average price, median price, min/max prices, and categorical frequencies.

### 4. Analytics & Chart Data
- **Endpoint**: `GET /api/analytics`
- **Response**: Returns arrays for Area vs Price scatter, BHK aggregations, Location means, Age buckets, and Model performance metrics.

---

## 8. Installation & Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### Backend Setup (Python & Flask)
1. Navigate to the project root:
```bash
cd house-price-prediction
```

2. Create a Python virtual environment:
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate
```

3. Install required Python libraries:
```bash
pip install -r backend/requirements.txt
```

4. Train the ML models and serialize the best pipeline:
```bash
python backend/train_model.py
```
*Output: Serializes `house_price_model.pkl` and writes `model_metrics.json`.*

5. Run the Flask REST API server:
```bash
python backend/app.py
```
*The Flask API will start on `http://127.0.0.1:5001`.*

### Frontend Setup (React & Vite)
1. In another terminal window, install npm dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

---

## 9. Engineering College Viva & Defense Highlights

1. **Q: Why choose Gradient Boosting over Linear Regression?**
   - **A**: Real-estate values exhibit non-linear geographic and architectural elasticity. For example, moving from 2 BHK to 3 BHK in a prime metro location adds more value than the same transition in a rural region. Gradient boosting builds sequential decision trees that learn complex feature interactions and non-linear boundaries.

2. **Q: How does the system handle categorical variables?**
   - **A**: We apply `OneHotEncoder` via Scikit-Learn's `ColumnTransformer`. Unknown categories at inference time are handled gracefully using `handle_unknown='ignore'`.

3. **Q: How is data leakage prevented?**
   - **A**: The data split (`train_test_split`) is executed prior to any scaling or transformation. The `StandardScaler` and `OneHotEncoder` are fitted **only** on the training partition (`X_train`), and merely transform the test partition (`X_test`).

4. **Q: How is the Price-per-Square-Foot calculated?**
   - **A**: It is computed dynamically as $\text{Price per Sq.Ft} = \frac{\text{Predicted Price}}{\text{Area}}$. This normalizes property comparisons regardless of differing floor plans.

---

## 10. Future Enhancements
- Advanced geolocation radius scoring with automated calculations.
- Inclusion of satellite and street-view image feature extraction using Convolutional Neural Networks (CNNs).
- Integration of real-time mortgage and EMI calculators with live bank interest rates.
