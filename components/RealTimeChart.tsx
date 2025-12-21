import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VitalReading } from '../types';

interface RealTimeChartProps {
  data: VitalReading[];
  dataKey: keyof VitalReading | (keyof VitalReading)[];
  color: string | string[];
  title: string;
  unit: string;
}

const RealTimeChart: React.FC<RealTimeChartProps> = ({ data, dataKey, color, title, unit }) => {
  const isMultiLine = Array.isArray(dataKey);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-700">{title}</h3>
        <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">Live Stream</span>
      </div>
      <div className="flex-grow w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="timestamp" 
              tick={false} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              unit={` ${unit}`}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelFormatter={(label) => new Date(label).toLocaleTimeString()}
            />
            {isMultiLine ? (
              (dataKey as (keyof VitalReading)[]).map((k, i) => (
                <Line 
                  key={k as string}
                  type="monotone" 
                  dataKey={k as string} 
                  stroke={(color as string[])[i]} 
                  strokeWidth={2} 
                  dot={false}
                  isAnimationActive={false}
                />
              ))
            ) : (
              <Line 
                type="monotone" 
                dataKey={dataKey as keyof VitalReading} 
                stroke={color as string} 
                strokeWidth={2} 
                dot={false}
                isAnimationActive={false} // Disable animation for smoother realtime updates
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RealTimeChart;