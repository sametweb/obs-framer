"use client";

import { Navbar } from "@/components/Navigation/Navbar";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { Providers } from "./providers";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const classNames = clsx("mt-16", { "ml-16": !!session });
  return (
    <Providers>
      <TooltipProvider>
        <Navbar />
        <Sidebar />
        <main className={classNames}>{children}</main>
      </TooltipProvider>
    </Providers>
  );
}
