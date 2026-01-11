import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { VitalReading, HealthInsight, ConnectionStatus, UserProfile } from '@/shared/types';
import { deviceService, analyzeVitals, predictHypertensionRisk, MLPredictionResult } from '@/shared/services';
import { VitalCard, RealTimeChart, InsightPanel } from '@/features/dashboard';
import { Heart, Activity, Settings, Home, AlertCircle, CheckCircle2, LogOut, History, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/shared/hooks';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const [readings, setReadings] = useState<VitalReading[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [insight, setInsight] = useState<HealthInsight | null>(null);
  const [mlPrediction, setMlPrediction] = useState<MLPredictionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showMLPrediction, setShowMLPrediction] = useState(false);
  const [savedReadingsCount, setSavedReadingsCount] = useState(0);
  
  // User profile for ML predictions (can be set from settings)
  const [userProfile] = useState<UserProfile>({
    age: 45,
    gender: 'male',
    bmi: 25.0
  });

  const MAX_HISTORY = 60;

  const saveReadingsToDatabase = useCallback(async (readingsToSave: VitalReading[]) => {
    if (!user || readingsToSave.length === 0) return;
    try {
      const { error } = await supabase.from('health_readings').insert(
        readingsToSave.map(reading => ({
          user_id: user.id,
          heart_rate: reading.heartRate,
          systolic: reading.systolic,
          diastolic: reading.diastolic,
          recorded_at: new Date(reading.timestamp).toISOString(),
        }))
      );
      if (!error) setSavedReadingsCount(prev => prev + readingsToSave.length);
    } catch (err) {
      console.error('Failed to save readings:', err);
    }
  }, [user]);

  const saveInsightToDatabase = useCallback(async (insightToSave: HealthInsight) => {
    if (!user) return;
    try {
      await supabase.from('health_insights').insert({
        user_id: user.id,
        status: insightToSave.status,
        summary: insightToSave.summary,
        recommendation: insightToSave.recommendation,
        recorded_at: new Date(insightToSave.timestamp).toISOString(),
      });
    } catch (err) {
      console.error('Failed to save insight:', err);
    }
  }, [user]);

  const performAnalysis = useCallback(async () => {
    if (readings.length < 5 || isAnalyzing) return;
    setIsAnalyzing(true);
    setShowMLPrediction(false);
    const result = await analyzeVitals(readings, userProfile);
    setInsight(result);
    await saveInsightToDatabase(result);
    setIsAnalyzing(false);
  }, [readings, isAnalyzing, saveInsightToDatabase, userProfile]);

  const performMLPrediction = useCallback(async () => {
    if (readings.length < 5 || isAnalyzing) return;
    setIsAnalyzing(true);
    setShowMLPrediction(true);
    try {
      const result = await predictHypertensionRisk(readings, userProfile, 'ensemble');
      setMlPrediction(result);
      toast({
        title: 'ML Prediction Complete',
        description: `Risk: ${result.riskScore}% (${result.model})`,
      });
    } catch (err) {
      console.error('ML prediction failed:', err);
      toast({
        title: 'ML Prediction Failed',
        description: 'Using fallback analysis',
        variant: 'destructive'
      });
    }
    setIsAnalyzing(false);
  }, [readings, isAnalyzing, userProfile, toast]);

  const toggleConnection = () => {
    if (connectionStatus === ConnectionStatus.CONNECTED) {
      deviceService.disconnect();
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
      if (readings.length > 0) saveReadingsToDatabase(readings.slice(-10));
      toast({ title: 'Monitoring stopped', description: `${savedReadingsCount} readings saved.` });
    } else {
      setConnectionStatus(ConnectionStatus.CONNECTING);
      setSavedReadingsCount(0);
      setTimeout(() => {
        setConnectionStatus(ConnectionStatus.CONNECTED);
        deviceService.connect((data) => {
          setReadings(prev => {
            const newReadings = [...prev, data];
            if (newReadings.length % 10 === 0) saveReadingsToDatabase(newReadings.slice(-10));
            return newReadings.length > MAX_HISTORY ? newReadings.slice(-MAX_HISTORY) : newReadings;
          });
        });
        toast({ title: 'Wristband connected', description: 'Live monitoring has started.' });
      }, 800);
    }
  };

  useEffect(() => {
    let interval: number;
    if (connectionStatus === ConnectionStatus.CONNECTED) {
      interval = window.setInterval(() => {
        if (readings.length > 10) {
          analyzeVitals(readings.slice(-20)).then(res => {
            setInsight(res);
            saveInsightToDatabase(res);
          });
        }
      }, 15000);
    }
    return () => clearInterval(interval);
  }, [connectionStatus, readings, saveInsightToDatabase]);

  useEffect(() => () => { deviceService.disconnect(); }, []);

  const handleSignOut = async () => {
    deviceService.disconnect();
    await signOut();
    navigate('/');
  };

  const latest = readings.length > 0 ? readings[readings.length - 1] : null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-muted text-foreground font-sans">
      <aside className="w-full md:w-64 bg-card border-r border-border flex flex-col z-10">
        <div className="p-6 border-b border-border flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Activity className="text-primary-foreground w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-card-foreground">Afya Band</span>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-secondary text-primary rounded-xl font-medium"><Activity className="w-5 h-5" />Dashboard</button>
          <button onClick={() => navigate('/history')} className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-xl font-medium"><History className="w-5 h-5" />History</button>
          <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-xl font-medium"><Settings className="w-5 h-5" />Settings</button>
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-xl font-medium"><Home className="w-5 h-5" />Back to Home</button>
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3 p-3 bg-muted rounded-xl">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-primary" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground">{savedReadingsCount > 0 ? `${savedReadingsCount} readings saved` : 'No readings yet'}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}><LogOut className="w-4 h-4 mr-2" />Sign Out</Button>
        </div>
        <div className="p-4 border-t border-border">
          <div className={cn("rounded-xl p-4 flex items-center gap-3", connectionStatus === ConnectionStatus.CONNECTED ? 'bg-success/10 border border-success/20' : 'bg-muted')}>
            <div className={cn("w-3 h-3 rounded-full", connectionStatus === ConnectionStatus.CONNECTED ? 'bg-success animate-pulse' : 'bg-muted-foreground')}></div>
            <div>
              <p className="text-xs font-bold uppercase text-muted-foreground mb-0.5">Device Status</p>
              <p className={cn("text-sm font-medium", connectionStatus === ConnectionStatus.CONNECTED ? 'text-success' : 'text-muted-foreground')}>
                {connectionStatus === ConnectionStatus.CONNECTED ? 'Monitoring Active' : connectionStatus === ConnectionStatus.CONNECTING ? 'Connecting...' : 'Disconnected'}
              </p>
            </div>
          </div>
          <Button onClick={toggleConnection} variant={connectionStatus === ConnectionStatus.CONNECTED ? "outline" : "default"} className="mt-3 w-full">
            {connectionStatus === ConnectionStatus.CONNECTED ? 'Stop Monitoring' : connectionStatus === ConnectionStatus.CONNECTING ? 'Connecting...' : 'Connect Wristband'}
          </Button>
        </div>
      </aside>
      <main className="flex-grow p-6 md:p-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div><h1 className="text-2xl font-bold text-foreground">Health Dashboard</h1><p className="text-muted-foreground">Real-time monitoring & AI analysis</p></div>
          {connectionStatus === ConnectionStatus.CONNECTED && <div className="bg-success/10 text-success px-3 py-1 rounded text-xs font-bold flex items-center gap-1"><span className="w-2 h-2 bg-success rounded-full animate-pulse" />Live</div>}
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <VitalCard label="Heart Rate" value={latest ? latest.heartRate.toString() : '--'} unit="BPM" icon={<Heart className="text-health-pink w-6 h-6" />} colorClass="bg-health-pink/10 text-health-pink" />
          <VitalCard label="Systolic BP" value={latest ? latest.systolic.toString() : '--'} unit="mmHg" icon={<Activity className="text-primary w-6 h-6" />} colorClass="bg-primary/10 text-primary" />
          <VitalCard label="Diastolic BP" value={latest ? latest.diastolic.toString() : '--'} unit="mmHg" icon={<Activity className="text-indigo-500 w-6 h-6" />} colorClass="bg-indigo-100 text-indigo-600" />
          <VitalCard label="Risk Factor" value={insight ? (insight.status === 'normal' ? 'Low' : 'Check') : '--'} unit="Level" icon={insight?.status === 'warning' || insight?.status === 'critical' ? <AlertCircle className="text-amber-500 w-6 h-6" /> : <CheckCircle2 className="text-success w-6 h-6" />} colorClass={insight?.status === 'warning' || insight?.status === 'critical' ? "bg-amber-100 text-amber-600" : "bg-success/10 text-success"} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <RealTimeChart title="Heart Rate Trend" data={readings} dataKey="heartRate" color="hsl(var(--health-pink))" unit="bpm" />
            <RealTimeChart title="Blood Pressure" data={readings} dataKey={['systolic', 'diastolic']} color={['hsl(var(--primary))', '#6366f1']} unit="mmHg" />
          </div>
          <div className="lg:col-span-1">
            <InsightPanel 
              insight={insight} 
              mlPrediction={mlPrediction}
              isLoading={isAnalyzing} 
              onAnalyze={performAnalysis}
              onMLPredict={performMLPrediction}
              showMLPrediction={showMLPrediction}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
