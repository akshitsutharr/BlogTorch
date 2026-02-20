export default function EditorLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-10 w-10 animate-pulse rounded-2xl bg-primary/20" />
        <p className="mt-4 text-sm text-muted-foreground">Loading editor…</p>
      </div>
    </main>
  );
}
