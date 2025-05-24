import { Metadata } from 'next';

// Viewport configuration should be exported separately in Next.js 13+
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#3B82F6',
};

const metadata: Metadata = {
  title: 'Thoth',
  description: 'A modern PWA chat application',
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
    description: 'A modern PWA chat application',
    url: '/',
    siteName: 'Thoth',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thoth',
    description: 'A modern PWA chat application',
  },
};

export default metadata;
