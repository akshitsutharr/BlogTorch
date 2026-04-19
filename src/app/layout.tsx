import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Blog Torch",
    template: "%s · Blog Torch",
  },
  description:
    "A premium, design-first developer blogging platform where code meets storytelling — projects, ML models, experiments, and notebook-style posts.",
  metadataBase: process.env.NEXT_PUBLIC_APP_URL
    ? new URL(process.env.NEXT_PUBLIC_APP_URL)
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            themes={['light', 'dark', 'light-grey']}
          >
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
            >
              Skip to content
            </a>
            <div className="site-noise relative min-h-dvh overflow-x-clip bg-background text-foreground">
              <div className="pointer-events-none fixed inset-0 z-0">
                <div className="ambient-grid absolute inset-0" />
                <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-orange-500/12 blur-[110px]" />
                <div className="absolute -right-20 top-44 h-80 w-80 rounded-full bg-pink-500/10 blur-[120px]" />
                <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]" />
              </div>
              <Navbar />
              <div id="main-content" className="relative z-10">{children}</div>
            </div>
            <Toaster
              richColors
              toastOptions={{
                className:
                  "rounded-3xl border border-border/60 bg-popover/80 text-popover-foreground shadow-xl backdrop-blur",
              }}
            />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
