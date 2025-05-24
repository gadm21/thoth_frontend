'use client';

import { useState, useEffect } from 'react';
import { Plus, MessageSquare, Menu, X } from 'lucide-react';
import { ChatThread } from '@/types/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ChatSidebarProps {
  threads: ChatThread[];
  currentThreadId: string | null;
  onNewChat: () => void;
  onSelectThread: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatSidebar({
  threads,
  currentThreadId,
  onNewChat,
  onSelectThread,
  isOpen,
  onClose,
}: ChatSidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isMobile && !isOpen) {
    return null;
  }

  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${isMobile ? 'translate-x-0' : 'translate-x-0'} md:relative md:translate-x-0 z-30 transition-transform duration-300 ease-in-out`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Chats</h2>
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {threads.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No chats yet</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Start a new chat to get started</p>
            </div>
          ) : (
            <nav className="px-2 space-y-1">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => onSelectThread(thread.id)}
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                    thread.id === currentThreadId
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <MessageSquare className="flex-shrink-0 h-4 w-4 mr-3" />
                  <span className="truncate">{thread.title || 'New Chat'}</span>
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-medium">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.username || 'User'}</p>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
