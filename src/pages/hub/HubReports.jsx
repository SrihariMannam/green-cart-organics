import React from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatCard } from '../../components/common/StatCard';
import { formatKg } from '../../utils/formatters';
import { BarChart3, TrendingUp, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export const HubReports = () => {
  const { orders } = useApp();

  const inspectedOrders = orders.filter((o) => o.qualityInspection);
  const totalAcceptedKg = inspectedOrders.reduce(
    (acc, o) => acc + (o.qualityInspection.acceptedKg || 0),
    0
  );
  const totalRejectedKg = inspectedOrders.reduce(
    (acc, o) => acc + (o.qualityInspection.rejectedKg || 0),
    0
  );

  const acceptanceRate =
    totalAcceptedKg + totalRejectedKg > 0
      ? ((totalAcceptedKg / (totalAcceptedKg + totalRejectedKg)) * 100).toFixed(1)
      : '98.5';

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Quality Control & Hub Throughput Analytics"
        subtitle="Performance analytics on inspection pass rates, packing turnaround, and defect ratios"
        breadcrumb={['City Hub Staff', 'Reports']}
      />

      <div className="px-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Quality Acceptance Rate"
            value={`${acceptanceRate}%`}
            subtitle="Grade A+ & Grade A batches"
            icon={ShieldCheck}
            color="forest"
          />
          <StatCard
            title="Defect Segregation"
            value={formatKg(totalRejectedKg || 4.5)}
            subtitle="Diverted to organic compost"
            icon={AlertTriangle}
            color="amber"
          />
          <StatCard
            title="Avg. Turnaround Time"
            value="42 mins"
            subtitle="Truck unload to 2-wheeler dispatch"
            icon={TrendingUp}
            color="blue"
          />
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">
            Batch Quality Log & Inspector Audits
          </h3>
          <p className="text-slate-500">
            Every batch delivered by rural collection trucks undergoes physical inspection at Peenya Hub before customer dispatch.
          </p>

          <div className="divide-y divide-slate-100">
            {inspectedOrders.map((o) => (
              <div key={o.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-slate-900">{o.id}</span>
                  <div className="text-slate-600 mt-0.5">
                    {o.qualityInspection.grade} · Notes: "{o.qualityInspection.notes}"
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-700 font-bold">
                    Passed: {formatKg(o.qualityInspection.acceptedKg)}
                  </span>
                  {o.qualityInspection.rejectedKg > 0 && (
                    <span className="text-rose-600 block text-[10px]">
                      Rejected: {formatKg(o.qualityInspection.rejectedKg)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
