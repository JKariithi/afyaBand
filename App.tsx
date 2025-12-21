import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  return (
    <>
      {currentView === 'landing' ? (
        <LandingPage onNavigateDashboard={() => setCurrentView('dashboard')} />
      ) : (
        <Dashboard onNavigateHome={() => setCurrentView('landing')} />
      )}
    </>
  );
}