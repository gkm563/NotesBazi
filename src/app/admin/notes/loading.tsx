import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-lg" />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Skeleton className="h-14 w-32 rounded-2xl" />
          <Skeleton className="h-14 w-full md:w-80 rounded-2xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 flex flex-col lg:flex-row gap-8 items-center border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20">
            <Skeleton className="h-24 w-24 rounded-3xl" />
            <div className="flex-grow space-y-4 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start gap-3">
                <Skeleton className="h-6 w-20 rounded-lg" />
                <Skeleton className="h-6 w-24 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-full max-w-md rounded-xl" />
              <div className="flex justify-center lg:justify-start gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <Skeleton className="h-12 w-32 rounded-2xl" />
              <Skeleton className="h-12 w-12 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
