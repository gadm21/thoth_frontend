'use client';

import { useEffect } from 'react';

const ServiceWorkerRegister = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(error => {
          console.error('ServiceWorker registration failed: ', error);
        });
    }
  }, []);

  return null; // This component doesn't render anything
};

export default ServiceWorkerRegister;
