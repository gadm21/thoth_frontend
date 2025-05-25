'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string | null }>({ type: null, message: null });

  // Check for redirect messages and query parameters
  useEffect(() => {
    const message = searchParams.get('message');
    const statusType = searchParams.get('status');
    const expired = searchParams.get('expired');
    const error = searchParams.get('error');
    const redirect = searchParams.get('redirect');
    
    // Handle error messages from middleware
    if (error) {
      let errorMessage = 'An error occurred during authentication';
      
      if (error === 'invalid_token') {
        errorMessage = 'Your session is invalid. Please log in again.';
      } else if (error === 'expired') {
        errorMessage = 'Your session has expired. Please log in again.';
      }
      
      setStatus({ type: 'error', message: errorMessage });
    } 
    // Handle expired session
    else if (expired) {
      setStatus({ type: 'error', message: 'Your session has expired. Please log in again.' });
    }
    // Handle custom status messages
    else if (message && (statusType === 'success' || statusType === 'error')) {
      setStatus({ type: statusType, message: decodeURIComponent(message) });
    }
    
    // Store the redirect path if present
    if (redirect) {
      console.log(`[LoginPage] Stored redirect path: ${redirect}`);
      // No need to store in state, we'll use it directly in the redirect
    }
    
    // Clear the status after 5 seconds
    if (message || error || expired) {
      const timer = setTimeout(() => {
        setStatus({ type: null, message: null });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      console.log('[LoginPage] User is already authenticated, checking for redirect...');
      
      // Get the redirect path from URL or use default
      const redirectParam = searchParams.get('redirect');
      const redirectPath = (redirectParam && redirectParam.startsWith('/')) 
        ? redirectParam 
        : '/dashboard';
      
      console.log(`[LoginPage] Preparing to redirect to: ${redirectPath}`);
      
      // Use a small delay to ensure all state updates are processed
      const timer = setTimeout(() => {
        if (typeof window !== 'undefined') {
          // Only redirect if we're not already on the target path
          if (window.location.pathname !== redirectPath) {
            console.log(`[LoginPage] Executing redirect to: ${redirectPath}`);
            // Use replace to prevent adding to browser history
            window.location.replace(redirectPath);
          } else {
            console.log('[LoginPage] Already on the target path, skipping redirect');
          }
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user, loading, searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Welcome Back
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Sign in to your account to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {status.type && status.message && (
          <div className={`mb-6 p-4 rounded-md ${
            status.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
          }`}>
            <div className="flex items-center">
              {status.type === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              <p className="text-sm">{status.message}</p>
            </div>
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link 
                href="/register" 
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Create a new account
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm">
          <Link 
            href="/forgot-password" 
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}
