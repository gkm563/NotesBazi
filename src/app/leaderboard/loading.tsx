import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] pb-24 pt-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <Skeleton className="h-8 w-40 mx-auto rounded-full" />
          <Skeleton className="h-16 w-3/4 mx-auto rounded-2xl" />
          <Skeleton className="h-6 w-1/2 mx-auto rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Skeleton className="h-[350px] rounded-[2.5rem]" />
          <Skeleton className="h-[400px] rounded-[2.5rem]" />
          <Skeleton className="h-[350px] rounded-[2.5rem]" />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 space-y-6">
           <Skeleton className="h-10 w-1/4 rounded-xl" />
           {[1, 2, 3, 4, 5].map((i) => (
             <div key={i} className="flex justify-between items-center py-4">
                <div className="flex items-center gap-4">
                   <Skeleton className="h-8 w-8 rounded-full" />
                   <Skeleton className="h-12 w-12 rounded-2xl" />
                   <div className="space-y-2">
                      <Skeleton className="h-5 w-32 rounded-md" />
                      <Skeleton className="h-3 w-20 rounded-md" />
                   </div>
                </div>
                <Skeleton className="h-8 w-24 rounded-xl" />
             </div>
           ))}
        </div>
      </div>
    </main>
  );
}
