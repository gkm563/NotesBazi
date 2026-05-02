import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] pb-24 pt-6 md:pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-40 rounded-full mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-[500px] md:h-[600px] lg:h-[800px] rounded-[2rem]" />
          </div>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 space-y-6">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-lg" />
                <Skeleton className="h-6 w-20 rounded-lg" />
              </div>
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-6 w-1/2 rounded-lg" />
              <div className="grid grid-cols-3 gap-4 py-6">
                <Skeleton className="h-20 rounded-2xl" />
                <Skeleton className="h-20 rounded-2xl" />
                <Skeleton className="h-20 rounded-2xl" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="h-12 w-full rounded-full" />
              </div>
              <Skeleton className="h-20 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
