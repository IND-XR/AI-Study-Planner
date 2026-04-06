'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarClock, Inbox, RefreshCw } from 'lucide-react';

type Degree = {
  id: string;
  name: string;
  code: string;
};

type AdminMessage = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  degreeId?: string | null;
  userId?: string | null;
  degree?: Degree | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AdminMessageHistoryPage(): JSX.Element {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadMessages = async (isRefresh = false): Promise<void> => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/admin/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.message || 'Failed to fetch message history');
      }

      const payload = await res.json();
      const list = payload?.data ?? payload ?? [];
      setMessages(Array.isArray(list) ? list : []);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch message history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const totalCount = useMemo(() => messages.length, [messages]);

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <Inbox size={20} className="text-orange-500" />
              Message History
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review all messages sent from the admin console.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
              {totalCount} sent
            </span>
            <button
              onClick={() => loadMessages(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading message history...
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      ) : null}

      {!loading && !error && messages.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Inbox size={24} className="mx-auto text-slate-400" />
          <p className="mt-3 text-sm font-medium text-slate-700">No messages sent yet</p>
          <p className="mt-1 text-xs text-slate-500">Messages you send from the admin page will appear here.</p>
        </div>
      ) : null}

      {!loading && !error && messages.length > 0 ? (
        <div className="space-y-3">
          {messages.map((message) => {
            const targetLabel = !message.userId && !message.degreeId ? 'All Users' : message.degree ? `${message.degree.name} (${message.degree.code})` : 'Specific Degree';

            return (
              <article key={message.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-slate-900">{message.title}</h2>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                    {targetLabel}
                  </span>
                </div>

                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{message.content}</p>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <CalendarClock size={13} />
                  {new Date(message.createdAt).toLocaleString()}
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      <div>
        <Link href="/admin/message" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700">
          <ArrowLeft size={16} />
          Back to send message
        </Link>
      </div>
    </div>
  );
}
