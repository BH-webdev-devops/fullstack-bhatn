// components/Sidebar.tsx
import Link from 'next/link';

interface MenuItem {
  name: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { name: 'Login', icon: '📊' },
  { name: 'Register', icon: '📝' }
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-100 h-screen p-4">
      <h2 className="text-lg font-bold mb-6">Navigation</h2>
      <nav className="space-y-2">
            <Link href="/">TODO</Link>
      </nav>
    </div>
  );
}