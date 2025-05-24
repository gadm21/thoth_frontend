export interface User {
  id: number;
  userId?: number; // Alias for id for backward compatibility
  username: string;
  role: number; // 1 for user, 2 for admin, etc.
  phone_number?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  user?: User;
  message?: string;
  userId?: number;
}

export interface AuthData {
  access_token: string;
  token_type: string;
  user?: User;
  // For backward compatibility
  token?: string;
  // Optional message for additional information (e.g., success/error messages)
  message?: string;
}

export interface QueryRequest {
  query: string;
  chat_id: string;
  model?: string;
  max_tokens?: number;
  temperature?: number;
}

export interface QueryResponse {
  response: string;
  query: string;
  chat_id: string;
  queryId: number;
}

export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system' | 'ai';
  thread_id: string;
  created_at: string | Date;
  status?: MessageStatus;
  error?: string;
  sender: 'user' | 'ai';
  timestamp?: string | Date;
  chat_id?: string;
  isSending?: boolean;
  isLastMessage?: boolean;
  userId?: number; // For backward compatibility
}

export interface ChatThread {
  id: string;
  title: string;
  lastMessageAt: Date;
}
