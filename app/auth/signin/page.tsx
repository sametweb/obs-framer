"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-8 space-y-6">
          <Button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex w-full items-center justify-center gap-3 rounded-lg border px-5 py-2.5 text-center text-sm font-medium transition-all hover:bg-gray-50"
            variant="outline"
          >
            <Image
              src="https://www.google.com/favicon.ico"
              alt="Google Logo"
              width={20}
              height={20}
            />
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
}