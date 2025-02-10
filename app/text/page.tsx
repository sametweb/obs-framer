"use client";
import Preview from "@/components/Canvas/Preview";
import { Sidebar } from "./sidebar";

export default function page() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Preview />
    </div>
  );
}
