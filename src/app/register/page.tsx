'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import RegisterForm from '@/components/RegisterForm';

// Debug logger
const debug = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[RegisterPage]', ...args);
  }
};

export default function RegisterPage() {
  const { user, loading: authLoading } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  debug('Rendering RegisterPage', { 
    user, 
    authLoading, 
    isCheckingAuth, 
    pathname,
    initialLoad,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    debug('Auth state changed', { 
      user, 
      authLoading, 
      isCheckingAuth,
      initialLoad,
      timestamp: new Date().toISOString()
    });
    
    // Skip if still loading auth state
    if (authLoading) {
      debug('Auth still loading, skipping check');
      return;
    }
    
    // Mark initial load as complete
    if (initialLoad) {
      debug('Initial load complete, showing registration form');
      setInitialLoad(false);
      setIsCheckingAuth(false);
      return;
    }
    
    // Only redirect if user is logged in and this isn't the initial load
    if (user) {
      debug('User is logged in, redirecting to /chat', { user });
      router.push('/chat');
    } else {
      debug('No user logged in, showing registration form');
      setIsCheckingAuth(false);
    }
  }, [user, authLoading, initialLoad]);
  
  // Log when the component mounts and unmounts
  useEffect(() => {
    debug('Component mounted');
    return () => {
      debug('Component unmounting');
    };
  }, []);

  // Show loading state only when we're still checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <RegisterForm />
    </div>
  );
}
