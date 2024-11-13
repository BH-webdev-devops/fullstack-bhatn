import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold">My App</div>
      <nav className="flex flex-col p-4">
        <Link href="/">
          <a className="mb-2 p-2 hover:bg-gray-700 rounded">Home</a>
        </Link>
        <Link href="/todo">
          <a className="mb-2 p-2 hover:bg-gray-700 rounded">Todo List</a>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;