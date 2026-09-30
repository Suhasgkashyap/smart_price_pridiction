export interface PropertyInput {
  location: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  property_age: number;
  parking: number;
  floors: number;
  property_type: 'Apartment' | 'Independent House' | 'Villa' | 'Penthouse' | string;
  furnishing_status: 'Unfurnished' | 'Semi-Furnished' | 'Fully-Furnished' | string;
}

export interface PredictionResult {
  predicted_price: number;
  price_per_sqft: number;
  estimated_range?: {
    min: number;
    max: number;
  };
  input_features: PropertyInput;
  model_used?: string;
  timestamp?: string;
}

export interface DatasetStatistics {
  total_properties: number;
  avg_price: number;
  median_price: number;
  min_price: number;
  max_price: number;
  avg_area: number;
  avg_price_per_sqft: number;
  property_type_counts: Record<string, number>;
  location_counts: Record<string, number>;
  furnishing_counts: Record<string, number>;
}

export interface ModelMetricItem {
  model: string;
  mae: number;
  rmse: number;
  r2_score: number;
  is_best?: boolean;
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number;
}

export interface AnalyticsData {
  area_vs_price: Array<{
    area: number;
    price: number;
    location: string;
    bedrooms: number;
    property_type: string;
  }>;
  bedrooms_vs_price: Array<{
    bedrooms: string;
    avg_price: number;
    avg_sqft: number;
    count: number;
  }>;
  location_vs_price: Array<{
    location: string;
    avg_price: number;
    avg_price_sqft: number;
    count: number;
  }>;
  age_vs_price: Array<{
    age_group: string;
    avg_price: number;
    avg_sqft_price: number;
    count: number;
  }>;
  model_performance: ModelMetricItem[];
  feature_importances: FeatureImportanceItem[];
  best_model: string;
}

export interface LocationMetadata {
  locations: string[];
  property_types: string[];
  furnishing_statuses: string[];
  min_area: number;
  max_area: number;
}

export interface ComparisonProperty extends PropertyInput {
  id: string;
  name: string;
  price: number;
  price_per_sqft: number;
}
