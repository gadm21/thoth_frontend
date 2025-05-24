'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';

type NavItem = {
  name: string;
  href: string;
  id: 'home' | 'chat' | 'projects' | 'knowledge';
};

export default function AlertBanner() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const navItems: NavItem[] = [
    { name: 'Home', href: '/dashboard', id: 'home' },
    { name: 'Chat', href: '/chat', id: 'chat' },
    { name: 'Projects', href: '/projects', id: 'projects' },
    { name: 'Knowledge Base', href: '/knowledge', id: 'knowledge' },
  ];

  const handleNavClick = (item: NavItem) => {
    // Update the URL without triggering a full page reload
    router.push(item.href);
    
    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu?.classList.contains('block')) {
      mobileMenu.classList.remove('block');
      mobileMenu.classList.add('hidden');
    }
  };

  const activeNavItem = navItems.find((item) => pathname.startsWith(item.href));

  return (
    <header className="bg-white shadow-sm dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">Thoth</span>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item)}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-indigo-500 text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-300 mr-4">
                    Hey, {user.username}!
                  </span>
                  <Button variant="outline" onClick={logout}>
                    Sign out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
