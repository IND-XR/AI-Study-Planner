import React from 'react';

export default function StudentDashboard() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--student-bg)', color: 'var(--student-text)', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: 'var(--student-sidebar)', height: '100vh', float: 'left', padding: 32, boxSizing: 'border-box', borderRight: '1px solid #ececec' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
          <img src="/avatar.png" alt="Avatar" style={{ width: 56, height: 56, borderRadius: '50%', marginRight: 16 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Anmol Gupta</div>
            <div style={{ fontSize: 13, color: 'var(--student-muted)' }}>125115056</div>
            <div style={{ fontSize: 13, color: 'var(--student-muted)' }}>anmol.gu@email.com</div>
          </div>
        </div>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: 18 }}><a href="#" style={{ color: 'var(--student-link)', fontWeight: 500 }}>Dashboard</a></li>
            <li style={{ marginBottom: 18 }}><a href="#">Subjects</a></li>
            <li style={{ marginBottom: 18 }}><a href="#">Exams</a></li>
            <li style={{ marginBottom: 18 }}><a href="#">Topics</a></li>
            <li style={{ marginBottom: 18 }}><a href="#">Study Plan</a></li>
            <li style={{ marginBottom: 18 }}><a href="#">Progress</a></li>
            <li style={{ marginBottom: 18 }}><a href="#">Settings</a></li>
          </ul>
        </nav>
        <div style={{ marginTop: 32 }}>
          <button style={{ background: 'var(--student-orange)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 600, width: '100%' }}>Upgrade to Pro</button>
        </div>
      </aside>
      {/* Main Content */}
      <main style={{ marginLeft: 260, padding: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Generate Your Study Plan</h1>
        <div style={{ display: 'flex', gap: 32 }}>
          {/* Study Plan Generator */}
          <section style={{ flex: 1, background: 'var(--student-card)', borderRadius: 16, padding: 32, boxShadow: '0 2px 8px #0001' }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Daily Study Hours</div>
            <input type="number" placeholder="Enter daily hours" style={{ padding: 10, borderRadius: 8, border: '1px solid #ececec', width: 120, marginBottom: 16 }} />
            <div style={{ marginBottom: 16 }}>
              <input type="date" style={{ marginRight: 8 }} />
              <span style={{ margin: '0 8px' }}>—</span>
              <input type="date" />
            </div>
            <button style={{ background: 'var(--student-orange)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 600, width: '100%', marginBottom: 16 }}>Generate AI Timetable</button>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" defaultChecked />
              <span>AI Tailored Study Plan</span>
            </label>
          </section>
          {/* Illustration */}
          <section style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/study-illustration.png" alt="Study Illustration" style={{ width: 320, maxWidth: '100%' }} />
          </section>
        </div>
        {/* Calendar, Tasks, Productivity */}
        <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
          {/* Calendar */}
          <section style={{ flex: 2, background: 'var(--student-card)', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px #0001' }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <button style={{ background: 'var(--student-orange)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600 }}>Weekly</button>
              <button style={{ background: 'var(--student-card)', color: 'var(--student-orange)', border: '1px solid var(--student-orange)', borderRadius: 8, padding: '8px 20px', fontWeight: 600 }}>Monthly</button>
            </div>
            {/* Calendar grid placeholder */}
            <div style={{ height: 320, background: '#fff3', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb' }}>
              <span>Calendar Grid (AI-powered schedule)</span>
            </div>
          </section>
          {/* Tasks & Productivity */}
          <section style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: 'var(--student-card)', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px #0001' }}>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>Today's Tasks</div>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                <li><input type="checkbox" checked readOnly /> Read Algebra Chapter 3</li>
                <li><input type="checkbox" checked readOnly /> Review Newton's Laws</li>
              </ul>
            </div>
            <div style={{ background: 'var(--student-card)', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px #0001' }}>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>Productivity</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, color: 'var(--student-orange)' }}>1.5</div>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--student-muted)' }}>Hours Studied</div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                    <div style={{ width: 16, height: 32, background: 'var(--student-orange)', borderRadius: 4 }}></div>
                    <div style={{ width: 16, height: 20, background: '#ffe0b2', borderRadius: 4 }}></div>
                    <div style={{ width: 16, height: 24, background: '#ffe0b2', borderRadius: 4 }}></div>
                    <div style={{ width: 16, height: 12, background: '#ffe0b2', borderRadius: 4 }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ background: 'var(--student-card)', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px #0001' }}>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>Midterm Exam</div>
              <div style={{ fontSize: 15, color: 'var(--student-orange)', fontWeight: 700 }}>May 15, 2024 <span style={{ color: 'var(--student-muted)', fontWeight: 400 }}>(in 15 days)</span></div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
