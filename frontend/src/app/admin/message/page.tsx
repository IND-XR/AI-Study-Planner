'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, AlertCircle, SendHorizontal } from 'lucide-react';

type Degree = {
  id: string;
  name: string;
  code: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AdminMessagePage(): JSX.Element {
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sendToAll, setSendToAll] = useState(true);
  const [degreeId, setDegreeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDegrees, setLoadingDegrees] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const canSubmit = useMemo(() => {
    if (!title.trim() || !content.trim()) {
      return false;
    }
    if (!sendToAll && !degreeId) {
      return false;
    }
    return true;
  }, [title, content, sendToAll, degreeId]);

  useEffect(() => {
    const fetchDegrees = async (): Promise<void> => {
      setLoadingDegrees(true);
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_URL}/api/degrees`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to load degrees');
        }

        const payload = await res.json();
        const items = payload?.data ?? payload ?? [];
        setDegrees(Array.isArray(items) ? items : []);
      } catch (err: any) {
        setError(err?.message || 'Could not load degrees');
      } finally {
        setLoadingDegrees(false);
      }
    };

    fetchDegrees();
  }, []);

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/admin/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          sendToAll,
          ...(sendToAll ? {} : { degreeId }),
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.message || 'Failed to send message');
      }

      setSuccess(sendToAll ? 'Message sent to all users successfully' : 'Message sent to selected degree successfully');
      setTitle('');
      setContent('');
      setDegreeId('');
    } catch (err: any) {
      setError(err?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] p-6">
      <Link href="/admin" className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-[#ece6df] bg-white shadow-lg">
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-7">
          <h1 className="text-2xl font-bold text-white">Send Message</h1>
          <p className="mt-1 text-sm text-orange-100">Send announcements to all users or a specific degree.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setSendToAll(true);
                setDegreeId('');
              }}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                sendToAll
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Send to All Users
            </button>

            <button
              type="button"
              onClick={() => setSendToAll(false)}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                !sendToAll
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Send to Specific Degree
            </button>
          </div>

          {!sendToAll ? (
            <div>
              <label htmlFor="target-degree" className="mb-2 block text-sm font-semibold text-slate-700">
                Target Degree
              </label>
              <select
                id="target-degree"
                title="Target Degree"
                value={degreeId}
                onChange={(event) => setDegreeId(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-orange-500 focus:outline-none"
                disabled={loadingDegrees}
                required
              >
                <option value="">{loadingDegrees ? 'Loading degrees...' : 'Select a degree'}</option>
                {degrees.map((degree) => (
                  <option key={degree.id} value={degree.id}>
                    {degree.name} ({degree.code})
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Message Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Exam schedule update"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-orange-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Message Content</label>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Please check your dashboard for updated timetable..."
              rows={6}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-orange-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-3 font-semibold text-white transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SendHorizontal size={16} />
            {loading ? 'Sending...' : 'Send Message'}
          </button>

          {success ? (
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              <CheckCircle2 size={18} />
              {success}
            </div>
          ) : null}

          {error ? (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={18} />
              {error}
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}
