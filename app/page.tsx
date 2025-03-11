"use client";

import { browseRoute } from "@/components/Navigation/routes";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div
        className="relative flex-1 flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=5120&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Create Beautiful Frame Layouts
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Design professional-looking frames for your streaming setup with our
            intuitive editor. Perfect for streamers, content creators, and
            professionals.
          </p>
          <Button
            size="lg"
            onClick={() => router.push(browseRoute.path)}
            className="bg-white text-black hover:bg-gray-100"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-background py-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Customizable Frames</h3>
            <p className="text-muted-foreground">
              Create frames with custom sizes, colors, and layouts to match your
              brand.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Rich Text Editor</h3>
            <p className="text-muted-foreground">
              Add and style text with various fonts, colors, and effects.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Image Support</h3>
            <p className="text-muted-foreground">
              Import and position images to create professional layouts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
