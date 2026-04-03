import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-48" />

      {/* Stats skeleton */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl p-6 ring-1 ring-foreground/10"
          >
            <Skeleton className="size-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions skeleton */}
      <div className="flex gap-3">
        <Skeleton className="h-8 w-32 rounded-lg" />
        <Skeleton className="h-8 w-32 rounded-lg" />
        <Skeleton className="h-8 w-32 rounded-lg" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl ring-1 ring-foreground/10">
        <div className="border-b px-4 py-3">
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="hidden h-4 w-24 sm:block" />
              <Skeleton className="hidden h-4 w-24 md:block" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
