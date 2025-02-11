"use client";

import { Navbar } from "@/components/Navigation/Navbar";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FrameSettingsProvider } from "@/contexts/FrameSettingsContext";
import { Providers } from "./providers";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <TooltipProvider>
        <FrameSettingsProvider>
          <Navbar />
          <Sidebar />
          <main className="ml-16 mt-16">{children}</main>
        </FrameSettingsProvider>
      </TooltipProvider>
    </Providers>
  );
}
