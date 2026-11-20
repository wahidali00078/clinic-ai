import React from 'react';
import { DataSourceType, DATA_SOURCES } from '../../utils/formatters';
import { User, Sparkles, BookOpen } from 'lucide-react';

interface DataBadgeProps {
  type: DataSourceType;
  size?: 'sm' | 'xs';
  showTooltip?: boolean;
}

export const DataBadge: React.FC<DataBadgeProps> = ({ type, size = 'xs', showTooltip = true }) => {
  const info = DATA_SOURCES[type];

  const getStyle = () => {
    switch (type) {
      case 'input':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'estimate':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'benchmark':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getIcon = () => {
    const iconClass = size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3';
    switch (type) {
      case 'input':
        return <User className={iconClass} />;
      case 'estimate':
        return <Sparkles className={iconClass} />;
      case 'benchmark':
        return <BookOpen className={iconClass} />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border transition-colors ${getStyle()} ${
        size === 'xs' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5'
      }`}
      title={showTooltip ? info.description : undefined}
    >
      {getIcon()}
      <span>{info.label}</span>
    </span>
  );
};
