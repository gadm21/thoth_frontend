'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ChatProvider>
        {children}
        <Toaster position="bottom-right" />
      </ChatProvider>
    </AuthProvider>
  );
}
