import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { PredictPage } from './pages/PredictPage';
import { ComparePage } from './pages/ComparePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DashboardPage } from './pages/DashboardPage';
import { AboutPage } from './pages/AboutPage';
import { ComparisonProperty, PredictionResult } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [comparisonDeck, setComparisonDeck] = useState<ComparisonProperty[]>([]);
  const [recentValuations, setRecentValuations] = useState<PredictionResult[]>([]);

  const handleSaveToCompare = (propWithPrice: any) => {
    const newEntry: ComparisonProperty = {
      ...propWithPrice,
      id: `prop-deck-${Date.now()}`,
      name: `${propWithPrice.location} ${propWithPrice.bedrooms} BHK (${propWithPrice.property_type})`
    };
    setComparisonDeck(prev => [newEntry, ...prev.slice(0, 4)]);
  };

  const handleAddRecentValuation = (val: PredictionResult) => {
    setRecentValuations(prev => [val, ...prev.slice(0, 9)]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Universal Top Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Viewport */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage onNavigate={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === 'predict' && (
          <PredictPage
            onSaveToCompare={(prop) => {
              handleSaveToCompare(prop);
              handleAddRecentValuation({
                predicted_price: prop.price,
                price_per_sqft: prop.price_per_sqft,
                input_features: prop,
                timestamp: new Date().toLocaleTimeString()
              });
            }}
          />
        )}

        {activeTab === 'compare' && (
          <ComparePage
            customProperties={comparisonDeck}
            onAddProperty={(prop) => setComparisonDeck(prev => [prop, ...prev])}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPage />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            onNavigate={(tab) => setActiveTab(tab)}
            recentValuations={recentValuations}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* Universal Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-800">Smart House Price Predictor</span>
            <span className="mx-2">·</span>
            <span>Machine Learning Property Valuation & Analytics</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('about')} className="hover:text-slate-800 transition-colors">
              Documentation
            </button>
            <span>·</span>
            <button onClick={() => setActiveTab('analytics')} className="hover:text-slate-800 transition-colors">
              Model Performance
            </button>
            <span>·</span>
            <button onClick={() => setActiveTab('predict')} className="hover:text-slate-800 transition-colors">
              Valuation Tool
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
