import React from 'react';
import { HealthInsight } from '../types';
import { BrainIcon, AlertIcon, CheckCircleIcon } from './Icons';

interface InsightPanelProps {
  insight: HealthInsight | null;
  isLoading: boolean;
  onAnalyze: () => void;
}

const InsightPanel: React.FC<InsightPanelProps> = ({ insight, isLoading, onAnalyze }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-700';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'normal': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      default: return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertIcon className="text-red-500" />;
      case 'warning': return <AlertIcon className="text-amber-500" />;
      case 'normal': return <CheckCircleIcon className="text-emerald-500" />;
      default: return <BrainIcon className="text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <BrainIcon />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">AI Medical Analyst</h3>
            <p className="text-xs text-slate-400">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
        <button 
          onClick={onAnalyze}
          disabled={isLoading}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            isLoading 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200'
          }`}
        >
          {isLoading ? 'Analyzing...' : 'Refresh Insight'}
        </button>
      </div>

      {!insight ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-100 rounded-xl">
          <p className="text-slate-400 mb-2">No analysis yet.</p>
          <p className="text-xs text-slate-400">Wait for the automatic cycle or click refresh.</p>
        </div>
      ) : (
        <div className={`flex-grow rounded-xl border p-5 ${getStatusColor(insight.status)}`}>
          <div className="flex items-center gap-3 mb-4">
            {getStatusIcon(insight.status)}
            <span className="font-bold uppercase tracking-wider text-xs">{insight.status} Status</span>
            <span className="ml-auto text-xs opacity-70">
              {new Date(insight.timestamp).toLocaleTimeString()}
            </span>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-semibold opacity-80 mb-1">Assessment</h4>
            <p className="text-lg font-medium leading-snug">{insight.summary}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold opacity-80 mb-1">Recommendation</h4>
            <p className="leading-relaxed opacity-90">{insight.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightPanel;