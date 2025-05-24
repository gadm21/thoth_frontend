'use client';

import dynamic from 'next/dynamic';

// Dynamically import InstallButton with SSR disabled
const InstallButton = dynamic(
  () => import('@/components/InstallButton'),
  { ssr: false }
);

export default function InstallButtonWrapper() {
  return <InstallButton />;
}
