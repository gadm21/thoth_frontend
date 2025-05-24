'use client';

import { useAuth } from '@/contexts/AuthContext';
import SimpleInfoCard from '@/components/SimpleInfoCard';

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hey{user?.username ? `, ${user.username}` : ''}!
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Welcome back to your dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <SimpleInfoCard type="courses" count={0} />
          <SimpleInfoCard type="friends" count={0} />
          <SimpleInfoCard type="files" count={0} />
          <SimpleInfoCard type="messages" count={0} />
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Start New Chat
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Enroll in Course
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              Upload File
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
              Join Community
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No recent activity
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Quick Links
            </h2>
            <div className="space-y-2">
              {[
                { name: 'Documentation', url: '#' },
                { name: 'Help Center', url: '#' },
                { name: 'Community Forums', url: '#' },
                { name: 'Contact Support', url: '#' },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  className="block text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
