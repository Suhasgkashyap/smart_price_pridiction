import axios from 'axios';
import {
  PropertyInput,
  PredictionResult,
  DatasetStatistics,
  AnalyticsData,
  LocationMetadata
} from '../types';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = {
  async checkHealth(): Promise<{ status: string; message: string; model_loaded?: boolean }> {
    const res = await apiClient.get('/health');
    return res.data;
  },

  async predictHousePrice(property: PropertyInput): Promise<PredictionResult> {
    const res = await apiClient.post('/predict', property);
    return res.data;
  },

  async getStatistics(): Promise<DatasetStatistics> {
    const res = await apiClient.get('/statistics');
    return res.data;
  },

  async getAnalytics(): Promise<AnalyticsData> {
    const res = await apiClient.get('/analytics');
    return res.data;
  },

  async getLocations(): Promise<LocationMetadata> {
    const res = await apiClient.get('/locations');
    return res.data;
  }
};
