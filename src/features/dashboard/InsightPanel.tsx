import React from 'react';
import { HealthInsight } from '@/shared/types';
import { Brain, AlertCircle, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { Progress } from '@/components/ui/progress';

interface InsightPanelProps {
  insight: HealthInsight | null;
  isLoading: boolean;
  onAnalyze: () => void;
}

const InsightPanel: React.FC<InsightPanelProps> = ({ insight, isLoading, onAnalyze }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-destructive/10 border-destructive/20 text-destructive';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300';
      case 'normal': return 'bg-success/10 border-success/20 text-success';
      default: return 'bg-muted border-border text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertCircle className="w-5 h-5 text-destructive" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'normal': return <CheckCircle2 className="w-5 h-5 text-success" />;
      default: return <Brain className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'bg-destructive';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-success';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Moderate Risk';
    return 'Low Risk';
  };

  return (
    <div className="bg-card rounded-2xl shadow-card border border-border p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-card-foreground flex items-center gap-1.5">
              AI Health Analyst
              {insight?.aiGenerated && (
                <Sparkles className="w-4 h-4 text-primary" />
              )}
            </h3>
            <p className="text-xs text-muted-foreground">
              {insight?.aiGenerated ? 'AI-Powered Analysis' : 'Real-time Analysis'}
            </p>
          </div>
        </div>
        <Button
          onClick={onAnalyze}
          disabled={isLoading}
          size="sm"
          className={cn(
            "transition-all",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? 'Analyzing...' : 'Refresh'}
        </Button>
      </div>

      {!insight ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-xl">
          <Brain className="w-10 h-10 text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground mb-2">No analysis yet.</p>
          <p className="text-xs text-muted-foreground">Connect your wristband and wait for automatic AI analysis.</p>
        </div>
      ) : (
        <div className="flex-grow flex flex-col gap-4">
          {/* Risk Score */}
          {insight.riskScore !== undefined && (
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-card-foreground">Hypertension Risk</span>
                </div>
                <span className={cn(
                  "text-xs font-bold px-2 py-1 rounded-full",
                  insight.riskScore >= 70 ? "bg-destructive/10 text-destructive" :
                  insight.riskScore >= 40 ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" :
                  "bg-success/10 text-success"
                )}>
                  {getRiskLabel(insight.riskScore)}
                </span>
              </div>
              <div className="relative">
                <Progress 
                  value={insight.riskScore} 
                  className="h-3"
                />
                <div 
                  className={cn("absolute top-0 left-0 h-3 rounded-full transition-all", getRiskColor(insight.riskScore))}
                  style={{ width: `${insight.riskScore}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-right">{insight.riskScore}%</p>
            </div>
          )}

          {/* Status Card */}
          <div className={cn("rounded-xl border p-4", getStatusColor(insight.status))}>
            <div className="flex items-center gap-3 mb-3">
              {getStatusIcon(insight.status)}
              <span className="font-bold uppercase tracking-wider text-xs">{insight.status} Status</span>
              <span className="ml-auto text-xs opacity-70">
                {new Date(insight.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <div className="mb-3">
              <h4 className="text-sm font-semibold opacity-80 mb-1">Assessment</h4>
              <p className="text-sm font-medium leading-snug">{insight.summary}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold opacity-80 mb-1">Recommendation</h4>
              <p className="leading-relaxed opacity-90 text-sm">{insight.recommendation}</p>
            </div>
          </div>

          {/* Risk Factors */}
          {insight.factors && insight.factors.length > 0 && (
            <div className="bg-muted/30 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-card-foreground mb-2">Contributing Factors</h4>
              <div className="flex flex-wrap gap-2">
                {insight.factors.map((factor, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs bg-background border border-border px-2 py-1 rounded-full text-muted-foreground"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Insights */}
          {insight.insights && (
            <div className="text-xs text-muted-foreground italic border-t border-border pt-3 mt-auto">
              {insight.insights}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InsightPanel;
