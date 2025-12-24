import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, Calendar, Heart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface HealthReading {
  id: string;
  heart_rate: number;
  systolic: number;
  diastolic: number;
  recorded_at: string;
}

interface HealthInsight {
  id: string;
  status: string;
  summary: string;
  recommendation: string;
  recorded_at: string;
}

const History: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [readings, setReadings] = useState<HealthReading[]>([]);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      if (!user) return;
      
      const [readingsResult, insightsResult] = await Promise.all([
        supabase
          .from('health_readings')
          .select('*')
          .eq('user_id', user.id)
          .order('recorded_at', { ascending: false })
          .limit(100),
        supabase
          .from('health_insights')
          .select('*')
          .eq('user_id', user.id)
          .order('recorded_at', { ascending: false })
          .limit(20)
      ]);
      
      if (readingsResult.data) setReadings(readingsResult.data);
      if (insightsResult.data) setInsights(insightsResult.data);
      setLoading(false);
    };
    
    loadHistory();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-success/10 text-success border-success/20';
      case 'warning': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'critical': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Group readings by date
  const groupedReadings = readings.reduce((acc, reading) => {
    const date = format(new Date(reading.recorded_at), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(reading);
    return acc;
  }, {} as Record<string, HealthReading[]>);

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Activity className="text-primary-foreground w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-card-foreground">Health History</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading history...</div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-primary">{readings.length}</p>
                  <p className="text-sm text-muted-foreground">Total Readings</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-health-pink">
                    {readings.length > 0 
                      ? Math.round(readings.reduce((sum, r) => sum + r.heart_rate, 0) / readings.length)
                      : '--'}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Heart Rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-primary">
                    {readings.length > 0 
                      ? Math.round(readings.reduce((sum, r) => sum + r.systolic, 0) / readings.length)
                      : '--'}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Systolic</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-indigo-500">
                    {readings.length > 0 
                      ? Math.round(readings.reduce((sum, r) => sum + r.diastolic, 0) / readings.length)
                      : '--'}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Diastolic</p>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  AI Analysis History
                </CardTitle>
                <CardDescription>Recent health assessments from AI analysis</CardDescription>
              </CardHeader>
              <CardContent>
                {insights.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No AI insights yet. Connect your wristband to generate health analysis.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {insights.slice(0, 5).map((insight) => (
                      <div
                        key={insight.id}
                        className={`p-4 rounded-lg border ${getStatusColor(insight.status)}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium capitalize">{insight.status}</span>
                          <span className="text-xs opacity-70">
                            {format(new Date(insight.recorded_at), 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm mb-1">{insight.summary}</p>
                        <p className="text-xs opacity-80">{insight.recommendation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Readings by Day */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Readings by Day
                </CardTitle>
                <CardDescription>Your health data organized by date</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(groupedReadings).length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No readings recorded yet. Start monitoring to see your history.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(groupedReadings).slice(0, 7).map(([date, dayReadings]) => (
                      <div key={date} className="border-b border-border pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">
                            {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({dayReadings.length} readings)
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-health-pink" />
                            <span>
                              HR: {Math.round(dayReadings.reduce((s, r) => s + r.heart_rate, 0) / dayReadings.length)} avg
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-primary" />
                            <span>
                              Sys: {Math.round(dayReadings.reduce((s, r) => s + r.systolic, 0) / dayReadings.length)} avg
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-indigo-500" />
                            <span>
                              Dia: {Math.round(dayReadings.reduce((s, r) => s + r.diastolic, 0) / dayReadings.length)} avg
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default History;
