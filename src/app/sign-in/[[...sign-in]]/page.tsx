import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="page-shell flex min-h-[calc(100dvh-7rem)] items-center justify-center">
      <section className="section-shell w-full max-w-5xl">
        <div className="section-core grid items-center gap-8 px-6 py-8 md:grid-cols-[1fr_auto] md:px-10 md:py-10">
          <div className="space-y-4">
            <p className="eyebrow-chip">Welcome back</p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Sign in to Blog Torch</h1>
            <p className="max-w-[56ch] text-sm text-muted-foreground md:text-base">
              Continue writing, track post performance, and engage with your saved stories.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <SignIn />
          </div>
        </div>
      </section>
    </main>
  );
}


