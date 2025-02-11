"use client";

import { Navbar } from "@/components/Navigation/Navbar";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "./providers";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <TooltipProvider>
        <Navbar />
        <Sidebar />
        <main className="ml-16 mt-16">{children}</main>
      </TooltipProvider>
    </Providers>
  );
}
