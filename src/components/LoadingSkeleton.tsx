import { FC } from 'react';

interface LoadingSkeletonProps {
  type?: 'message' | 'input' | 'sidebar' | 'generic';
  className?: string;
}

export const LoadingSkeleton: FC<LoadingSkeletonProps> = ({ 
  type = 'generic',
  className = ''
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';
  
  const renderSkeleton = () => {
    switch (type) {
      case 'message':
        return (
          <div className={`flex space-x-3 p-4 ${className}`}>
            <div className="flex-shrink-0">
              <div className={`h-10 w-10 rounded-full ${baseClasses}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <div className={`h-4 w-24 ${baseClasses}`} />
                <div className={`h-3 w-16 ${baseClasses}`} />
              </div>
              <div className="mt-2">
                <div className={`h-4 w-full ${baseClasses} mb-2`} />
                <div className={`h-4 w-5/6 ${baseClasses}`} />
              </div>
            </div>
          </div>
        );
      
      case 'input':
        return (
          <div className={`p-4 ${className}`}>
            <div className={`h-12 rounded-lg ${baseClasses}`} />
          </div>
        );
      
      case 'sidebar':
        return (
          <div className={`p-4 space-y-3 ${className}`}>
            <div className={`h-6 w-32 ${baseClasses}`} />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-4 w-full ${baseClasses}`} />
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div className={className}>
            <div className={`h-full w-full ${baseClasses}`} />
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderSkeleton()}
    </div>
  );
};

export const MessageSkeleton = () => <LoadingSkeleton type="message" />;
export const InputSkeleton = () => <LoadingSkeleton type="input" />;
export const SidebarSkeleton = () => <LoadingSkeleton type="sidebar" />;

export default LoadingSkeleton;
