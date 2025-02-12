"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { HelpCircle, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  frameRoute,
  homeRoute,
  NavItem,
  projectsRoute,
  textRoute,
} from "./routes";

const navItems: NavItem[] = [homeRoute, projectsRoute, frameRoute, textRoute];

const bottomNavItems: NavItem[] = [
  { icon: Settings, label: "Settings", path: "/" },
  { icon: HelpCircle, label: "Help", path: "/" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-16 border-r bg-background z-40">
      <div className="flex h-full flex-col justify-between py-4">
        <nav className="flex flex-col items-center space-y-2">
          {navItems.map(({ icon: ItemIcon, label, path }) => (
            <Link href={path ?? ""} key={label}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant={pathname === path ? "default" : "ghost"}
                    size="icon"
                    className={cn(
                      "h-10 w-10 rounded-lg",
                      "hover:bg-muted hover:text-primary"
                    )}
                  >
                    <ItemIcon className="h-5 w-5" />
                    <span className="sr-only">{label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-sm">
                  {label}
                </TooltipContent>
              </Tooltip>
            </Link>
          ))}
        </nav>
        <nav className="flex flex-col items-center space-y-2">
          {bottomNavItems.map(({ icon: ItemIcon, label, path }) => (
            <Tooltip key={label} delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-10 w-10 rounded-lg",
                    "hover:bg-muted hover:text-primary"
                  )}
                >
                  <ItemIcon className="h-5 w-5" />
                  <span className="sr-only">{label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-sm">
                {label}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </div>
    </aside>
  );
}
