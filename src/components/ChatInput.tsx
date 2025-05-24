'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, StopCircle } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isSending: boolean;
  onStop: () => void;
}

export default function ChatInput({ onSend, isSending, onStop }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isSending) {
      onSend(message);
      setMessage('');
      resetTextareaHeight();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="flex items-end space-x-2">
        <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
          <div className="flex items-center px-3 py-2">
            <button
              type="button"
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
              disabled={isSending}
            >
              <Paperclip className="h-5 w-5" />
              <span className="sr-only">Attach file</span>
            </button>
            <div className="flex-1 mx-2">
              <label htmlFor="chat-input" className="sr-only">
                Type your message
              </label>
              <textarea
                id="chat-input"
                ref={textareaRef}
                rows={1}
                className="block w-full px-0 text-sm text-gray-900 bg-transparent border-0 dark:text-white placeholder-gray-500 focus:ring-0 resize-none overflow-hidden max-h-32"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSending}
              />
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          {isSending ? (
            <button
              type="button"
              onClick={onStop}
              className="inline-flex items-center justify-center p-2 rounded-full text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <StopCircle className="h-5 w-5" />
              <span className="sr-only">Stop generating</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!message.trim() || isSending}
              className="inline-flex items-center justify-center p-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </button>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
        AI Chat App can make mistakes. Consider checking important information.
      </p>
    </form>
  );
}
