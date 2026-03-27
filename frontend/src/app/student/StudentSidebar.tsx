import Link from 'next/link';

const navItems = [
  { label: 'Dashboard', href: '/student/dashboard' },
  { label: 'Subjects', href: '/student/subjects' },
  { label: 'Exams', href: '/student/exams' },
  { label: 'Study Plans', href: '/student/study-plans' },
  { label: 'Analytics', href: '/student/analytics' },
  { label: 'Notifications', href: '/student/notifications' },
  { label: 'Settings', href: '/student/settings' },
  { label: 'Subscription', href: '/student/subscription' },
];

export default function StudentSidebar() {
  return (
    <aside style={{ width: 240, background: 'var(--student-sidebar)', height: '100vh', padding: 24, boxSizing: 'border-box', borderRight: '1px solid #e5e7eb' }}>
      <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 32, color: 'var(--student-orange)' }}>StudyAI</h2>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {navItems.map((item) => (
            <li key={item.href} style={{ marginBottom: 18 }}>
              <Link href={item.href} style={{ color: 'var(--student-link)', textDecoration: 'none', fontWeight: 500, fontSize: 17 }}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div style={{ marginTop: 32 }}>
        <button style={{ background: 'var(--student-orange)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 600, width: '100%' }}>Upgrade to Pro</button>
      </div>
    </aside>
  );
}
