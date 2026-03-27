'use client';

import { Crown, Sparkles } from 'lucide-react';
import { SectionCard } from '@/features/dashboard/components/Cards';
import { useDashboardStore } from '@/store/dashboard';

export default function SubscriptionPage(): JSX.Element {
  const subscription = useDashboardStore((state) => state.subscription);

  return (
    <SectionCard title="Subscription & Monetization" subtitle="Free vs Pro plans with Stripe-ready upgrade call-to-action">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-neutral-800 dark:bg-neutral-800/60">
          <h3 className="text-lg font-semibold">Free Plan</h3>
          <ul className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-300">
            <li>Basic dashboard and task engine</li>
            <li>Limited analytics</li>
            <li>Manual planner actions</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-primary-400 bg-gradient-to-br from-primary-500 to-primary-600 p-5 text-white shadow-lg">
          <div className="flex items-center gap-2">
            <Crown size={18} />
            <h3 className="text-lg font-semibold">Pro Plan</h3>
          </div>
          <ul className="mt-3 space-y-1 text-sm text-white/90">
            <li>AI planner + smart adaptive recovery</li>
            <li>Advanced analytics and predictions</li>
            <li>Priority alerts and premium support</li>
          </ul>
          <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary-700">
            <Sparkles size={16} />
            Upgrade to Pro (Stripe)
          </button>
          <p className="mt-2 text-xs text-white/80">Current plan: {subscription.plan}</p>
        </article>
      </div>
    </SectionCard>
  );
}
