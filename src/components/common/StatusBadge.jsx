import React from 'react';
import { FULFILLMENT_STAGES, PAYMENT_STATUS } from '../../data/orderLifecycle';

export const StatusBadge = ({ status, type = 'fulfillment', size = 'md' }) => {
  if (type === 'payment') {
    const paymentConfig = PAYMENT_STATUS[status] || {
      label: status || 'Unknown',
      color: 'bg-slate-100 text-slate-700',
    };
    return (
      <span
        className={`inline-flex items-center font-medium rounded-full border border-current/20 ${
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
        } ${paymentConfig.color}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
        {paymentConfig.label}
      </span>
    );
  }

  const stage = FULFILLMENT_STAGES[status] || {
    label: status || 'Unknown',
    color: 'bg-slate-100 text-slate-700 border-slate-300',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      } ${stage.color}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {stage.label}
    </span>
  );
};
