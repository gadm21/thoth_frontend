'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { chat } from '@/lib/api';
import { ChatMessage, ChatThread, MessageStatus } from '@/types/api';
import { useToast } from '@/hooks/useToast';



type ChatContextType = {
  messages: ChatMessage[];
  threads: ChatThread[];
  currentThreadId: string | null;
  loading: boolean;
  loadingMessages: boolean;
  sendMessage: (content: string) => Promise<void>;
  createNewThread: () => string;
  switchThread: (threadId: string) => void;
  updateMessageStatus: (messageId: string, status: MessageStatus, error?: string) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { showToast } = useToast();

  // Create a new chat thread
  const createNewThread = useCallback((): string => {
    const newThreadId = `chat-${uuidv4()}`;
    const newThread: ChatThread = {
      id: newThreadId,
      title: 'New Chat',
      lastMessageAt: new Date()
    };
    
    setCurrentThreadId(newThreadId);
    setMessages([]);
    setThreads(prev => [newThread, ...prev]);
    return newThreadId;
  }, []);
  
  // Switch to a different thread
  const switchThread = useCallback((threadId: string) => {
    console.log('Switching to thread:', threadId);
    setCurrentThreadId(threadId);
    // In a real app, you would load the messages for this thread here
    setMessages([]);
  }, []);
  
  // Update message status
  const updateMessageStatus = useCallback((messageId: string, status: MessageStatus, error?: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, status, ...(error && { error }) }
        : msg
    ));
  }, []);

  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    if (!currentThreadId) {
      console.error('No active chat thread');
      return;
    }

    const messageId = `msg-${Date.now()}`;
    
    // Create user message
    const userMessage: ChatMessage = {
      id: messageId,
      content,
      role: 'user',
      thread_id: currentThreadId,
      created_at: new Date().toISOString(),
      status: MessageStatus.SENDING,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages((prev: ChatMessage[]) => [...prev, userMessage]);
    
    try {
      setLoadingMessages(true);
      
      // Send the message to the API
      const response = await chat.sendMessage(content, currentThreadId);
      
      // Update the user message status to delivered
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: MessageStatus.DELIVERED }
          : msg
      ));
      
      // Create AI response message
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: response.response,
        role: 'assistant',
        thread_id: currentThreadId,
        created_at: new Date().toISOString(),
        status: MessageStatus.DELIVERED,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Update the message status to failed
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              status: MessageStatus.FAILED,
              error: error instanceof Error ? error.message : 'Failed to send message'
            }
          : msg
      ));
      
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setLoadingMessages(false);
    }
  }, [currentThreadId, showToast]);

  // Initialize with a new thread if none exists
  useEffect(() => {
    if (!currentThreadId) {
      createNewThread();
    }
  }, [currentThreadId, createNewThread]);

  const value = {
    messages,
    threads,
    currentThreadId,
    loading,
    loadingMessages,
    sendMessage,
    createNewThread,
    switchThread,
    updateMessageStatus,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
