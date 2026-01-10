import React from 'react';
import { cn } from '@/shared/lib/utils';

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
    <div className="bg-card p-6 rounded-2xl shadow-card border border-border flex items-start justify-between transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      <div>
        <p className="text-muted-foreground text-sm font-medium mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-bold text-card-foreground">{value}</h2>
          <span className="text-muted-foreground text-sm font-medium">{unit}</span>
        </div>
      </div>
      <div className={cn("p-3 rounded-xl", colorClass)}>
        {icon}
      </div>
    </div>
  );
};

export default VitalCard;
