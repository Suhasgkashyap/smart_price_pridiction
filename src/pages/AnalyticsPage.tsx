import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  ScatterChart as ScatterIcon,
  Layers,
  Award,
  Calendar,
  Sparkles,
  Activity,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  Cell
} from 'recharts';
import { api } from '../services/api';
import { AnalyticsData, ModelMetricItem } from '../types';
import { formatINR, formatSqftPrice, formatNumber, formatCompactINR } from '../utils/formatters';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAnalytics();
      setData(res);
    } catch (err: any) {
      console.error('Analytics fetch error:', err);
      setError('Failed to load analytical dataset. Refresh to retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="text-slate-600 text-sm font-medium">
          Crunching Exploratory Data Analysis & Model Benchmarks...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl max-w-md mx-auto text-rose-800 text-sm">
          <p className="font-semibold">{error || 'Data could not be retrieved.'}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700"
          >
            Retry Fetching Analytics
          </button>
        </div>
      </div>
    );
  }

  const {
    area_vs_price,
    bedrooms_vs_price,
    location_vs_price,
    age_vs_price,
    model_performance,
    feature_importances,
    best_model
  } = data;

  const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6', '#14b8a6'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Exploratory Data Analysis & Empirical Statistics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Analytics & Model Intelligence
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Empirical regressions, feature correlations, and multi-model benchmark results across the real-estate dataset.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-all shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* SECTION 1: Model Benchmarks (Prompt Requirement Chart 6) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md mb-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Chart 6 · Machine Learning Model Performance</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Model Evaluation & Benchmarking
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative test performance on hold-out validation set across candidate regressors.
            </p>
          </div>
          <div className="text-xs bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5 text-indigo-900">
            <span className="font-semibold">Selected Production Model: </span>
            <span className="font-bold text-indigo-600">{best_model}</span>
          </div>
        </div>

        {/* Model Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {model_performance.map((m: ModelMetricItem) => {
            const isWinner = m.is_best;
            return (
              <div
                key={m.model}
                className={`rounded-2xl p-6 transition-all ${
                  isWinner
                    ? 'bg-gradient-to-b from-indigo-50/60 to-white border-2 border-indigo-600 shadow-md'
                    : 'bg-white border border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-4">
                  <h3 className="font-bold text-slate-900 text-sm">{m.model}</h3>
                  {isWinner && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Selected Best
                    </span>
                  )}
                </div>

                <div className="space-y-3 font-mono">
                  {/* R2 Score */}
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-sans">R² Score (Accuracy)</span>
                    <span className="text-base font-bold text-indigo-600 tabular-nums">
                      {(m.r2_score * 100).toFixed(2)}%
                    </span>
                  </div>

                  {/* MAE */}
                  <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 font-sans">
                    <span className="text-slate-500">Mean Absolute Error (MAE)</span>
                    <span className="font-semibold text-slate-800 font-mono tabular-nums">
                      {formatINR(m.mae)}
                    </span>
                  </div>

                  {/* RMSE */}
                  <div className="flex items-center justify-between text-xs py-1 font-sans">
                    <span className="text-slate-500">Root Mean Sq. Error (RMSE)</span>
                    <span className="font-semibold text-slate-800 font-mono tabular-nums">
                      {formatINR(m.rmse)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Importance bar chart if available */}
        {feature_importances && feature_importances.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Top Predictive Driver Weights (Feature Importances)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {feature_importances.slice(0, 5).map((f) => (
                <div key={f.feature} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-600 truncate font-medium">{f.feature}</div>
                  <div className="text-lg font-bold font-mono text-indigo-600 mt-1">{f.importance}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* SECTION 2: 2x2 Grid of Core EDA Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Area vs Price Scatter */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Chart 1 · Primary Regression
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Area (sq.ft) vs Property Price
            </h3>
            <p className="text-xs text-slate-500">
              Scatter distribution demonstrating square footage elasticity across records.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  dataKey="area"
                  name="Area"
                  unit=" sq.ft"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <YAxis
                  type="number"
                  dataKey="price"
                  name="Price"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                />
                <ZAxis range={[25, 25]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1 shadow-lg border border-slate-700">
                          <div className="font-bold text-indigo-300">{d.location} · {d.property_type}</div>
                          <div>Area: <span className="font-mono text-white">{formatNumber(d.area)} sq.ft</span></div>
                          <div>Price: <span className="font-mono text-emerald-400 font-semibold">{formatINR(d.price)}</span></div>
                          <div>Bedrooms: <span className="font-mono text-white">{d.bedrooms} BHK</span></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Properties" data={area_vs_price} fill="#4f46e5" fillOpacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Bedrooms vs Average Price */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Chart 2 · Room Scalability
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Bedrooms (BHK) vs Average Valuation
            </h3>
            <p className="text-xs text-slate-500">
              Shows how average market valuations scale with bedroom counts.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bedrooms_vs_price} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="bedrooms" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  formatter={(val: any) => [formatINR(Number(val)), 'Average Price']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="avg_price" fill="#06b6d4" radius={[6, 6, 0, 0]}>
                  {bedrooms_vs_price.map((_, index) => (
                    <Cell key={`bed-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Location vs Average Price */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Chart 3 · Geographical Geography
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Location vs Average Property Price
            </h3>
            <p className="text-xs text-slate-500">
              Average aggregate home valuation across target cities.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={location_vs_price} margin={{ top: 10, right: 10, left: 10, bottom: 35 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="location"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  formatter={(val: any) => [formatINR(Number(val)), 'Average Price']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="avg_price" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Price per Square Foot by Location */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Chart 4 · Normalized Real-Estate Rates
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Price per Square Foot by Location
            </h3>
            <p className="text-xs text-slate-500">
              Standardized sq.ft price baseline highlighting regional cost variations.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={location_vs_price} margin={{ top: 10, right: 10, left: 10, bottom: 35 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="location"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip
                  formatter={(val: any) => [formatSqftPrice(Number(val)), 'Avg Rate']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="avg_price_sqft" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 3: Chart 5 - Property Age vs Price (Depreciation Curve) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Chart 5 · Temporal Asset Depreciation
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Property Age vs Average Valuation
            </h3>
            <p className="text-xs text-slate-500">
              Reflects the depreciation dynamics of residential structures over time.
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={age_vs_price} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="ageColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="age_group" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
              />
              <Tooltip
                formatter={(val: any) => [formatINR(Number(val)), 'Average Valuation']}
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Area
                type="monotone"
                dataKey="avg_price"
                stroke="#8b5cf6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#ageColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
