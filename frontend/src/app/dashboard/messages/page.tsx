'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bell, RefreshCw, Megaphone, CalendarClock, CheckCircle2 } from 'lucide-react';

type StudentMessage = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  degreeId?: string | null;
  userId?: string | null;
  isRead?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function StudentMessagesPage(): JSX.Element {
  const [messages, setMessages] = useState<StudentMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [markingReadId, setMarkingReadId] = useState('');

  const loadMessages = async (isRefresh = false): Promise<void> => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/student/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.message || 'Failed to fetch messages');
      }

      const payload = await res.json();
      const list = payload?.data ?? payload ?? [];
      setMessages(Array.isArray(list) ? list : []);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const unreadCount = useMemo(() => messages.filter((message) => !message.isRead).length, [messages]);

  const markAsRead = async (messageId: string): Promise<void> => {
    setMarkingReadId(messageId);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/student/messages/${messageId}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.message || 'Failed to mark message as read');
      }

      setMessages((current) =>
        current.map((message) =>
          message.id === messageId ? { ...message, isRead: true } : message,
        ),
      );
    } catch (err: any) {
      setError(err?.message || 'Failed to mark message as read');
    } finally {
      setMarkingReadId('');
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <Bell size={20} className="text-orange-500" />
              Inbox Messages
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Messages from admin for your degree or all students.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
              {unreadCount} total
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
          Loading messages...
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      ) : null}

      {!loading && !error && messages.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Megaphone size={24} className="mx-auto text-slate-400" />
          <p className="mt-3 text-sm font-medium text-slate-700">No messages yet</p>
          <p className="mt-1 text-xs text-slate-500">When admin sends a message, it will appear here.</p>
        </div>
      ) : null}

      {!loading && !error && messages.length > 0 ? (
        <div className="space-y-3">
          {messages.map((message) => {
            const targetLabel = !message.userId && !message.degreeId ? 'All Users' : message.degreeId ? 'Your Degree' : 'Direct';
            return (
              <article
                key={message.id}
                className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${
                  message.isRead ? 'border-slate-200 bg-white' : 'border-orange-200 bg-orange-50/40'
                }`}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-slate-900">{message.title}</h2>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                      {targetLabel}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        message.isRead
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {message.isRead ? <CheckCircle2 size={12} /> : <Bell size={12} />}
                      {message.isRead ? 'Read' : 'Unread'}
                    </span>
                  </div>
                </div>

                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{message.content}</p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CalendarClock size={13} />
                    {new Date(message.createdAt).toLocaleString()}
                  </div>

                  {!message.isRead ? (
                    <button
                      onClick={() => markAsRead(message.id)}
                      disabled={markingReadId === message.id}
                      className="rounded-lg border border-orange-200 bg-white px-3 py-2 text-xs font-semibold text-orange-700 hover:bg-orange-50 disabled:opacity-60"
                    >
                      {markingReadId === message.id ? 'Marking...' : 'Mark as read'}
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
