import { Skeleton } from "@/components/ui/skeleton"

interface LoadingSkeletonProps {
  type?: 'message' | 'input' | 'sidebar' | 'generic'
  className?: string
}

export function LoadingSkeleton({ 
  type = 'generic',
  className = ''
}: LoadingSkeletonProps) {
  switch (type) {
    case 'message':
      return (
        <div className={`flex space-x-3 p-4 ${className}`}>
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      )
    
    case 'input':
      return (
        <div className={`p-4 ${className}`}>
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      )
    
    case 'sidebar':
      return (
        <div className={`p-4 space-y-3 ${className}`}>
          <Skeleton className="h-6 w-32" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      )
    
    default:
      return <Skeleton className={className} />
  }
}

export function MessageSkeleton() {
  return <LoadingSkeleton type="message" />
}

export function InputSkeleton() {
  return <LoadingSkeleton type="input" />
}

export function SidebarSkeleton() {
  return <LoadingSkeleton type="sidebar" />
}

export default LoadingSkeleton
