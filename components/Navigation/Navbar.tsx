"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Menu,
  Search,
  Settings,
  TvMinimalPlay,
  User,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-50 drop-shadow-md">
      <div className="flex h-full items-center px-4 sm:px-6">
        <Button variant="ghost" size="icon" className="mr-4 md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <TvMinimalPlay className="h-6 w-6" />
            <h1 className="text-lg font-semibold">OBS Framer</h1>
          </Link>
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

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      className="rounded-full"
                      fill
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => signOut()}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" onClick={() => signIn()}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
