import React, { useState } from 'react';
import {
  GitCompare,
  Plus,
  Trash2,
  Building,
  Home,
  MapPin,
  Calendar,
  Layers,
  Car,
  Bath,
  Bed,
  TrendingUp,
  ArrowRight,
  Info
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ComparisonProperty, PropertyInput } from '../types';
import { formatINR, formatSqftPrice, formatNumber, formatCompactINR } from '../utils/formatters';
import { api } from '../services/api';

interface ComparePageProps {
  customProperties?: ComparisonProperty[];
  onAddProperty?: (prop: ComparisonProperty) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({
  customProperties = [],
  onAddProperty
}) => {
  // Pre-seeded realistic baseline comparison properties matching user prompt examples
  const [properties, setProperties] = useState<ComparisonProperty[]>([
    {
      id: 'prop-1',
      name: 'Property A (Shivamogga 2 BHK)',
      location: 'Shivamogga',
      area: 1200,
      bedrooms: 2,
      bathrooms: 2,
      property_age: 5,
      parking: 1,
      floors: 1,
      property_type: 'Apartment',
      furnishing_status: 'Semi-Furnished',
      price: 5000000,
      price_per_sqft: 4166.67
    },
    {
      id: 'prop-2',
      name: 'Property B (Shivamogga 3 BHK)',
      location: 'Shivamogga',
      area: 1500,
      bedrooms: 3,
      bathrooms: 2,
      property_age: 3,
      parking: 1,
      floors: 2,
      property_type: 'Apartment',
      furnishing_status: 'Semi-Furnished',
      price: 6500000,
      price_per_sqft: 4333.33
    },
    {
      id: 'prop-3',
      name: 'Property C (Bengaluru Villa)',
      location: 'Bengaluru',
      area: 2200,
      bedrooms: 4,
      bathrooms: 3,
      property_age: 2,
      parking: 2,
      floors: 2,
      property_type: 'Villa',
      furnishing_status: 'Fully-Furnished',
      price: 18500000,
      price_per_sqft: 8409.09
    },
    ...customProperties
  ]);

  // Modal / Inline Add Form State
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newProp, setNewProp] = useState<PropertyInput & { name: string }>({
    name: 'Custom Property',
    location: 'Shivamogga',
    area: 1400,
    bedrooms: 3,
    bathrooms: 2,
    property_age: 4,
    parking: 1,
    floors: 2,
    property_type: 'Independent House',
    furnishing_status: 'Semi-Furnished'
  });

  const handleRemove = (id: string) => {
    if (properties.length <= 1) {
      alert('Keep at least one property in the comparison table.');
      return;
    }
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const handleAddNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Call ML prediction API for this custom property
      const res = await api.predictHousePrice(newProp);
      const addedProp: ComparisonProperty = {
        ...newProp,
        id: `prop-${Date.now()}`,
        price: res.predicted_price,
        price_per_sqft: res.price_per_sqft
      };
      setProperties(prev => [...prev, addedProp]);
      if (onAddProperty) onAddProperty(addedProp);
      setShowAddForm(false);
    } catch (err) {
      // In case of error, calculate based on area and base rate
      const fallbackPrice = newProp.area * 4200;
      const addedProp: ComparisonProperty = {
        ...newProp,
        id: `prop-${Date.now()}`,
        price: fallbackPrice,
        price_per_sqft: 4200
      };
      setProperties(prev => [...prev, addedProp]);
      setShowAddForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chart data preparation
  const priceChartData = properties.map(p => ({
    name: p.name.split(' (')[0],
    priceLakhs: Number((p.price / 100000).toFixed(2)),
    priceRaw: p.price,
    sqftRate: Math.round(p.price_per_sqft),
    area: p.area
  }));

  const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Multi-Property Analytical Matrix</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Compare Properties
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Examine side-by-side technical specifications, overall valuations, and price-per-square-foot metrics.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Property to Compare</span>
        </button>
      </div>

      {/* Quick notice: Zero-arbitrary bias compliance */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">Objective Comparison Protocol: </span>
          This tool presents empirical dimensional differences (area, pricing, age, location rate) without assigning arbitrary preference rankings, giving you complete autonomy to weigh personal priorities.
        </div>
      </div>

      {/* Side-by-Side Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((prop, index) => {
          const color = COLORS[index % COLORS.length];
          return (
            <div
              key={prop.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header color strip */}
                <div className="h-2 w-full" style={{ backgroundColor: color }} />

                <div className="p-6 space-y-5">
                  {/* Title & Delete */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {prop.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{prop.location}</span>
                        <span aria-hidden="true">·</span>
                        <span>{prop.property_type}</span>
                      </div>
                    </div>
                    {properties.length > 1 && (
                      <button
                        onClick={() => handleRemove(prop.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Primary Price Card */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Estimated Valuation
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                      {formatINR(prop.price)}
                    </div>
                    <div className="text-xs text-indigo-600 font-semibold font-mono tabular-nums">
                      {formatSqftPrice(prop.price_per_sqft)}
                    </div>
                  </div>

                  {/* Specification List */}
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-slate-400" />
                        <span>Total Area</span>
                      </span>
                      <span className="font-semibold text-slate-800 font-mono tabular-nums">
                        {formatNumber(prop.area)} sq.ft
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Bed className="w-3.5 h-3.5 text-slate-400" />
                        <span>Bedrooms</span>
                      </span>
                      <span className="font-semibold text-slate-800 font-mono tabular-nums">
                        {prop.bedrooms} BHK
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Bath className="w-3.5 h-3.5 text-slate-400" />
                        <span>Bathrooms</span>
                      </span>
                      <span className="font-semibold text-slate-800 font-mono tabular-nums">
                        {prop.bathrooms}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Property Age</span>
                      </span>
                      <span className="font-semibold text-slate-800 font-mono tabular-nums">
                        {prop.property_age} Years
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-slate-400" />
                        <span>Parking</span>
                      </span>
                      <span className="font-semibold text-slate-800 font-mono tabular-nums">
                        {prop.parking}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span>Floors</span>
                      </span>
                      <span className="font-semibold text-slate-800 font-mono tabular-nums">
                        {prop.floors}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-slate-500">Furnishing</span>
                      <span className="font-semibold text-slate-800">
                        {prop.furnishing_status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Metric Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Total Price Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Total Price Comparison (in ₹ Lakhs)
              </h3>
              <p className="text-xs text-slate-500">
                Direct total valuation differences across candidate properties
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceChartData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-10} textAnchor="end" />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `₹${v}L`}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${val} Lakhs`, 'Estimated Price']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="priceLakhs" radius={[6, 6, 0, 0]}>
                  {priceChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Price Per Sq.Ft Comparison Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Price per Sq.Ft Metric (₹ / sq.ft)
              </h3>
              <p className="text-xs text-slate-500">
                Area-normalized rate indicating geographical and quality premiums
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceChartData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-10} textAnchor="end" />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${val} / sq.ft`, 'Rate per sq.ft']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="sqftRate" radius={[6, 6, 0, 0]}>
                  {priceChartData.map((_, index) => (
                    <Cell key={`sqft-cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Add Property Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Add Custom Property to Compare
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNew} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Property Nickname / Label
                </label>
                <input
                  type="text"
                  value={newProp.name}
                  onChange={(e) => setNewProp(p => ({ ...p, name: e.target.value }))}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                  <select
                    value={newProp.location}
                    onChange={(e) => setNewProp(p => ({ ...p, location: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800"
                  >
                    {['Shivamogga', 'Bengaluru', 'Mysore', 'Mangalore', 'Hubli', 'Hyderabad', 'Pune', 'Chennai'].map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Property Type</label>
                  <select
                    value={newProp.property_type}
                    onChange={(e) => setNewProp(p => ({ ...p, property_type: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800"
                  >
                    {['Apartment', 'Independent House', 'Villa', 'Penthouse'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Area (sq.ft)</label>
                  <input
                    type="number"
                    min="300"
                    max="15000"
                    value={newProp.area}
                    onChange={(e) => setNewProp(p => ({ ...p, area: Number(e.target.value) }))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Furnishing</label>
                  <select
                    value={newProp.furnishing_status}
                    onChange={(e) => setNewProp(p => ({ ...p, furnishing_status: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800"
                  >
                    {['Unfurnished', 'Semi-Furnished', 'Fully-Furnished'].map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms (BHK)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newProp.bedrooms}
                    onChange={(e) => setNewProp(p => ({ ...p, bedrooms: Number(e.target.value) }))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={newProp.bathrooms}
                    onChange={(e) => setNewProp(p => ({ ...p, bathrooms: Number(e.target.value) }))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Property Age (years)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={newProp.property_age}
                    onChange={(e) => setNewProp(p => ({ ...p, property_age: Number(e.target.value) }))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Parking</label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={newProp.parking}
                    onChange={(e) => setNewProp(p => ({ ...p, parking: Number(e.target.value) }))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm"
                >
                  {isSubmitting ? 'Evaluating ML Model...' : 'Add Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
