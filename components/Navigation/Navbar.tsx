"use client";

import { Button } from "@/components/ui/button";
import { Bell, Menu, Search, Settings, TvMinimalPlay } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-50 drop-shadow-md">
      <div className="flex h-full items-center px-4 sm:px-6">
        <Button variant="ghost" size="icon" className="mr-4 md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-4">
          <TvMinimalPlay className="h-6 w-6" />
          <h1 className="text-lg font-semibold">OBS Framer</h1>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
