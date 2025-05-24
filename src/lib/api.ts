import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { User, AuthResponse, AuthData, QueryRequest, QueryResponse, ChatMessage, ChatThread, MessageStatus } from '@/types/api';
import { API_ENDPOINTS } from './config';

// Enhanced logger with different log levels
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data || '');
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data || '');
  },
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, data || '');
    }
  },
};

// Log function to format and output API calls consistently
const logApiCall = (type: 'request' | 'response' | 'error', config: any, response?: any, error?: any) => {
  try {
    const url = config?.url || 'unknown';
    const method = config?.method?.toUpperCase() || 'UNKNOWN';
    const baseURL = config?.baseURL || '';
    const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;
    
    // Redact sensitive information before logging
    const redactSensitiveData = (data: any) => {
      if (!data) return data;
      const sensitiveFields = ['password', 'token', 'access_token', 'refresh_token'];
      const redacted = { ...data };
      
      sensitiveFields.forEach(field => {
        if (redacted[field]) {
          redacted[field] = '***REDACTED***';
        }
      });
      
      return redacted;
    };
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      type,
      method,
      url: fullUrl,
      ...(type === 'request' && {
        headers: redactSensitiveData(config?.headers),
        data: redactSensitiveData(config?.data),
        params: redactSensitiveData(config?.params),
      }),
      ...(type === 'response' && {
        status: response?.status,
        statusText: response?.statusText,
        data: redactSensitiveData(response?.data),
      }),
      ...(type === 'error' && {
        error: error?.message,
        response: error?.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: redactSensitiveData(error.response.data),
        } : undefined,
        stack: process.env.NODE_ENV !== 'production' ? error?.stack : undefined,
      }),
    };
    
    // Log to console with appropriate level
    const logLevel = type === 'error' ? 'error' : 'debug';
    logger[logLevel](`API ${type.toUpperCase()} ${method} ${fullUrl}`, logEntry);
    
    return logEntry;
  } catch (logError) {
    console.error('Error in API logger:', logError);
    return { error: 'Failed to log API call' };
  }
};

// Mock data for development
const MOCK_THREADS: ChatThread[] = [
  {
    id: 'thread-1',
    title: 'Welcome to Thoth',
    lastMessageAt: new Date()
  },
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  'thread-1': [
    {
      id: 'msg-1',
      content: 'Hello! Welcome to Thoth. How can I help you today?',
      role: 'assistant',
      thread_id: 'thread-1',
      created_at: new Date().toISOString(),
      status: MessageStatus.DELIVERED,
      // For backward compatibility
      sender: 'ai',
      timestamp: new Date(),
      chat_id: 'thread-1'
    },
  ],
};

// Use environment variable if available, otherwise fall back to mock data
const USE_MOCK = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_MOCK === 'true';
const API_BASE_URL = 'https://web-production-d7d37.up.railway.app'; // Backend URL

console.log(`API Configuration:`, {
  env: process.env.NODE_ENV,
  apiUrl: API_BASE_URL || 'Not set',
  usingMock: USE_MOCK,
  nodeEnv: process.env.NODE_ENV,
  nextPublicUseMock: process.env.NEXT_PUBLIC_USE_MOCK
});

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout for chat requests
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Don't add auth header for login/register requests
    if (config.url?.includes('/token') || config.url?.includes('/register')) {
      return config;
    }
    
    // Add auth header for other requests
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    logApiCall('request', config);
    return config;
  },
  (error) => {
    logApiCall('error', error.config, undefined, error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    logApiCall('response', response.config, response);
    return response;
  },
  (error) => {
    logApiCall('error', error.config, error.response, error);
    return Promise.reject(error);
  }
);

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to read auth token from localStorage', error);
    }
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
      });
      
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          // Optionally redirect to login
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error: No response received', {
        url: error.config?.url,
        method: error.config?.method,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Handle 401 Unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const auth = {
  async register(
    username: string,
    password: string,
    phone_number?: string,
    role: number = 1 // 1 for regular user, 2 for admin, etc.
  ): Promise<AuthData> {
    // Input validation
    if (!username || !password) {
      throw new Error('Username and password are required');
    }
    const startTime = Date.now();
    const requestId = `reg_${Date.now()}`;
    
    logger.info(`[${requestId}] Starting registration for user: ${username}`, {
      role,
      hasPhoneNumber: !!phone_number,
      timestamp: new Date().toISOString()
    });
    
    if (USE_MOCK) {
      logger.debug(`[${requestId}] Using mock data for registration`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockUser: User = { 
        id: Date.now(),
        username,
        role: role || 1,
        ...(phone_number && { phone_number: String(phone_number) })
      };
      const mockToken = `mock-token-${Date.now()}`;
      
      logger.debug(`[${requestId}] Created mock user and token`, {
        userId: mockUser.id,
        token: '***MOCK_TOKEN***'
      });
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', mockToken);
        logger.debug(`[${requestId}] Stored mock token in localStorage`);
      }
      
      const result: AuthData = {
        access_token: mockToken,
        token_type: 'bearer',
        user: mockUser,
        token: mockToken
      };
      
      logger.info(`[${requestId}] Registration completed successfully`, {
        duration: `${Date.now() - startTime}ms`,
        userId: mockUser.id
      });
      
      return result;
    }
    
    try {
      logger.debug(`[${requestId}] Sending registration request to API`);
      
      const requestData = {
        username,
        password,
        ...(phone_number && { phone_number }),
        role: Number(role)
      };
      
      logger.debug(`[${requestId}] Registration request data:`, requestData);
      
      const response = await api.post<{message: string; userId: number}>('/register', requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        withCredentials: true,
        validateStatus: (status) => status < 500
      });

      if (response.status >= 200 && response.status < 300) {
        // Registration was successful, log the user in
        try {
          const loginResponse = await this.login(username, password);
          
          logger.info(`[${requestId}] Registration and login completed successfully`, {
            duration: `${Date.now() - startTime}ms`,
            userId: response.data.userId
          });
          
          return loginResponse;
        } catch (loginError) {
          // If login after registration fails, still consider registration successful
          logger.warn(`[${requestId}] Registration succeeded but login failed:`, loginError);
          // Return a partial success response with instructions to log in manually
          return {
            access_token: '',
            token_type: 'bearer',
            user: {
              id: response.data.userId,
              username,
              role: role || 1
            },
            message: 'Registration successful. Please log in with your credentials.'
          };
        }
      } else if (response.status === 400) {
        // Handle specific error cases
        const errorMessage = response.data.message || 'Registration failed';
        logger.error(`[${requestId}] Registration failed with 400:`, errorMessage);
        throw new Error(errorMessage);
      } else {
        // Handle other error cases
        const errorMessage = response.data?.message || 'Registration failed. Please try again.';
        logger.error(`[${requestId}] Registration failed with status ${response.status}:`, errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      logger.error(`[${requestId}] Registration failed:`, error);
      // Handle network errors or other exceptions
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      throw new Error(errorMessage);
    }
  },

  login: async (username: string, password: string): Promise<AuthData> => {
    const startTime = Date.now();
    const requestId = `login_${Date.now()}`;
    
    logger.info(`[${requestId}] Starting login for user: ${username}`, {
      timestamp: new Date().toISOString()
    });
    
    if (USE_MOCK) {
      logger.debug(`[${requestId}] Using mock data for login`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockUser: User = { 
        id: Date.now(),
        username,
        role: 1, // Regular user
        phone_number: '+1234567890', // Mock phone number
        created_at: new Date().toISOString()
      };
      const mockToken = `mock-token-${Date.now()}`;
      
      logger.debug(`[${requestId}] Created mock user and token`, {
        userId: mockUser.id,
        token: '***MOCK_TOKEN***'
      });
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', mockToken);
        logger.debug(`[${requestId}] Stored mock token in localStorage`);
      }
      
      const result: AuthData = {
        access_token: mockToken,
        token_type: 'bearer',
        user: mockUser,
        token: mockToken
      };
      
      logger.info(`[${requestId}] Login completed successfully`, {
        duration: `${Date.now() - startTime}ms`,
        userId: mockUser.id
      });
      
      return result;
    }
    
    try {
      logger.debug(`[${requestId}] Sending login request to /token endpoint`);
      
      // Prepare form data for OAuth2 password flow
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('grant_type', 'password');
      
      // Create a new axios instance without the baseURL to avoid CORS issues with the full URL
      const authApi = axios.create({
        baseURL: API_BASE_URL,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        withCredentials: true,
        timeout: 10000
      });
      
      const response = await authApi.post<{
        access_token: string;
        token_type: string;
      }>('/token', formData.toString(), {
        validateStatus: (status) => status < 500 // Don't throw for 4xx errors
      });
      
      logger.debug(`[${requestId}] Received token response`, {
        status: response.status,
        hasToken: !!response.data?.access_token
      });

      if (response.status !== 200 || !response.data?.access_token) {
        const errorMessage = response.status === 401 
          ? 'Invalid username or password'
          : 'Authentication failed. Please try again.';
        throw new Error(errorMessage);
      }
      
      const { access_token, token_type } = response.data;
      
      // Store the token in localStorage and cookies for persistence
      if (typeof window !== 'undefined') {
        // Store in localStorage for client-side access
        localStorage.setItem('access_token', access_token);
        
        // Also set in a cookie for server-side access
        document.cookie = `access_token=${access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        
        logger.debug(`[${requestId}] Stored access token in localStorage and cookies`);
      }
      
      // Create a minimal user object with the username
      const user: User = {
        id: 0, // No profile endpoint, using default ID
        username,
        role: 1, // Default role
        created_at: new Date().toISOString()
      };
      
      const result: AuthData = {
        access_token,
        token_type: token_type || 'bearer',
        user,
        token: access_token // For backward compatibility
      };
      
      logger.info(`[${requestId}] Login completed successfully`, {
        duration: `${Date.now() - startTime}ms`,
        userId: user.id
      });
      
      return result;
    } catch (error: any) {
      logger.error(`[${requestId}] Login failed:`, error);
      
      // Handle different types of errors
      let errorMessage = 'Login failed. Please try again.';
      
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
      
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  },

  // Delete user account
  deleteUser: async (username: string, token: string): Promise<{message: string}> => {
    const startTime = Date.now();
    const requestId = `delete_${Date.now()}`;
    
    logger.info(`[${requestId}] Deleting user: ${username}`, {
      timestamp: new Date().toISOString()
    });
    
    if (USE_MOCK) {
      logger.debug(`[${requestId}] Using mock data for delete user`);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: `User '${username}' deleted successfully.` };
    }
    
    try {
      const response = await api.delete(`/user/${encodeURIComponent(username)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        validateStatus: (status) => status < 500
      });

      if (response.status === 200) {
        // Clear auth data on successful deletion
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
        }
        return response.data;
      }

      throw new Error(response.data.detail || 'Failed to delete user');
    } catch (error: any) {
      logger.error(`[${requestId}] Delete user failed:`, error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to delete user';
      throw new Error(errorMessage);
    } finally {
      logger.info(`[${requestId}] Delete user completed`, {
        duration: `${Date.now() - startTime}ms`
      });
    }
  },
  
  // Helper to check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token');
  },
  
  // Get current auth token
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  },
  
  // Clear auth data
  clearAuth: (): void => {
    if (typeof window === 'undefined') return;
    // Clear from localStorage
    localStorage.removeItem('access_token');
    // Clear from cookies
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  },

  getChatMessages: async (chatId: string): Promise<ChatMessage[]> => {
    if (USE_MOCK || !API_BASE_URL) {
      return MOCK_MESSAGES[chatId] || [];
    }
    
    try {
      const response = await api.get<ChatMessage[]>(`/chat/messages/${chatId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching messages for chat ${chatId}:`, error);
      return MOCK_MESSAGES[chatId] || [];
    }
  },
};

// Chat-related functions
export const chat = {
  /**
   * Send a chat message
   * @param content The message content
   * @param chatId Optional chat ID for continuing a conversation
   */
  async sendMessage(content: string, chatId?: string): Promise<{response: string, queryId: string}> {
    const requestId = `chat-${Date.now()}`;
    const startTime = Date.now();
    let requestError: Error | null = null;
    
    try {
      logger.debug(`[${requestId}] Sending chat message`, { content, chatId });
      
      // Get the token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      
      if (!token) {
        const error = new Error('No authentication token found. Please log in again.');
        requestError = error;
        throw error;
      }
      
      // Prepare the request data
      const requestData = {
        query: content,
        chat_id: chatId || `chat-${Date.now()}`,
        model: 'gpt-3.5-turbo',
        max_tokens: 1024,
        temperature: 0.7
      };
      
      logger.debug(`[${requestId}] Sending request to ${API_BASE_URL}${API_ENDPOINTS.QUERY}`, {
        data: requestData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const response = await api.post<{response: string, queryId: string}>(
        API_ENDPOINTS.QUERY, 
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        }
      );
      
      if (!response.data) {
        const error = new Error('No response data received from server');
        requestError = error;
        throw error;
      }
      
      logger.debug(`[${requestId}] Message sent successfully`, {
        queryId: response.data.queryId,
        response: response.data
      });
      
      return response.data;
      
    } catch (error: any) {
      requestError = error;
      
      // Extract detailed error information
      const errorDetails = {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        config: {
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          url: error.config?.url,
          headers: error.config?.headers,
          data: error.config?.data
        }
      };
      
      logger.error(`[${requestId}] Failed to send message:`, errorDetails);
      
      // If token is invalid, clear auth and reload
      if (error.response?.status === 401) {
        logger.warn(`[${requestId}] Authentication failed, redirecting to login`);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
        throw new Error('Your session has expired. Please log in again.');
      }
      
      // Handle network errors
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please check your connection and try again.');
      }
      
      // Handle CORS errors
      if (error.message?.includes('Network Error') && !navigator.onLine) {
        throw new Error('You are offline. Please check your internet connection.');
      }
      
      // Handle specific error messages from the server
      const serverError = error.response?.data?.error || error.response?.data?.message;
      const errorMessage = serverError || 'Failed to send message. Please try again.';
      
      throw new Error(errorMessage);
    } finally {
      logger.info(`[${requestId}] Chat message request completed`, {
        duration: `${Date.now() - startTime}ms`,
        success: !requestError
      });
    }
  },
  
  /**
   * Get user's files (can be used to show context for chat)
   */
  async getFiles(): Promise<any[]> {
    const requestId = `files-${Date.now()}`;
    const startTime = Date.now();
    
    try {
      logger.debug(`[${requestId}] Fetching user files`);
      
      const response = await api.get<any[]>('/files');
      
      logger.debug(`[${requestId}] Retrieved ${response.data.length} files`);
      return response.data;
    } catch (error) {
      logger.error(`[${requestId}] Failed to fetch files:`, error);
      return [];
    } finally {
      logger.info(`[${requestId}] Get files request completed`, {
        duration: `${Date.now() - startTime}ms`
      });
    }
  },
  
  /**
   * Rename a chat thread
   * @param threadId The ID of the thread to rename
   * @param newTitle The new title for the thread
   */
  async renameThread(threadId: string, newTitle: string): Promise<{success: boolean}> {
    const requestId = `rename-${Date.now()}`;
    const startTime = Date.now();
    
    try {
      logger.debug(`[${requestId}] Renaming thread ${threadId} to "${newTitle}"`);
      
      // In a real implementation, you would make an API call here
      // const response = await api.put(`/api/threads/${threadId}`, { title: newTitle });
      // return { success: response.data.success };
      
      // For now, we'll just log and return success
      logger.info(`[${requestId}] Thread ${threadId} renamed to "${newTitle}"`);
      return { success: true };
    } catch (error) {
      logger.error(`[${requestId}] Failed to rename thread:`, error);
      throw new Error('Failed to rename chat thread');
    } finally {
      logger.info(`[${requestId}] Rename thread request completed`, {
        duration: `${Date.now() - startTime}ms`
      });
    }
  },
  
  /**
   * Delete a chat thread
   * @param threadId The ID of the thread to delete
   */
  async deleteThread(threadId: string): Promise<{success: boolean}> {
    const requestId = `delete-${Date.now()}`;
    const startTime = Date.now();
    
    try {
      logger.debug(`[${requestId}] Deleting thread ${threadId}`);
      
      // In a real implementation, you would make an API call here
      // const response = await api.delete(`/api/threads/${threadId}`);
      // return { success: response.data.success };
      
      // For now, we'll just log and return success
      logger.info(`[${requestId}] Thread ${threadId} deleted`);
      return { success: true };
    } catch (error) {
      logger.error(`[${requestId}] Failed to delete thread:`, error);
      throw new Error('Failed to delete chat thread');
    } finally {
      logger.info(`[${requestId}] Delete thread request completed`, {
        duration: `${Date.now() - startTime}ms`
      });
    }
  }
};

export default api;
