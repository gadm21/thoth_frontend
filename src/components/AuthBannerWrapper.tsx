'use client';

import { usePathname } from 'next/navigation';
import AlertBanner from './AlertBanner';

const publicPaths = ['/login', '/register', '/forgot-password'];

export default function AuthBannerWrapper() {
  const pathname = usePathname();
  
  // Don't show banner on auth pages
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return null;
  }
  
  return <AlertBanner />;
}
