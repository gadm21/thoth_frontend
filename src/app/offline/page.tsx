import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">You're Offline</h1>
        <p className="text-gray-600 dark:text-gray-300">
          It looks like you're not connected to the internet. Please check your connection and try again.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
