import React from 'react';
import { HealthInsight } from '@/types';
import { Brain, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface InsightPanelProps {
  insight: HealthInsight | null;
  isLoading: boolean;
  onAnalyze: () => void;
}

const InsightPanel: React.FC<InsightPanelProps> = ({ insight, isLoading, onAnalyze }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-destructive/10 border-destructive/20 text-destructive';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-700';
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

  return (
    <div className="bg-card rounded-2xl shadow-card border border-border p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-card-foreground">AI Health Analyst</h3>
            <p className="text-xs text-muted-foreground">Real-time Analysis</p>
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
          <p className="text-xs text-muted-foreground">Connect your wristband and wait for automatic analysis.</p>
        </div>
      ) : (
        <div className={cn("flex-grow rounded-xl border p-5", getStatusColor(insight.status))}>
          <div className="flex items-center gap-3 mb-4">
            {getStatusIcon(insight.status)}
            <span className="font-bold uppercase tracking-wider text-xs">{insight.status} Status</span>
            <span className="ml-auto text-xs opacity-70">
              {new Date(insight.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-semibold opacity-80 mb-1">Assessment</h4>
            <p className="text-base font-medium leading-snug">{insight.summary}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold opacity-80 mb-1">Recommendation</h4>
            <p className="leading-relaxed opacity-90 text-sm">{insight.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightPanel;
