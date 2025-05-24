// Type definitions for Next.js with PWA
import 'next';

declare module 'next' {
  export interface NextConfig {
    pwa?: {
      dest?: string;
      disable?: boolean;
      runtimeCaching?: any[];
    };
  }
}

declare module '@ducanh2912/next-pwa' {
  import { NextConfig } from 'next';
  
  function withPWA(config?: NextConfig): NextConfig;
  export default withPWA;
}
