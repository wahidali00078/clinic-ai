import React from 'react';

interface SkeletonLoaderProps {
  type?: 'card' | 'table' | 'metric' | 'chart';
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'card',
  count = 1,
  className = '',
}) => {
  const renderItem = (index: number) => {
    switch (type) {
      case 'metric':
        return (
          <div
            key={index}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs animate-pulse space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 bg-slate-200 rounded-md" />
              <div className="h-4 w-4 bg-slate-200 rounded-full" />
            </div>
            <div className="h-7 w-36 bg-slate-200 rounded-md" />
            <div className="h-3 w-48 bg-slate-100 rounded-md" />
          </div>
        );

      case 'table':
        return (
          <div
            key={index}
            className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs animate-pulse p-4 space-y-3"
          >
            <div className="h-4 w-48 bg-slate-200 rounded-md mb-4" />
            {[...Array(4)].map((_, rIdx) => (
              <div key={rIdx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 w-1/3 bg-slate-200 rounded-md" />
                  <div className="h-2.5 w-1/2 bg-slate-100 rounded-md" />
                </div>
                <div className="h-4 w-20 bg-slate-200 rounded-md ml-4" />
              </div>
            ))}
          </div>
        );

      case 'chart':
        return (
          <div
            key={index}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs animate-pulse space-y-4"
          >
            <div className="h-4 w-40 bg-slate-200 rounded-md" />
            <div className="h-48 w-full bg-slate-100 rounded-xl flex items-end justify-around p-4 gap-2">
              {[...Array(6)].map((_, barIdx) => (
                <div
                  key={barIdx}
                  className="bg-slate-200 rounded-t-md w-8"
                  style={{ height: `${20 + (barIdx * 15)}%` }}
                />
              ))}
            </div>
          </div>
        );

      case 'card':
      default:
        return (
          <div
            key={index}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs animate-pulse space-y-3"
          >
            <div className="h-4 w-32 bg-slate-200 rounded-md" />
            <div className="h-3 w-3/4 bg-slate-100 rounded-md" />
            <div className="h-3 w-1/2 bg-slate-100 rounded-md" />
            <div className="pt-2 flex justify-between">
              <div className="h-6 w-20 bg-slate-200 rounded-md" />
              <div className="h-6 w-16 bg-slate-200 rounded-md" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, idx) => renderItem(idx))}
    </div>
  );
};
