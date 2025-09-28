import React from 'react';

interface TimerDisplayProps {
  value: string;
  label: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ value, label }) => {
  return (
    <div className="flex grow basis-0 flex-col items-stretch gap-4">
      <div className="flex h-14 grow items-center justify-center rounded-lg px-3 bg-brand-green-medium">
        <p className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">{value}</p>
      </div>
      <div className="flex items-center justify-center">
        <p className="text-white text-sm font-normal leading-normal">{label}</p>
      </div>
    </div>
  );
};

export default TimerDisplay;