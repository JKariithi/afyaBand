import React from 'react';

interface VitalCardProps {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  colorClass: string;
}

const VitalCard: React.FC<VitalCardProps> = ({ label, value, unit, icon, colorClass }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-bold text-slate-800">{value}</h2>
          <span className="text-slate-400 text-sm font-medium">{unit}</span>
        </div>
      </div>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        {icon}
      </div>
    </div>
  );
};

export default VitalCard;