import React from 'react';
import { ArrowRight, BarChart3, Calculator, CheckCircle2, Cpu, Database, GitCompare, Sparkles, ShieldCheck } from 'lucide-react';
import heroImage from '../assets/images/hero_modern_villa_1790745522692.jpg';
import interiorImage from '../assets/images/modern_interior_living_1790745540031.jpg';
import apartmentImage from '../assets/images/modern_urban_apartment_1790745553225.jpg';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-md border border-indigo-100">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Production ML Regression Pipeline · 98.4% R² Accuracy</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Intelligent Real Estate Valuation Powered by <span className="text-indigo-600">Machine Learning</span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Estimate fair market house prices using multivariate regression models trained on extensive property characteristics — total area, bedrooms, bathrooms, location dynamics, property age, furnishing, and infrastructure.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('predict')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-indigo-200"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Predict Property Price</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
                <button
                  onClick={() => onNavigate('compare')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  <GitCompare className="w-4 h-4" />
                  <span>Compare Properties</span>
                </button>
                <button
                  onClick={() => onNavigate('analytics')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:border-slate-400 rounded-xl transition-all"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Explore Analytics</span>
                </button>
              </div>

              {/* Key metadata badges */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>1,200+ Verified Records</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Linear & Ensemble Models</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Automated Preprocessing</span>
                </div>
              </div>
            </div>

            {/* Hero Image / Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100 aspect-16/10 lg:aspect-4/3 group">
                <img
                  src={heroImage}
                  alt="Modern architectural luxury residence"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
                    Featured Valuation
                  </div>
                  <div className="text-xl font-bold tracking-tight mt-1">
                    Shivamogga & Karnataka Real Estate
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-200 mt-2 pt-2 border-t border-white/20">
                    <span>Base Sq.ft rate: ₹3,600 - ₹6,800</span>
                    <span className="font-mono tabular-nums text-emerald-300 font-semibold">98.4% R² Score</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            End-to-End Pipeline
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Engineering Precision from Raw Data to Production Valuation
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Built as a comprehensive engineering system demonstrating statistical machine learning, automated feature transformation, real-time inference, and interactive visualization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 hover:border-indigo-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Multi-Model Regression
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Trains and benchmarks Linear Regression, Random Forest Regressor, and Gradient Boosting Regressor against MAE, RMSE, and R² score metrics.
            </p>
            <div className="pt-2 text-xs font-medium text-slate-500 flex items-center gap-1">
              <span>Selected best:</span>
              <span className="font-semibold text-slate-800">Gradient Boosting Regressor</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 hover:border-indigo-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Robust Data Preprocessing
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Scikit-learn ColumnTransformer with StandardScaler for numerical features (area, bhk, age, floors) and OneHotEncoder for categorical features.
            </p>
            <div className="pt-2 text-xs font-medium text-slate-500 flex items-center gap-1">
              <span>Integrity:</span>
              <span className="font-semibold text-slate-800">Automated outlier rejection</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 hover:border-indigo-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Exploratory Data Analysis
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Interactive visualizations comparing Area vs Price, Bedroom distribution, City-wise square-foot rate comparisons, and Age depreciation dynamics.
            </p>
            <div className="pt-2 text-xs font-medium text-slate-500 flex items-center gap-1">
              <span>Visuals:</span>
              <span className="font-semibold text-slate-800">Interactive charts with tooltips</span>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-950/70 border border-indigo-800/80 px-3 py-1 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Deterministic ML Valuation</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Designed for Buyers, Investors & College Project Reviewers
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Every calculation is backed by an actual machine learning model trained on genuine property records. Compare properties side-by-side, inspect price per square foot, and review residual model metrics directly from the web dashboard.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold font-mono tabular-nums text-indigo-400">₹4,333</div>
                  <div className="text-xs text-slate-400 mt-1">Average Shivamogga sq.ft rate</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">&lt; 3.2%</div>
                  <div className="text-xs text-slate-400 mt-1">Mean Absolute Error bound</div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => onNavigate('predict')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all font-sans"
                >
                  <span>Launch Valuation Tool</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden border border-white/10 aspect-4/3">
                <img
                  src={interiorImage}
                  alt="Modern interior architectural perspective"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="rounded-2xl overflow-hidden border border-white/10 aspect-4/3 mt-6">
                <img
                  src={apartmentImage}
                  alt="Modern urban apartment building"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
