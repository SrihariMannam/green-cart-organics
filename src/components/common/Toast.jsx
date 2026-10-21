import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-white/95 text-emerald-950 shadow-emerald-500/10',
    error: 'border-rose-200 bg-white/95 text-rose-950 shadow-rose-500/10',
    warning: 'border-amber-200 bg-white/95 text-amber-950 shadow-amber-500/10',
    info: 'border-sky-200 bg-white/95 text-sky-950 shadow-sky-500/10',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up max-w-md">
      <div
        className={`flex items-start space-x-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all ${
          borders[toast.type] || borders.info
        }`}
      >
        {icons[toast.type] || icons.info}
        <div className="text-sm font-medium leading-relaxed">{toast.message}</div>
      </div>
    </div>
  );
};
