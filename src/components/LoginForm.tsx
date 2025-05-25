'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

interface FormErrors {
  username?: string;
  password?: string;
  form?: string;
}

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Clear errors when input values change
  useEffect(() => {
    if (errors.username && username) {
      setErrors(prev => ({ ...prev, username: undefined }));
    }
    if (errors.password && password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  }, [username, password]);

  // Handle redirect after successful login
  useEffect(() => {
    if (isLoggedIn && user) {
      console.log('[LoginForm] User is logged in, preparing redirect...');
      
      // Get the redirect path from URL or use default
      const redirectParam = searchParams.get('redirect');
      const redirectPath = redirectParam && redirectParam.startsWith('/') 
        ? redirectParam 
        : '/dashboard';
      
      console.log(`[LoginForm] Preparing to redirect to: ${redirectPath}`);
      
      // Use a small delay to ensure all state updates are processed
      const timer = setTimeout(() => {
        // Only redirect if we're not already on the target path
        if (window.location.pathname !== redirectPath) {
          console.log(`[LoginForm] Executing redirect to: ${redirectPath}`);
          // Use replace to prevent adding to browser history
          window.location.replace(redirectPath);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, user, searchParams]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setErrors({});
    setIsSubmitting(true);

    try {
      const success = await login(username, password);
      if (success) {
        // Set the logged in state to trigger the redirect
        setIsLoggedIn(true);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Invalid username or password';
      
      if (error.response) {
        // Handle HTTP error responses
        if (error.response.status === 401) {
          errorMessage = 'Invalid username or password';
        } else if (error.response.data?.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data?.error_description) {
          errorMessage = error.response.data.error_description;
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        // Handle other errors with messages
        errorMessage = error.message;
      }
      
      setErrors({ form: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {errors.form && (
        <div 
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-md flex items-start"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 mr-2" />
          <span className="text-sm">{errors.form}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username
          </label>
          <div className="relative">
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className={`appearance-none block w-full px-3 py-2 border ${
                errors.username 
                  ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
              } dark:bg-gray-700 dark:text-white placeholder-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm`}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? 'username-error' : undefined}
            />
          </div>
          {errors.username && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400" id="username-error">
              {errors.username}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <Link 
              href="/forgot-password" 
              className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              className={`appearance-none block w-full px-3 py-2 border ${
                errors.password 
                  ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
              } dark:bg-gray-700 dark:text-white placeholder-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm pr-10`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400" id="password-error">
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
            disabled={isSubmitting}
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Remember me
          </label>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </div>
    </form>
  );
}
