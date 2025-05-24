'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import { User } from '@/types/api';

// Debug logger
const debug = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[AuthContext]', ...args);
  }
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, phoneNumber?: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Function to set the auth token in both cookie and localStorage
  const setAuthToken = (token: string) => {
    try {
      // Set in localStorage for client-side access
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', token);
        
        // Set in cookie for server-side access with proper attributes
        const expires = new Date();
        expires.setDate(expires.getDate() + 7); // 7 days
        
        const cookieValue = [
          `access_token=${token}`,
          `path=/`,
          `expires=${expires.toUTCString()}`,
          `SameSite=Strict`,
          `Secure`,
          `HttpOnly`
        ].join('; ');
        
        document.cookie = cookieValue;
        console.log('[AuthContext] Set auth token in localStorage and cookies');
      }
    } catch (error) {
      console.error('[AuthContext] Error setting auth token:', error);
    }
  };

  // Function to clear auth data
  const clearAuthData = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setUser(null);
        console.log('[AuthContext] Cleared auth data');
      }
    } catch (error) {
      console.error('[AuthContext] Error clearing auth data:', error);
    }
  };

  // Function to load user data from token
  const loadUserData = async (isMounted = true, userData?: User) => {
    try {
      debug('Loading user from token...');
      const token = localStorage.getItem('access_token');
      debug('Token from localStorage:', token ? 'exists' : 'not found');
      
      if (!token) {
        debug('No token found, user is not authenticated');
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return null;
      }

      // If user data is provided (e.g., from login response), use it
      if (userData) {
        debug('Using provided user data:', userData);
        if (isMounted) {
          setUser(userData);
          setLoading(false);
        }
        return userData;
      }
      
      // If no user data is provided but we have a token, create a minimal user
      const minimalUser: User = {
        id: 0, // Default ID since we don't have a profile endpoint
        username: 'user', // Default username
        role: 1, // Default role (regular user)
        created_at: new Date().toISOString()
      };
      
      if (isMounted) {
        setUser(minimalUser);
        setLoading(false);
      }
      
      return minimalUser;
      
    } catch (error) {
      debug('Failed to load user:', error);
      if (isMounted) {
        setLoading(false);
      }
      // Don't throw here to prevent login failures
      return null;
    }
  };

  // Load user on mount and when router changes
  useEffect(() => {
    let mounted = true;
    
    const loadUser = async () => {
      try {
        await loadUserData();
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };

    loadUser();
    
    return () => {
      debug('AuthProvider unmounting');
      mounted = false;
    };
  }, [router]);
  
  // Add a global storage event listener to sync auth state across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token') {
        debug('Access token changed in another tab, reloading user data');
        loadUserData().catch(console.error);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    debug('Login attempt for user:', username);
    let isMounted = true;
    
    // Create a cleanup function
    const cleanup = () => {
      isMounted = false;
    };
    
    try {
      // Clear any existing auth state before login
      clearAuthData();
      setLoading(true);
      
      const result = await auth.login(username, password);
      debug('Login successful, result:', result);
      
      // Store the access token
      if (result?.access_token) {
        // Set the token in both localStorage and cookie
        setAuthToken(result.access_token);
        
        // Use the user data from the login response
      if (result.user) {
        await loadUserData(true, result.user);
        debug('Login successful, user data set from login response');
        return true;
      } else {
        // If no user data in response, load with minimal data
        const minimalUser = await loadUserData(true);
        if (isMounted && minimalUser) {
          debug('Login successful, using minimal user data');
          return true;
        } else {
          throw new Error('Failed to set user data after login');
        }
      }
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      if (isMounted) {
        debug('Login failed:', error);
        // Clear any partial auth state on error
        clearAuthData();
        setLoading(false);
        
        // Rethrow with a more user-friendly message if needed
        if (error instanceof Error) {
          if (error.message.includes('401')) {
            throw new Error('Invalid username or password');
          }
        }
        throw error;
      }
      return false;
    } finally {
      if (isMounted) {
        setLoading(false);
      }
      cleanup();
    }
    
    return false;
  };

  const register = async (username: string, password: string, phoneNumber?: string) => {
    try {
      await auth.register(username, password, phoneNumber);
      await login(username, password);
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  };

  const logout = () => {
    debug('Logging out user');
    clearAuthData();
    // Use window.location to ensure a full page reload and clear all state
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
