export default function SideBar() {
  return (
    <aside className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
      <nav>
        <button className="w-full mb-6 py-2 px-4 bg-indigo-600 text-white rounded hover:bg-blue-700 transition">
          + New Chat
        </button>
      </nav>
    </aside>
  );
}
