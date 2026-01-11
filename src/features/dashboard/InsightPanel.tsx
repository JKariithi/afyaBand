import React from 'react';
import { HealthInsight } from '@/shared/types';
import { Brain, AlertCircle, CheckCircle2, Sparkles, TrendingUp, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { Progress } from '@/components/ui/progress';
import { MLPredictionResult } from '@/shared/services/mlPredictionService';

interface InsightPanelProps {
  insight: HealthInsight | null;
  mlPrediction?: MLPredictionResult | null;
  isLoading: boolean;
  onAnalyze: () => void;
  onMLPredict?: () => void;
  showMLPrediction?: boolean;
}

const InsightPanel: React.FC<InsightPanelProps> = ({ 
  insight, 
  mlPrediction,
  isLoading, 
  onAnalyze,
  onMLPredict,
  showMLPrediction = false
}) => {
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

  // Use ML prediction as the active data if available and showMLPrediction is true
  const activeInsight = showMLPrediction && mlPrediction ? mlPrediction : insight;
  const isMLMode = showMLPrediction && mlPrediction?.mlGenerated;

  return (
    <div className="bg-card rounded-2xl shadow-card border border-border p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-lg",
            isMLMode ? "bg-accent/20 text-accent-foreground" : "bg-primary/10 text-primary"
          )}>
            {isMLMode ? <Cpu className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-bold text-card-foreground flex items-center gap-1.5">
              {isMLMode ? 'ML Risk Predictor' : 'AI Health Analyst'}
              {!isMLMode && insight?.aiGenerated && (
                <Sparkles className="w-4 h-4 text-primary" />
              )}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isMLMode 
                ? 'XGBoost Model'
                : insight?.aiGenerated ? 'AI-Powered Analysis' : 'Real-time Analysis'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {onMLPredict && (
            <Button
              onClick={onMLPredict}
              disabled={isLoading}
              size="sm"
              variant={showMLPrediction ? "default" : "outline"}
              className={cn(
                "transition-all text-xs",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              <Cpu className="w-3 h-3 mr-1" />
              ML
            </Button>
          )}
          <Button
            onClick={onAnalyze}
            disabled={isLoading}
            size="sm"
            variant={!showMLPrediction ? "default" : "outline"}
            className={cn(
              "transition-all",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? 'Analyzing...' : 'AI'}
          </Button>
        </div>
      </div>

      {!activeInsight ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-xl">
          <Brain className="w-10 h-10 text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground mb-2">No analysis yet.</p>
          <p className="text-xs text-muted-foreground">Connect your wristband and wait for automatic AI analysis.</p>
        </div>
      ) : (
        <div className="flex-grow flex flex-col gap-4">
          {/* Risk Score */}
          {activeInsight.riskScore !== undefined && (
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-card-foreground">Hypertension Risk</span>
                </div>
                <span className={cn(
                  "text-xs font-bold px-2 py-1 rounded-full",
                  activeInsight.riskScore >= 70 ? "bg-destructive/10 text-destructive" :
                  activeInsight.riskScore >= 40 ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" :
                  "bg-success/10 text-success"
                )}>
                  {getRiskLabel(activeInsight.riskScore)}
                </span>
              </div>
              <div className="relative">
                <Progress 
                  value={activeInsight.riskScore} 
                  className="h-3"
                />
                <div 
                  className={cn("absolute top-0 left-0 h-3 rounded-full transition-all", getRiskColor(activeInsight.riskScore))}
                  style={{ width: `${activeInsight.riskScore}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-right">{activeInsight.riskScore}%</p>
            </div>
          )}

          {/* Status Card */}
          <div className={cn("rounded-xl border p-4", getStatusColor(activeInsight.status))}>
            <div className="flex items-center gap-3 mb-3">
              {getStatusIcon(activeInsight.status)}
              <span className="font-bold uppercase tracking-wider text-xs">{activeInsight.status} Status</span>
              <span className="ml-auto text-xs opacity-70">
                {new Date(activeInsight.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <div className="mb-3">
              <h4 className="text-sm font-semibold opacity-80 mb-1">Assessment</h4>
              <p className="text-sm font-medium leading-snug">{activeInsight.summary}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold opacity-80 mb-1">Recommendation</h4>
              <p className="leading-relaxed opacity-90 text-sm">{activeInsight.recommendation}</p>
            </div>
          </div>

          {/* Risk Factors */}
          {activeInsight.factors && activeInsight.factors.length > 0 && (
            <div className="bg-muted/30 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-card-foreground mb-2">Contributing Factors</h4>
              <div className="flex flex-wrap gap-2">
                {activeInsight.factors.map((factor, idx) => (
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

          {/* ML Feature Summary */}
          {isMLMode && mlPrediction?.features && (
            <div className="bg-muted/20 rounded-xl p-3 border border-border">
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">Input Features</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <span className="block text-muted-foreground">Age</span>
                  <span className="font-medium">{mlPrediction.features.age}</span>
                </div>
                <div className="text-center">
                  <span className="block text-muted-foreground">BMI</span>
                  <span className="font-medium">{mlPrediction.features.bmi.toFixed(1)}</span>
                </div>
                <div className="text-center">
                  <span className="block text-muted-foreground">Gender</span>
                  <span className="font-medium capitalize">{mlPrediction.features.gender}</span>
                </div>
              </div>
            </div>
          )}

          {/* Additional Insights */}
          {activeInsight.insights && (
            <div className="text-xs text-muted-foreground italic border-t border-border pt-3 mt-auto">
              {activeInsight.insights}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InsightPanel;