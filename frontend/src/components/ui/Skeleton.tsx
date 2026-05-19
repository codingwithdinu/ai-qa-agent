interface SkeletonProps {
  className?: string
}

export function Skeleton({
  className = 'h-6 w-full',
}: SkeletonProps) {
  return <div className={`animate-pulse rounded-2xl bg-white/5 ${className}`} />
}

