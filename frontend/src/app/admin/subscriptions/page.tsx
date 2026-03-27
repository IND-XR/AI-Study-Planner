'use client';

import { Crown } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SectionCard, MetricCard } from '@/features/dashboard/components/Cards';
import { useAdminStore } from '@/store/admin';

export default function SubscriptionsPage(): JSX.Element {
  const { subscriptions, growthData } = useAdminStore((state) => ({
    subscriptions: state.subscriptions,
    growthData: state.growthData,
  }));

  const planData = [
    { label: 'Free Users', value: subscriptions.freeUsers },
    { label: 'Pro Users', value: subscriptions.proUsers },
    { label: 'Monthly Revenue', value: subscriptions.monthlyRevenue },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {planData.map((item) => (
          <MetricCard
            key={item.label}
            label={item.label}
            value={item.label === 'Monthly Revenue' ? `₹${item.value.toLocaleString()}` : String(item.value)}
            meta="SaaS subscription overview"
            icon={<Crown size={16} />}
          />
        ))}
      </div>

      <SectionCard title="Revenue Tracking" subtitle="SaaS monthly monetization trend">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF8800" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#FF8800" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Area dataKey="plans" stroke="#FF8800" fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  );
}
