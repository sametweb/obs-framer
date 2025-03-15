"use client";

import { Navbar } from "@/components/Navigation/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginForm() {
  return (
    <div className="flex flex-col gap-6 h-screen">
      <Navbar />
      <div className="flex flex-col justify-center h-screen">
        <Card className="w-[400px] mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome</CardTitle>
            <CardDescription>Login with your Google account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signIn("google", { callbackUrl: "/browse" })}
              >
                <Image
                  src="https://google.com/favicon.ico"
                  alt="Google logo"
                  width={20}
                  height={20}
                />
                Continue with Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
