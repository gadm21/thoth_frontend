'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

const publicPaths = ['/login', '/register', '/forgot-password'];

export default function AuthSidebarWrapper() {
  const pathname = usePathname();
  
  // Don't show sidebar on auth pages
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return null;
  }
  
  return <Sidebar />;
}
