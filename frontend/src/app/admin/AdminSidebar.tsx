import Link from 'next/link';

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Degrees', href: '/admin/degrees' },
  { label: 'Subjects', href: '/admin/subjects' },
  { label: 'Exams', href: '/admin/exams' },
  { label: 'Students', href: '/admin/students' },
  { label: 'Study Plans', href: '/admin/study-plans' },
  { label: 'Analytics', href: '/admin/analytics' },
  { label: 'Subscriptions', href: '/admin/subscriptions' },
  { label: 'Settings', href: '/admin/settings' },
];

export default function AdminSidebar() {
  return (
    <aside className="h-screen w-60 border-r border-slate-200 bg-slate-50 p-6 dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="mb-8 text-xl font-bold text-slate-900 dark:text-slate-100">Admin Panel</h2>
      <nav>
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-base font-medium text-slate-700 hover:text-primary-600 dark:text-slate-300">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
