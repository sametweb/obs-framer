import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { ClientLayout } from "../client-layout";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OBS Framer",
  description: "OBS Framer App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This forces the layout to be dynamic
  headers();

  return <ClientLayout>{children}</ClientLayout>;
}
