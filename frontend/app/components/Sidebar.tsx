// components/Sidebar.tsx
import Link from 'next/link';
import { TodoIcon } from '../helpers/icons';


export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-100 h-screen p-4 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Navigation</h2>
      <div className="space-y-4">
        <nav className="space-y-2">
          <div className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200">
          <Link href="/" >
              <TodoIcon/>
              <span className="font-small">ToDo</span>
          </Link>
          </div>

        </nav>
      </div>
    </div>
  );
}