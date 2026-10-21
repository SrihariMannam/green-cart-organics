import React from 'react';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { MessageSquare, ShieldCheck, Truck, Building2 } from 'lucide-react';

export const FarmerMessages = () => {
  const mockMessages = [
    {
      id: 1,
      sender: 'Bengaluru Central Aggregation Hub',
      role: 'Quality Inspector Deepak Verma',
      time: 'Today 10:15 AM',
      text: 'Batch #GCO-8821 passed Brix sugar sweetness and firmness testing with Grade A+ rating. Great harvest!',
      icon: Building2,
      color: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 2,
      sender: 'Driver Mahesh Rao',
      role: 'Collection Truck (Tata Ace EV)',
      time: 'Today 09:30 AM',
      text: 'Arriving at Mandya Farm gate around 11:30 AM. Please keep crates weighed and labeled.',
      icon: Truck,
      color: 'bg-amber-100 text-amber-700',
    },
    {
      id: 3,
      sender: 'Platform Operations',
      role: 'Dr. Radhika Menon',
      time: 'Yesterday',
      text: 'Seasonal demand for Kesar Pomegranates and Ooty Carrots is up by 40% in Indiranagar. Farmer quota increased.',
      icon: ShieldCheck,
      color: 'bg-forest-100 text-forest-700',
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Messages & Operational Dispatch"
        subtitle="Live communication from City Hub inspectors and collection drivers"
        breadcrumb={['Farmer Portal', 'Messages']}
      />

      <div className="px-6 space-y-4 max-w-4xl">
        {mockMessages.map((msg) => {
          const Icon = msg.icon;
          return (
            <div
              key={msg.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start space-x-4"
            >
              <div className={`p-3 rounded-xl ${msg.color} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{msg.sender}</h4>
                  <span className="text-slate-400 text-[11px]">{msg.time}</span>
                </div>
                <div className="text-[11px] font-semibold text-forest-700">{msg.role}</div>
                <p className="text-slate-600 mt-1 leading-relaxed">{msg.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
