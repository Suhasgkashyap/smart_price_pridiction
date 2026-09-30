import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Building,
  Home,
  MapPin,
  Calendar,
  Layers,
  Car,
  Bath,
  Bed,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  BookmarkPlus
} from 'lucide-react';
import { api } from '../services/api';
import { PropertyInput, PredictionResult, LocationMetadata } from '../types';
import { formatINR, formatSqftPrice, formatNumber, formatCompactINR } from '../utils/formatters';

interface PredictPageProps {
  onSaveToCompare?: (property: PropertyInput & { price: number; price_per_sqft: number }) => void;
}

export const PredictPage: React.FC<PredictPageProps> = ({ onSaveToCompare }) => {
  // Metadata options
  const [locations, setLocations] = useState<string[]>([
    'Shivamogga', 'Bengaluru', 'Mysore', 'Mangalore', 'Hubli', 'Hyderabad', 'Pune', 'Chennai'
  ]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([
    'Apartment', 'Independent House', 'Villa', 'Penthouse'
  ]);
  const [furnishingStatuses, setFurnishingStatuses] = useState<string[]>([
    'Unfurnished', 'Semi-Furnished', 'Fully-Furnished'
  ]);

  // Form State with realistic default values
  const [formData, setFormData] = useState<PropertyInput>({
    location: 'Shivamogga',
    area: 1500,
    bedrooms: 3,
    bathrooms: 2,
    property_age: 5,
    parking: 1,
    floors: 2,
    property_type: 'Apartment',
    furnishing_status: 'Semi-Furnished'
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [savedToCompare, setSavedToCompare] = useState<boolean>(false);

  // Load dynamic locations from API if available
  useEffect(() => {
    let isMounted = true;
    api.getLocations()
      .then((data: LocationMetadata) => {
        if (isMounted && data) {
          if (data.locations && data.locations.length > 0) setLocations(data.locations);
          if (data.property_types && data.property_types.length > 0) setPropertyTypes(data.property_types);
          if (data.furnishing_statuses && data.furnishing_statuses.length > 0) setFurnishingStatuses(data.furnishing_statuses);
        }
      })
      .catch((err) => {
        console.warn('Using standard real-estate locations fallback:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
    // Clear errors upon modification
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.location) {
      setError('Please select a valid property location.');
      return false;
    }
    if (!formData.area || formData.area <= 0) {
      setError('Area cannot be zero or negative. Please enter a valid square footage.');
      return false;
    }
    if (formData.area < 300 || formData.area > 20000) {
      setError('Please enter a realistic area between 300 and 20,000 sq.ft.');
      return false;
    }
    if (formData.bedrooms < 1) {
      setError('Number of bedrooms cannot be negative or zero.');
      return false;
    }
    if (formData.bathrooms < 1) {
      setError('Number of bathrooms cannot be negative or zero.');
      return false;
    }
    if (formData.property_age < 0) {
      setError('Property age cannot be negative.');
      return false;
    }
    if (formData.parking < 0) {
      setError('Parking spaces cannot be negative.');
      return false;
    }
    if (formData.floors < 1) {
      setError('Floors must be at least 1.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSavedToCompare(false);

    try {
      const response = await api.predictHousePrice({
        ...formData,
        area: Number(formData.area),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        property_age: Number(formData.property_age),
        parking: Number(formData.parking),
        floors: Number(formData.floors)
      });

      setResult({
        ...response,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to communicate with prediction server.';
      setError(`Valuation error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProperty = () => {
    if (!result) return;
    if (onSaveToCompare) {
      onSaveToCompare({
        ...result.input_features,
        price: result.predicted_price,
        price_per_sqft: result.price_per_sqft
      });
      setSavedToCompare(true);
      setTimeout(() => setSavedToCompare(false), 3000);
    }
  };

  // Quick Preset Handlers
  const applyPreset = (preset: Partial<PropertyInput>) => {
    setFormData(prev => ({
      ...prev,
      ...preset
    }));
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Model Inference</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          House Price Prediction
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-1">
          Enter verified architectural and geographical parameters below. The ML model computes an instant fair-market valuation and price per square foot.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
        <span className="font-semibold text-slate-700">Quick Scenarios:</span>
        <button
          type="button"
          onClick={() => applyPreset({ location: 'Shivamogga', area: 1500, bedrooms: 3, bathrooms: 2, property_age: 5, property_type: 'Apartment', furnishing_status: 'Semi-Furnished', parking: 1, floors: 2 })}
          className="px-2.5 py-1 bg-white border border-slate-200 rounded-md hover:border-indigo-400 hover:text-indigo-600 transition-colors shadow-2xs"
        >
          Shivamogga 3 BHK (1,500 sq.ft)
        </button>
        <button
          type="button"
          onClick={() => applyPreset({ location: 'Bengaluru', area: 2400, bedrooms: 4, bathrooms: 4, property_age: 2, property_type: 'Villa', furnishing_status: 'Fully-Furnished', parking: 2, floors: 3 })}
          className="px-2.5 py-1 bg-white border border-slate-200 rounded-md hover:border-indigo-400 hover:text-indigo-600 transition-colors shadow-2xs"
        >
          Bengaluru Luxury Villa (2,400 sq.ft)
        </button>
        <button
          type="button"
          onClick={() => applyPreset({ location: 'Mysore', area: 1100, bedrooms: 2, bathrooms: 2, property_age: 8, property_type: 'Independent House', furnishing_status: 'Semi-Furnished', parking: 1, floors: 1 })}
          className="px-2.5 py-1 bg-white border border-slate-200 rounded-md hover:border-indigo-400 hover:text-indigo-600 transition-colors shadow-2xs"
        >
          Mysore Starter House (1,100 sq.ft)
        </button>
      </div>

      {/* Grid: Form on Left, Result Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Banner */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <span className="font-semibold">Validation Notice: </span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Location */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Location / City</span>
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  required
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Property Type</span>
                </label>
                <select
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  required
                >
                  {propertyTypes.map(ptype => (
                    <option key={ptype} value={ptype}>{ptype}</option>
                  ))}
                </select>
              </div>

              {/* Total Area */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Area (Square Feet)</span>
                  </span>
                  <span className="text-[11px] font-normal text-slate-400">sq.ft</span>
                </label>
                <input
                  type="number"
                  name="area"
                  min="300"
                  max="20000"
                  step="25"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="e.g. 1500"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  required
                />
              </div>

              {/* Furnishing Status */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Furnishing Status</span>
                </label>
                <select
                  name="furnishing_status"
                  value={formData.furnishing_status}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  required
                >
                  {furnishingStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Bedrooms (BHK) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Bed className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Bedrooms (BHK)</span>
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  min="1"
                  max="12"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  required
                />
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Bath className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Bathrooms</span>
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  min="1"
                  max="10"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  required
                />
              </div>

              {/* Property Age */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Property Age</span>
                  </span>
                  <span className="text-[11px] font-normal text-slate-400">years</span>
                </label>
                <input
                  type="number"
                  name="property_age"
                  min="0"
                  max="80"
                  value={formData.property_age}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  required
                />
              </div>

              {/* Parking */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Parking Spaces</span>
                </label>
                <input
                  type="number"
                  name="parking"
                  min="0"
                  max="10"
                  value={formData.parking}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  required
                />
              </div>

              {/* Floors */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Total Floors / Floor Level</span>
                </label>
                <input
                  type="number"
                  name="floors"
                  min="1"
                  max="50"
                  value={formData.floors}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-md ${
                  loading
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 hover:shadow-indigo-200'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing property...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4" />
                    <span>Predict House Price</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Result Column */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className="bg-white rounded-2xl border-2 border-indigo-600 shadow-xl overflow-hidden transition-all animate-fade-in">
              {/* Header Badge */}
              <div className="bg-indigo-600 px-6 py-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-indigo-100 uppercase tracking-wider">
                      ML Estimation Result
                    </div>
                    <div className="text-base font-bold">
                      House Price Estimate
                    </div>
                  </div>
                </div>
                <div className="text-xs font-mono text-indigo-200">
                  {result.timestamp}
                </div>
              </div>

              {/* Main Estimation Figures */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                    Estimated Property Price
                  </div>
                  <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight mt-1 text-indigo-600">
                    {formatINR(result.predicted_price)}
                  </div>
                  <div className="text-sm font-medium text-slate-500 mt-1">
                    Equivalent to ~{formatCompactINR(result.predicted_price)}
                  </div>
                </div>

                {/* Primary Metric: Price per square foot */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-600">
                      Price per Square Foot
                    </span>
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                    {formatSqftPrice(result.price_per_sqft)}
                  </div>
                  <div className="text-xs text-slate-500">
                    Calculated as {formatINR(result.predicted_price)} ÷ {formatNumber(result.input_features.area)} sq.ft
                  </div>
                </div>

                {/* Specification Table */}
                <div className="border-t border-slate-100 pt-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Evaluated Property Parameters
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-lg">
                      <div className="text-slate-400">Location</div>
                      <div className="font-semibold text-slate-800 text-sm mt-0.5">{result.input_features.location}</div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg">
                      <div className="text-slate-400">Property Area</div>
                      <div className="font-semibold text-slate-800 text-sm font-mono tabular-nums mt-0.5">{formatNumber(result.input_features.area)} sq.ft</div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg">
                      <div className="text-slate-400">Bedrooms / BHK</div>
                      <div className="font-semibold text-slate-800 text-sm font-mono tabular-nums mt-0.5">{result.input_features.bedrooms} BHK</div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg">
                      <div className="text-slate-400">Bathrooms</div>
                      <div className="font-semibold text-slate-800 text-sm font-mono tabular-nums mt-0.5">{result.input_features.bathrooms} Baths</div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg">
                      <div className="text-slate-400">Property Age</div>
                      <div className="font-semibold text-slate-800 text-sm font-mono tabular-nums mt-0.5">{result.input_features.property_age} Years</div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg">
                      <div className="text-slate-400">Property Type</div>
                      <div className="font-semibold text-slate-800 text-sm mt-0.5">{result.input_features.property_type}</div>
                    </div>
                  </div>
                </div>

                {/* Actions & Compare Saver */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={handleSaveProperty}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                      savedToCompare
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400 hover:text-indigo-600'
                    }`}
                  >
                    {savedToCompare ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Added to Comparison Deck!</span>
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="w-4 h-4" />
                        <span>Add Property to Compare Deck</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Required Disclaimer */}
                <div className="text-[11px] text-slate-500 bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 leading-relaxed">
                  <span className="font-semibold text-amber-900">Disclaimer: </span>
                  Price shown is an ML-based estimate and may differ from actual market value based on negotiations, specific street access, legal title, and localized builder reputation.
                </div>
              </div>
            </div>
          ) : (
            /* Empty State Waiting for Prediction */
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
                <Calculator className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Ready for Property Valuation
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Fill in the property details on the left and click &quot;Predict House Price&quot; to invoke the Scikit-learn regression pipeline.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl text-left text-xs text-slate-600 space-y-2 border border-slate-100">
                <div className="font-semibold text-slate-800">What gets calculated:</div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Fair market value estimate in ₹ Indian Rupees</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Standardized price per square foot (₹ / sq.ft.)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Side-by-side comparison readiness</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
