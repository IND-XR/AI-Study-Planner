import StudentSidebar from './StudentSidebar';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--student-bg)' }}>
      <StudentSidebar />
      <main style={{ flex: 1, padding: 40 }}>{children}</main>
    </div>
  );
}
