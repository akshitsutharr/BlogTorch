export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur">
        <div className="mb-4 flex items-center gap-3">
          <div className="loading-orb h-9 w-9 rounded-2xl bg-linear-to-br from-orange-500/90 to-pink-500/90" />
          <div>
            <p className="text-sm font-semibold tracking-tight">Preparing your feed</p>
            <p className="text-xs text-muted-foreground">Optimizing content and images...</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-full bg-muted/70">
          <div className="loading-bar h-2 rounded-full bg-linear-to-r from-orange-500 via-pink-500 to-orange-500" />
        </div>

        <div className="mt-4 space-y-2">
          <div className="loading-shimmer h-3 w-5/6 rounded bg-muted" />
          <div className="loading-shimmer h-3 w-2/3 rounded bg-muted [animation-delay:120ms]" />
        </div>
      </div>
    </div>
  );
}
