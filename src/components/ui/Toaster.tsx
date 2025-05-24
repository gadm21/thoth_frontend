'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        className:
          'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg',
        success: {
          iconTheme: {
            primary: '#10B981',
            secondary: 'white',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: 'white',
          },
        },
        loading: {
          iconTheme: {
            primary: '#3B82F6',
            secondary: 'white',
          },
        },
      }}
    />
  );
}
