import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileNav } from "@/components/mobile-nav";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NotesBazi | United Institute of Technology, Prayagraj",
  description: "Centralized notes sharing platform for students of UIT Prayagraj. Upload, browse, and download academic resources.",
  keywords: ["Notes", "UIT Prayagraj", "Engineering Notes", "PYQ", "Assignments"],
};

import { UploadProvider } from "@/components/providers/upload-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${inter.className} antialiased selection:bg-indigo-100 selection:text-indigo-900 bg-background text-foreground transition-colors`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <UploadProvider>
            <Navbar />
            <div className="pb-16 md:pb-0">
              {children}
            </div>
            <Footer />
            <MobileNav />
            <Toaster position="top-center" richColors closeButton />
          </UploadProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
