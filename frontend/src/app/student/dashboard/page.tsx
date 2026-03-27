'use client';

import { User, Book, ListChecks, BarChart3, Bell, Settings, Crown, Calendar, Zap, Rocket, Search } from 'lucide-react';
import { useState } from 'react';

export default function StudentDashboardPage() {
  const [tab, setTab] = useState<'weekly' | 'monthly'>('weekly');
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#f8f9fb', minHeight: '100vh', padding: 0 }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px 0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <User size={44} color="#ff9100" style={{ background: '#fff', borderRadius: '50%' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Anmol Gupta</div>
            <div style={{ fontSize: 13, color: '#888' }}>1251150556<br />anmol.gu@email.com</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: '8px 16px', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px #0001' }}>
            <Search size={18} color="#ff9100" style={{ marginRight: 8 }} />
            <input placeholder="Search..." style={{ border: 'none', outline: 'none', fontSize: 15, background: 'transparent' }} />
          </div>
          <Bell size={22} color="#ff9100" style={{ marginRight: 8, cursor: 'pointer' }} />
          <div style={{ background: '#fff', borderRadius: 20, padding: '6px 16px', fontWeight: 600, color: '#ff9100', cursor: 'pointer', boxShadow: '0 1px 4px #0001' }}>Anmol <User size={18} style={{ marginLeft: 6, verticalAlign: 'middle' }} /></div>
        </div>
      </div>
      {/* Main Content */}
      <div style={{ display: 'flex', gap: 32, marginTop: 32, padding: '0 32px' }}>
        {/* Left Column */}
        <div style={{ flex: 2, minWidth: 0 }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: 32, boxShadow: '0 2px 12px #ff91001a', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, color: '#222' }}>Generate Your Study Plan</h1>
              <p style={{ color: '#888', marginBottom: 18 }}>Create a personalized study timetable powered by AI</p>
              <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
                <input type="number" placeholder="Enter daily hours" style={{ border: '1px solid #eee', borderRadius: 8, padding: '8px 12px', fontSize: 15, width: 140 }} />
                <button style={{ background: '#ff9100', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 16, boxShadow: '0 2px 8px #ff910033', cursor: 'pointer' }}>
                  <Rocket style={{ marginRight: 8, verticalAlign: 'middle' }} /> Generate AI Timetable
                </button>
              </div>
              <div style={{ fontSize: 14, color: '#888' }}>
                <input type="checkbox" checked readOnly style={{ accentColor: '#ff9100', marginRight: 8 }} />
                AI Tailored Study Plan <span style={{ color: '#bbb', marginLeft: 8 }}>Optimized for your daily hours and exams.</span>
              </div>
            </div>
            <img src="/study-illustration.png" alt="Study Illustration" style={{ width: 220, borderRadius: 16, background: '#fff7ed', boxShadow: '0 2px 12px #ff91001a' }} />
          </div>
          {/* Calendar Tabs */}
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #ff91001a', padding: 0, marginBottom: 32 }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #f3f3f3' }}>
              <button onClick={() => setTab('weekly')} style={{ flex: 1, padding: 18, fontWeight: 700, fontSize: 16, background: tab === 'weekly' ? '#fff7ed' : '#fff', color: tab === 'weekly' ? '#ff9100' : '#888', border: 'none', borderRadius: '18px 18px 0 0', cursor: 'pointer' }}>Weekly</button>
              <button onClick={() => setTab('monthly')} style={{ flex: 1, padding: 18, fontWeight: 700, fontSize: 16, background: tab === 'monthly' ? '#fff7ed' : '#fff', color: tab === 'monthly' ? '#ff9100' : '#888', border: 'none', borderRadius: '18px 18px 0 0', cursor: 'pointer' }}>Monthly</button>
            </div>
            <div style={{ padding: 32 }}>
              {/* Calendar Placeholder */}
              <div style={{ minHeight: 220, color: '#bbb', fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fb', borderRadius: 12 }}>
                {tab === 'weekly' ? 'Weekly Calendar (Coming Soon)' : 'Monthly Calendar (Coming Soon)'}
              </div>
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div style={{ flex: 1, minWidth: 320, display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Today's Tasks */}
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #ff91001a', padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16, color: '#222' }}>Today's Tasks</div>
            <ul style={{ padding: 0, margin: 0, listStyle: 'none', fontSize: 15 }}>
              <li style={{ marginBottom: 10 }}><input type="checkbox" checked readOnly style={{ accentColor: '#ff9100', marginRight: 8 }} /> Read Algebra Chapter 3</li>
              <li><input type="checkbox" checked readOnly style={{ accentColor: '#ff9100', marginRight: 8 }} /> Review Newton's Laws</li>
            </ul>
          </div>
          {/* Productivity */}
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #ff91001a', padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16, color: '#222' }}>Productivity</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#ff9100', fontSize: 22, border: '4px solid #ff9100' }}>1.5</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#888' }}>Hours Studied</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                  {[1, 0.5, 0.8, 1.2, 1.5, 0.7, 1.1].map((v, i) => (
                    <div key={i} style={{ width: 16, height: 32 * v, background: '#ff9100', borderRadius: 4, opacity: 0.7 }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Upcoming Exam */}
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #ff91001a', padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12, color: '#222' }}>Midterm Exam</div>
            <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>May 15, 2024 <span style={{ color: '#ff9100', fontWeight: 700 }}>(in 15 days)</span></div>
            <div style={{ fontWeight: 600, color: '#ff9100', fontSize: 16 }}>Algebra, Physics</div>
          </div>
        </div>
      </div>
    </div>
  );
}
