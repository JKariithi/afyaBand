import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { VitalReading, HealthInsight, ConnectionStatus } from '@/types';
import { deviceService } from '@/services/mockDeviceService';
import { analyzeVitals } from '@/services/healthAnalysisService';
import VitalCard from '@/components/dashboard/VitalCard';
import RealTimeChart from '@/components/dashboard/RealTimeChart';
import InsightPanel from '@/components/dashboard/InsightPanel';
import { Heart, Activity, Settings, Home, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [readings, setReadings] = useState<VitalReading[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [insight, setInsight] = useState<HealthInsight | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Buffer to hold readings for chart (limit history to 60 seconds for performance)
  const MAX_HISTORY = 60;

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      deviceService.disconnect();
    };
  }, []);

  const latest = readings.length > 0 ? readings[readings.length - 1] : null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-muted text-foreground font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-card border-r border-border flex flex-col z-10">
        <div 
          className="p-6 border-b border-border flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors" 
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Activity className="text-primary-foreground w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-card-foreground">Afya Band</span>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-secondary text-primary rounded-xl font-medium transition-colors">
            <Activity className="w-5 h-5" />
            Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-card-foreground rounded-xl font-medium transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-card-foreground rounded-xl font-medium transition-colors mt-auto"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </nav>

        <div className="p-4 border-t border-border">
          <div className={cn(
            "rounded-xl p-4 flex items-center gap-3",
            connectionStatus === ConnectionStatus.CONNECTED 
              ? 'bg-success/10 border border-success/20' 
              : 'bg-muted'
          )}>
            <div className={cn(
              "w-3 h-3 rounded-full",
              connectionStatus === ConnectionStatus.CONNECTED 
                ? 'bg-success animate-pulse' 
                : 'bg-muted-foreground'
            )}></div>
            <div>
              <p className="text-xs font-bold uppercase text-muted-foreground mb-0.5">Device Status</p>
              <p className={cn(
                "text-sm font-medium",
                connectionStatus === ConnectionStatus.CONNECTED 
                  ? 'text-success' 
                  : 'text-muted-foreground'
              )}>
                {connectionStatus === ConnectionStatus.CONNECTED ? 'Monitoring Active' : 
                 connectionStatus === ConnectionStatus.CONNECTING ? 'Connecting...' : 'Disconnected'}
              </p>
            </div>
          </div>
          <Button
            onClick={toggleConnection}
            variant={connectionStatus === ConnectionStatus.CONNECTED ? "outline" : "default"}
            className="mt-3 w-full"
          >
            {connectionStatus === ConnectionStatus.CONNECTED ? 'Stop Monitoring' : 
             connectionStatus === ConnectionStatus.CONNECTING ? 'Connecting...' : 'Connect Wristband'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Health Dashboard</h1>
            <p className="text-muted-foreground">Real-time wristband monitoring & AI analysis</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded text-xs font-bold">
              Demo Mode
            </div>
          </div>
        </header>

        {/* Top Vitals Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <VitalCard
            label="Heart Rate"
            value={latest ? latest.heartRate.toString() : '--'}
            unit="BPM"
            icon={<Heart className="text-health-pink w-6 h-6" />}
            colorClass="bg-health-pink/10 text-health-pink"
          />
          <VitalCard
            label="Systolic BP"
            value={latest ? latest.systolic.toString() : '--'}
            unit="mmHg"
            icon={<Activity className="text-primary w-6 h-6" />}
            colorClass="bg-primary/10 text-primary"
          />
          <VitalCard
            label="Diastolic BP"
            value={latest ? latest.diastolic.toString() : '--'}
            unit="mmHg"
            icon={<Activity className="text-indigo-500 w-6 h-6" />}
            colorClass="bg-indigo-100 text-indigo-600"
          />
          <VitalCard
            label="Risk Factor"
            value={insight ? (insight.status === 'normal' ? 'Low' : 'Check') : '--'}
            unit="Level"
            icon={insight?.status === 'warning' || insight?.status === 'critical' 
              ? <AlertCircle className="text-amber-500 w-6 h-6" /> 
              : <CheckCircle2 className="text-success w-6 h-6" />}
            colorClass={insight?.status === 'warning' || insight?.status === 'critical' 
              ? "bg-amber-100 text-amber-600" 
              : "bg-success/10 text-success"}
          />
        </div>

        {/* Main Charts & Insight Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <RealTimeChart
              title="Heart Rate Trend"
              data={readings}
              dataKey="heartRate"
              color="hsl(var(--health-pink))"
              unit="bpm"
            />
            <RealTimeChart
              title="Blood Pressure"
              data={readings}
              dataKey={['systolic', 'diastolic']}
              color={['hsl(var(--primary))', '#6366f1']}
              unit="mmHg"
            />
          </div>
          <div className="lg:col-span-1">
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
};

export default Dashboard;
