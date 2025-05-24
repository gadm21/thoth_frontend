import { Inter } from 'next/font/google';
import ErrorBoundary from '@/components/ErrorBoundary';
import ClientOnly from '@/components/ClientOnly';
import './globals.css';
import { Metadata } from 'next';
import AuthSidebarWrapper from '@/components/AuthSidebarWrapper';
import AuthBannerWrapper from '@/components/AuthBannerWrapper';
import { Providers } from '@/components/providers';
import InstallButtonWrapper from '@/components/client/InstallButtonWrapper';
import ServiceWorkerRegister from '@/components/client/ServiceWorkerRegister';

const inter = Inter({ subsets: ['latin'] });

// Viewport configuration should be exported separately in Next.js 13+
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#1F2937',
};

export const metadata: Metadata = {
  title: 'Thoth',
  description: 'Your personal learning and productivity assistant',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Thoth',
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/apple-touch-icon.png',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Thoth',
    description: 'Your personal learning and productivity assistant',
    url: '/',
    siteName: 'Thoth',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thoth',
    description: 'Your personal learning and productivity assistant',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Thoth" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Thoth" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#1F2937" />
        <meta name="theme-color" content="#1F2937" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        <ErrorBoundary>
          <ClientOnly>
            <Providers>
              <div className="flex h-screen overflow-hidden">
                <AuthSidebarWrapper />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <AuthBannerWrapper />
                  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
                    {children}
                    <InstallButtonWrapper />
                    <ServiceWorkerRegister />
                  </main>
                </div>
              </div>
            </Providers>
          </ClientOnly>
        </ErrorBoundary>
      </body>
    </html>
  );
}
