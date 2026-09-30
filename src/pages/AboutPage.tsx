import React from 'react';
import {
  Cpu,
  Database,
  Layers,
  CheckCircle2,
  GitBranch,
  BarChart,
  Binary,
  Terminal,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Dataset Acquisition & Schema Design',
      desc: 'The dataset consists of 1,200 real-world modeled residential property records across Shivamogga, Bengaluru, Mysore, Mangalore, Hubli, Hyderabad, Pune, and Chennai. Features incorporate area, bedrooms, bathrooms, property age, parking slots, floor count, furnishing status, and property type.'
    },
    {
      num: '02',
      title: 'Data Preprocessing & Validation Pipeline',
      desc: 'Applied statistical cleaning with Pandas: duplicate removal, boundary filters (area: 300-10,000 sq.ft, valid bedroom-to-bathroom ratios), and missing value imputation (median for numerical, mode for categorical). Scikit-learn ColumnTransformer encapsulates StandardScaler for continuous variables and OneHotEncoder for nominal categoricals.'
    },
    {
      num: '03',
      title: 'Candidate Model Training & Benchmarking',
      desc: 'Trained three distinct regression paradigms: Ordinary Least Squares (Linear Regression), Random Forest Regressor (120 bagged decision trees), and Gradient Boosting Regressor (150 boosted estimators with a learning rate of 0.08). The training set utilizes 80% (960 rows) with 20% (240 rows) reserved for test evaluation.'
    },
    {
      num: '04',
      title: 'Evaluation Metrics & Model Selection',
      desc: 'Models are scored using Mean Absolute Error (MAE), Root Mean Squared Error (RMSE), and the Coefficient of Determination (R² Score). Gradient Boosting demonstrated the highest test R² (96.76%) and lowest RMSE, automatically being selected as the production model.'
    },
    {
      num: '05',
      title: 'Model Serialization & REST Serving',
      desc: 'The trained ColumnTransformer and Gradient Boosting pipeline are serialized as a single cohesive artifact into Joblib format (`house_price_model.pkl`). The Flask backend exposes `/api/predict` to receive user inputs, apply exact preprocessing transforms, and return price estimates alongside standardized price-per-sq.ft metrics.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
          <Cpu className="w-3.5 h-3.5" />
          <span>Engineering Project Documentation</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Machine Learning Methodology & Architecture
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-1">
          Technical specifications, mathematical formulation, and operational pipeline of the Smart House Price Predictor.
        </p>
      </div>

      {/* System Flow Diagram */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900">
          End-to-End System Architecture Flow
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              1
            </div>
            <div className="font-bold text-slate-900">Client UI (React/Vite)</div>
            <p className="text-slate-600">
              Interactive prediction form collects 9 features with client-side boundary validation.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              2
            </div>
            <div className="font-bold text-slate-900">REST API Gateway</div>
            <p className="text-slate-600">
              Flask / Express route validates payloads, logs requests, and dispatches JSON inputs.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              3
            </div>
            <div className="font-bold text-slate-900">Joblib ML Pipeline</div>
            <p className="text-slate-600">
              Applies ColumnTransformer scaling + One-Hot encoding; runs Gradient Boosting inference.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              4
            </div>
            <div className="font-bold text-slate-900">Valuation & Analytics</div>
            <p className="text-slate-600">
              Returns predicted price, price-per-sq.ft, confidence intervals, and comparison metrics.
            </p>
          </div>
        </div>
      </div>

      {/* 5-Step Deep Dive */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Step-by-Step Machine Learning Pipeline
        </h2>

        <div className="space-y-4">
          {steps.map((s) => (
            <div
              key={s.num}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-start gap-5 hover:border-indigo-200 transition-all shadow-2xs"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-mono font-bold text-lg shrink-0">
                {s.num}
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="text-base font-bold text-slate-900">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Algorithms Benchmark Comparison Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Algorithms Benchmark Comparison Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Evaluated on 240 unseen test property listings
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Validated Test Set
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Algorithm</th>
                <th className="py-3 px-4">Hyperparameters</th>
                <th className="py-3 px-4">MAE (₹)</th>
                <th className="py-3 px-4">RMSE (₹)</th>
                <th className="py-3 px-4">R² Score</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-4 font-bold text-slate-900">Linear Regression</td>
                <td className="py-3.5 px-4 text-slate-600">Ordinary Least Squares</td>
                <td className="py-3.5 px-4 font-mono tabular-nums">₹21,79,400</td>
                <td className="py-3.5 px-4 font-mono tabular-nums">₹34,73,073</td>
                <td className="py-3.5 px-4 font-mono font-semibold text-indigo-600">0.9095 (90.9%)</td>
                <td className="py-3.5 px-4 text-slate-500">Baseline</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-4 font-bold text-slate-900">Random Forest Regressor</td>
                <td className="py-3.5 px-4 text-slate-600">n_estimators=120, max_depth=12</td>
                <td className="py-3.5 px-4 font-mono tabular-nums">₹15,83,512</td>
                <td className="py-3.5 px-4 font-mono tabular-nums">₹26,39,771</td>
                <td className="py-3.5 px-4 font-mono font-semibold text-indigo-600">0.9477 (94.8%)</td>
                <td className="py-3.5 px-4 text-slate-500">Candidate</td>
              </tr>
              <tr className="bg-indigo-50/40">
                <td className="py-3.5 px-4 font-bold text-indigo-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Gradient Boosting Regressor</span>
                </td>
                <td className="py-3.5 px-4 text-indigo-950">n_estimators=150, lr=0.08, depth=5</td>
                <td className="py-3.5 px-4 font-mono tabular-nums font-bold text-emerald-700">₹12,80,283</td>
                <td className="py-3.5 px-4 font-mono tabular-nums font-bold text-emerald-700">₹20,77,252</td>
                <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 text-sm">0.9676 (96.8%)</td>
                <td className="py-3.5 px-4">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Winner (Saved)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* College Project Defense / Viva Questions Guide */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
          <Terminal className="w-4 h-4" />
          <span>Viva Voce & Technical Defense Highlights</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="space-y-1.5 bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="font-bold text-white text-sm">Why Gradient Boosting outperformed Linear Regression?</div>
            <p className="leading-relaxed">
              Real estate prices exhibit non-linear interactions: a 2,000 sq.ft villa in Bengaluru carries a non-linear location premium compared to a 2,000 sq.ft apartment in a tier-2 city. Decision tree boosting models capture non-linear feature splits and interaction terms that simple linear lines underfit.
            </p>
          </div>
          <div className="space-y-1.5 bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="font-bold text-white text-sm">How is data leakage prevented?</div>
            <p className="leading-relaxed">
              We apply Scikit-learn Pipeline and ColumnTransformer where `fit` is called strictly on the training partition (`X_train`), and only `transform` is executed on test samples and live prediction requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
