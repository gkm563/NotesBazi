import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="space-y-4">
        <Skeleton className="h-12 w-1/3 rounded-2xl" />
        <Skeleton className="h-6 w-2/3 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 rounded-[2rem]" />
        ))}
      </div>

      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-[2rem]" />
        ))}
      </div>
    </div>
  );
}

export function NoteDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <Skeleton className="h-[400px] w-full rounded-[3rem]" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-2/3 rounded-xl" />
        <Skeleton className="h-6 w-1/2 rounded-lg" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <Skeleton className="h-64 w-full rounded-[2rem]" />
    </div>
  );
}
