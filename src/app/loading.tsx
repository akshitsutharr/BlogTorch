export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-pulse rounded-2xl bg-primary/20" />
        <div className="flex gap-1">
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"
            style={{ backgroundColor: "hsl(var(--primary))" }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]"
            style={{ backgroundColor: "hsl(var(--primary))" }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full"
            style={{ backgroundColor: "hsl(var(--primary))" }}
          />
        </div>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}
