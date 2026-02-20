export default function NewPostLoading() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-4 py-24">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-pulse rounded-2xl bg-primary/20" />
        <p className="text-sm text-muted-foreground">Creating your new post…</p>
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
        </div>
      </div>
    </main>
  );
}
