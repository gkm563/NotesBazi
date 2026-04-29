import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-4 w-72 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-[2rem] shadow-lg shadow-slate-200/20" />
        ))}
      </div>

      <Skeleton className="h-[400px] w-full rounded-[2.5rem] shadow-xl shadow-slate-200/20" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="lg:col-span-2 h-[500px] rounded-[2.5rem]" />
        <Skeleton className="h-[500px] rounded-[2.5rem]" />
      </div>
    </div>
  );
}
