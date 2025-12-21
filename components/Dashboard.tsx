import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VitalReading, HealthInsight, ConnectionStatus } from '../types';
import { deviceService } from '../services/mockDeviceService';
import { analyzeVitals } from '../services/geminiService';
import VitalCard from './VitalCard';
import RealTimeChart from './RealTimeChart';
import InsightPanel from './InsightPanel';
import { HeartIcon, ActivityIcon, SettingsIcon, CheckCircleIcon, AlertIcon } from './Icons';

interface DashboardProps {
  onNavigateHome: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigateHome }) => {
  const [readings, setReadings] = useState<VitalReading[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [insight, setInsight] = useState<HealthInsight | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Buffer to hold readings for chart (limit history to 60 seconds for performance)
  const MAX_HISTORY = 60;

  // Auto-analyze interval ref
  const analysisIntervalRef = useRef<number | null>(null);

  const performAnalysis = useCallback(async () => {
    if (readings.length < 5 || isAnalyzing) return;
    
    setIsAnalyzing(true);
    const result = await analyzeVitals(readings);
    setInsight(result);
    setIsAnalyzing(false);
  }, [readings, isAnalyzing]);

  // Connect to the mock device
  const toggleConnection = () => {
    if (connectionStatus === ConnectionStatus.CONNECTED) {
      deviceService.disconnect();
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
      if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
    } else {
      setConnectionStatus(ConnectionStatus.CONNECTING);
      
      // Simulate connection delay
      setTimeout(() => {
        setConnectionStatus(ConnectionStatus.CONNECTED);
        
        deviceService.connect((data) => {
          setReadings(prev => {
            const newReadings = [...prev, data];
            if (newReadings.length > MAX_HISTORY) {
              return newReadings.slice(newReadings.length - MAX_HISTORY);
            }
            return newReadings;
          });
        });

        // Setup auto-analysis every 15 seconds
        analysisIntervalRef.current = window.setInterval(() => {
           // Analysis trigger
        }, 15000);

      }, 800);
    }
  };

  // Trigger analysis periodically if connected
  useEffect(() => {
    let interval: number;
    if (connectionStatus === ConnectionStatus.CONNECTED) {
      interval = window.setInterval(() => {
        if (readings.length > 10) {
           analyzeVitals(readings.slice(-20)).then(res => setInsight(res));
        }
      }, 10000); // Analyze every 10 seconds
    }
    return () => clearInterval(interval);
  }, [connectionStatus, readings]);

  const latest = readings.length > 0 ? readings[readings.length - 1] : null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col z-10">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3 cursor-pointer" onClick={onNavigateHome}>
          <div className="w-8 h-8 bg-[#1976D2] rounded-lg flex items-center justify-center">
            <ActivityIcon className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">Afya Band</span>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#E3F2FD] text-[#1976D2] rounded-xl font-medium transition-colors">
            <ActivityIcon className="w-5 h-5" />
            Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl font-medium transition-colors">
            <SettingsIcon className="w-5 h-5" />
            Settings
          </button>
          <button onClick={onNavigateHome} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl font-medium transition-colors mt-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Back to Home
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
           <div className={`rounded-xl p-4 flex items-center gap-3 ${connectionStatus === ConnectionStatus.CONNECTED ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-100'}`}>
              <div className={`w-3 h-3 rounded-full ${connectionStatus === ConnectionStatus.CONNECTED ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-500 mb-0.5">Device Status</p>
                <p className={`text-sm font-medium ${connectionStatus === ConnectionStatus.CONNECTED ? 'text-emerald-700' : 'text-slate-600'}`}>
                  {connectionStatus === ConnectionStatus.CONNECTED ? 'Monitoring Active' : 'Disconnected'}
                </p>
              </div>
           </div>
           <button 
            onClick={toggleConnection}
            className={`mt-3 w-full py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
              connectionStatus === ConnectionStatus.CONNECTED 
              ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
           >
             {connectionStatus === ConnectionStatus.CONNECTED ? 'Stop Monitoring' : 'Connect Wristband'}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Health Dashboard</h1>
            <p className="text-slate-500">Real-time wristband monitoring & AI analysis</p>
          </div>
          <div className="flex gap-2">
             {!process.env.API_KEY && (
               <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded text-xs font-bold">
                 Demo Mode: No API Key
               </div>
             )}
          </div>
        </header>

        {/* Top Vitals Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <VitalCard 
            label="Heart Rate" 
            value={latest ? latest.heartRate.toString() : '--'} 
            unit="BPM" 
            icon={<HeartIcon className="text-rose-500" />}
            colorClass="bg-rose-50 text-rose-600"
          />
          <VitalCard 
            label="Systolic BP" 
            value={latest ? latest.systolic.toString() : '--'} 
            unit="mmHg" 
            icon={<ActivityIcon className="text-blue-500" />}
            colorClass="bg-blue-50 text-blue-600"
          />
           <VitalCard 
            label="Diastolic BP" 
            value={latest ? latest.diastolic.toString() : '--'} 
            unit="mmHg" 
            icon={<ActivityIcon className="text-indigo-500" />}
            colorClass="bg-indigo-50 text-indigo-600"
          />
           <VitalCard 
            label="Risk Factor" 
            value={insight ? (insight.status === 'normal' ? 'Low' : 'Check') : '--'} 
            unit="Level" 
            icon={insight?.status === 'warning' || insight?.status === 'critical' ? <AlertIcon className="text-amber-500" /> : <CheckCircleIcon className="text-emerald-500" />}
            colorClass={insight?.status === 'warning' || insight?.status === 'critical' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}
          />
        </div>

        {/* Main Charts & Insight Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
          <div className="lg:col-span-2 flex flex-col gap-6 h-full">
            <div className="flex-1 min-h-0">
               <RealTimeChart 
                title="Heart Rate Trend"
                data={readings}
                dataKey="heartRate"
                color="#f43f5e"
                unit="bpm"
               />
            </div>
            <div className="flex-1 min-h-0">
               <RealTimeChart 
                title="Blood Pressure"
                data={readings}
                dataKey={['systolic', 'diastolic']}
                color={['#3b82f6', '#6366f1']}
                unit="mmHg"
               />
            </div>
          </div>
          <div className="lg:col-span-1 h-full">
            <InsightPanel 
              insight={insight} 
              isLoading={isAnalyzing} 
              onAnalyze={performAnalysis}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;