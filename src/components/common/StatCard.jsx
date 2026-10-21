import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'forest',
  badge,
  badgeColor = 'bg-emerald-100 text-emerald-800',
}) => {
  const colorMap = {
    forest: 'bg-forest-50 text-forest-700 border-forest-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100',
  };

  const activeColor = colorMap[color] || colorMap.forest;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {title}
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${activeColor}`}>
            <Icon className="w-5 h-5 stroke-[2]" />
          </div>
        )}
      </div>
      {badge && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        </div>
      )}
    </div>
  );
};
