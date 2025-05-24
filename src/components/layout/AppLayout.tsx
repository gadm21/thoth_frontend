'use client';

import { ReactNode } from 'react';
import Head from 'next/head';
import AlertBanner from '../AlertBanner';
import Sidebar from '../Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Head>
        <title>Thoth</title>
        <meta name="description" content="Thoth Application" />
      </Head>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AlertBanner />
        <main className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
