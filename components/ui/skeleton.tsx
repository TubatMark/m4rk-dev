/**
 * /components/ui/skeleton.tsx
 * Skeleton loading placeholder component
 * 
 * Usage:
 * import { Skeleton } from "@/components/ui/skeleton"
 * <Skeleton className="h-12 w-12 rounded-full" />
 */

import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
