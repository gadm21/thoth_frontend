'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { FiMessageSquare, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { useToast } from '@/hooks/useToast';
import { MessageStatus, ChatMessage as ChatMessageType } from '@/types/api';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function ChatPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
    messages,
    loading: loadingMessages,
    sendMessage,
    currentThreadId,
    createNewThread,
    switchThread,
    updateMessageStatus,
  } = useChat();
  
  // Get current thread title if available
  const currentThreadTitle = useMemo(() => {
    return 'Current Chat';
  }, []);
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isSending) return;
    
    setIsSending(true);
    
    try {
      // Send the message - the ChatContext will handle adding it to the messages array
      await sendMessage(content);
    } catch (error) {
      console.error('Error sending message:', error);
      // Use string message for toast to avoid type issues
      toast('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  }, [isSending, messages, sendMessage, toast, updateMessageStatus]);

  const handleNewChat = useCallback(() => {
    createNewThread();
  }, [createNewThread]);

  const handleThreadSelect = useCallback((threadId: string) => {
    switchThread(threadId);
  }, [switchThread]);

  const handleRetryMessage = useCallback((messageId: string) => {
    const message = messages.find((m: ChatMessageType) => m.id === messageId);
    if (message) {
      sendMessage(message.content);
    }
  }, [messages, sendMessage]);

  // Memoize the chat messages to prevent unnecessary re-renders
  const chatMessages = useMemo(() => {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <FiLoader className="animate-spin h-8 w-8 text-blue-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FiMessageSquare className="h-12 w-12 mb-4" />
            <p className="text-lg">Start a new conversation</p>
            <p className="text-sm mt-1">Ask me anything or upload files to get started</p>
          </div>
        ) : (
          messages.map((message: ChatMessageType) => (
            <ChatMessage
              key={message.id}
              message={message}
              onStatusChange={updateMessageStatus}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    );
  }, [messages, loadingMessages, handleRetryMessage]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-900">
        {/* Chat header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 px-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
            {currentThreadTitle}
          </h1>
          <button
            onClick={handleNewChat}
            className="flex items-center space-x-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-3 py-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30"
            disabled={isSending}
          >
            <FiMessageSquare className="h-4 w-4" />
            <span>New Chat</span>
          </button>
        </header>

        {/* Chat messages */}
        <div className="flex-1 overflow-hidden">
          {chatMessages}
        </div>

        {/* Chat input */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="relative">
            <ChatInput
              onSend={handleSendMessage}
              isSending={isSending}
              onStop={() => {
                console.log('Stop generation requested');
              }}
            />
            {isSending && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <FiLoader className="animate-spin h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
