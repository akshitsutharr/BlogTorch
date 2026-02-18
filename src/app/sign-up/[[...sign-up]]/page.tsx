import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl items-center justify-center px-4 py-16">
      <SignUp />
    </div>
  );
}


