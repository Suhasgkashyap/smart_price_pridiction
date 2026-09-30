import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  DollarSign,
  Maximize2,
  Minimize2,
  PieChart as PieIcon,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Home
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { api } from '../services/api';
import { DatasetStatistics, PredictionResult } from '../types';
import { formatINR, formatSqftPrice, formatNumber, formatCompactINR } from '../utils/formatters';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
  recentValuations?: PredictionResult[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  recentValuations = []
}) => {
  const [stats, setStats] = useState<DatasetStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getStatistics();
      setStats(res);
    } catch (err: any) {
      console.error('Stats fetch error:', err);
      setError('Could not retrieve dataset summary statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="text-slate-600 text-sm font-medium">
          Loading Real-Estate Intelligence Dashboard...
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl max-w-md mx-auto text-rose-800 text-sm">
          <p className="font-semibold">{error || 'Data unavailable.'}</p>
          <button
            onClick={fetchStats}
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700"
          >
            Retry Fetching
          </button>
        </div>
      </div>
    );
  }

  // Prepare chart data from stats
  const typeChartData = Object.entries(stats.property_type_counts || {}).map(([name, count]) => ({
    name,
    count
  }));

  const locationChartData = Object.entries(stats.location_counts || {}).map(([name, count]) => ({
    name,
    count
  }));

  const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6'];

  // Default sample history if user has not yet made predictions in this session
  const displayValuations = recentValuations.length > 0 ? recentValuations : [
    {
      predicted_price: 6500000,
      price_per_sqft: 4333.33,
      input_features: {
        location: 'Shivamogga',
        area: 1500,
        bedrooms: 3,
        bathrooms: 2,
        property_age: 5,
        parking: 1,
        floors: 2,
        property_type: 'Apartment',
        furnishing_status: 'Semi-Furnished'
      },
      timestamp: 'Sample Record'
    },
    {
      predicted_price: 18500000,
      price_per_sqft: 8409.09,
      input_features: {
        location: 'Bengaluru',
        area: 2200,
        bedrooms: 4,
        bathrooms: 3,
        property_age: 2,
        parking: 2,
        floors: 2,
        property_type: 'Villa',
        furnishing_status: 'Fully-Furnished'
      },
      timestamp: 'Sample Record'
    },
    {
      predicted_price: 4800000,
      price_per_sqft: 4000.0,
      input_features: {
        location: 'Mysore',
        area: 1200,
        bedrooms: 2,
        bathrooms: 2,
        property_age: 6,
        parking: 1,
        floors: 1,
        property_type: 'Independent House',
        furnishing_status: 'Unfurnished'
      },
      timestamp: 'Sample Record'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dataset & Valuation Command Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Real Estate Dashboard
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Aggregated market indicators, sample density metrics, and real-time valuation logs.
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-all shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Five Dashboard KPI Cards (Prompt Requirement 10) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* Card 1: Total Properties */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Properties</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">
            {formatNumber(stats.total_properties)}
          </div>
          <div className="text-[11px] text-slate-400">
            Active training & test records
          </div>
        </div>

        {/* Card 2: Average Property Price */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Average Price</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">
            {formatCompactINR(stats.avg_price)}
          </div>
          <div className="text-[11px] text-slate-400 font-mono tabular-nums">
            Mean: {formatINR(stats.avg_price)}
          </div>
        </div>

        {/* Card 3: Average Price per sq.ft. */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Price / sq.ft</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">
            {formatSqftPrice(stats.avg_price_per_sqft)}
          </div>
          <div className="text-[11px] text-slate-400 font-mono tabular-nums">
            Avg Area: {formatNumber(stats.avg_area)} sq.ft
          </div>
        </div>

        {/* Card 4: Maximum Property Price */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Maximum Price</span>
            <Maximize2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">
            {formatCompactINR(stats.max_price)}
          </div>
          <div className="text-[11px] text-slate-400 font-mono tabular-nums">
            High: {formatINR(stats.max_price)}
          </div>
        </div>

        {/* Card 5: Minimum Property Price */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Minimum Price</span>
            <Minimize2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">
            {formatCompactINR(stats.min_price)}
          </div>
          <div className="text-[11px] text-slate-400 font-mono tabular-nums">
            Low: {formatINR(stats.min_price)}
          </div>
        </div>
      </div>

      {/* Middle Section: Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Properties by Location */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Location Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Number of properties registered across regional hubs
              </p>
            </div>
            <MapPin className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationChartData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any) => [val, 'Properties']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Properties by Property Type */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Property Type Composition
              </h3>
              <p className="text-xs text-slate-500">
                Proportion of Apartments, Villas, Houses, and Penthouses
              </p>
            </div>
            <PieIcon className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {typeChartData.map((_, index) => (
                    <Cell key={`type-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} listings`, name]}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
            {typeChartData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span>{item.name} ({item.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Predictions Table (Prompt Requirement 10) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                Recent Model Predictions & Valuation History
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live log of real-time estimations produced by the Scikit-learn inference pipeline.
            </p>
          </div>

          <button
            onClick={() => onNavigate('predict')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            <span>Run New Valuation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Area</th>
                <th className="py-3 px-4">BHK</th>
                <th className="py-3 px-4">Age</th>
                <th className="py-3 px-4">Furnishing</th>
                <th className="py-3 px-4 text-right">Price per Sq.Ft</th>
                <th className="py-3 px-4 text-right">Estimated Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {displayValuations.map((v, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors font-sans">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {v.input_features.location}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {v.input_features.property_type}
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700">
                    {formatNumber(v.input_features.area)} sq.ft
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700">
                    {v.input_features.bedrooms} BHK
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700">
                    {v.input_features.property_age} yrs
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {v.input_features.furnishing_status}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-indigo-600 font-semibold">
                    {formatSqftPrice(v.price_per_sqft)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900 text-sm">
                    {formatINR(v.predicted_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
