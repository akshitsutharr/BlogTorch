import { Skeleton } from "@/components/ui/skeleton";

export default function SavedLoading() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card sm:flex-row"
          >
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex items-center gap-2">
                <Skeleton className="size-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-40 sm:w-48" />
          </div>
        ))}
      </div>
    </main>
  );
}
