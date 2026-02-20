import { Skeleton } from "@/components/ui/skeleton";

export default function PostLoading() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Skeleton className="mb-8 aspect-[21/9] w-full rounded-2xl md:rounded-3xl" />
      <div className="mb-8 space-y-6">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
        <Skeleton className="h-12 w-4/5" />
        <Skeleton className="h-6 w-full" />
        <div className="flex items-center justify-between border-y border-border/60 py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </main>
  );
}
