'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const redirect = async () => {
      try {
        // If we're already redirecting, do nothing
        if (isRedirecting) return;
        
        // If we're still loading auth state, wait a bit longer
        if (loading) {
          // Set a timeout to show an error if loading takes too long
          timeoutId = setTimeout(() => {
            if (loading) {
              setError('Taking too long to load. Please try refreshing the page.');
            }
          }, 5000); // 5 second timeout
          return;
        }
        
        // If we have an error, don't redirect
        if (error) return;
        
        // Set redirecting state
        setIsRedirecting(true);
        
        // Determine the redirect path
        const redirectPath = user ? '/dashboard' : '/login';
        
        // Use a small delay to ensure the UI has a chance to update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Try to use the router first
        try {
          router.push(redirectPath);
        } catch (err) {
          console.error('Router push failed, falling back to window.location:', err);
          // Fallback to window.location if router.push fails
          window.location.href = redirectPath;
        }
      } catch (err) {
        console.error('Error during redirect:', err);
        setError('An error occurred while loading the application. Please try again.');
        setIsRedirecting(false);
      }
    };
    
    redirect();
    
    // Cleanup function
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, loading, isRedirecting, error, router]);

  // Show error message if there was an error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Show loading spinner while checking auth state
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">
        {loading ? 'Loading application...' : 'Preparing your experience...'}
      </p>
    </div>
  );
}
