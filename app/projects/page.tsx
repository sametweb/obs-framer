"use client";

import { useFrameSettings } from "@/contexts/FrameSettingsContext";
import localStorageService from "@/lib/localStorageService";
import { Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FrameSettings } from "../frame-settings/constants";
import { renderCanvas } from "../frame-settings/utils";

const Card = dynamic(() => import("@/components/ui/card").then((c) => c.Card), {
  ssr: false,
});
const CardHeader = dynamic(
  () => import("@/components/ui/card").then((c) => c.CardHeader),
  { ssr: false }
);
const CardTitle = dynamic(
  () => import("@/components/ui/card").then((c) => c.CardTitle),
  { ssr: false }
);
const CardDescription = dynamic(
  () => import("@/components/ui/card").then((c) => c.CardDescription),
  { ssr: false }
);
const CardContent = dynamic(
  () => import("@/components/ui/card").then((c) => c.CardContent),
  { ssr: false }
);
const CardFooter = dynamic(
  () => import("@/components/ui/card").then((c) => c.CardFooter),
  { ssr: false }
);

export default function Home() {
  const [frames, setFrames] = useState<FrameSettings[]>(
    () => localStorageService.getItem<FrameSettings[]>("frames") ?? []
  );

  const router = useRouter();
  const { updateFrameSettings } = useFrameSettings();

  const onProjectClick = (frame: FrameSettings) => {
    updateFrameSettings(frame);
    router.push("/frame-settings");
  };

  return (
    <div className="flex h-screen">
      <main className="flex-1 p-6 bg-background">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {frames.length === 0 && <div>Nothing to see here.</div>}
            {frames.length > 0 &&
              frames.map((frame, i) => (
                <Card key={i} onClick={() => onProjectClick(frame)}>
                  <CardHeader>
                    <CardTitle>{frame.documentName ?? "(no name)"}</CardTitle>
                    <CardDescription>Last modified: asdasd</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FrameCanvas frame={frame} />
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Trash2
                      size={16}
                      onClick={() => {
                        localStorageService.removeItemFromArray<FrameSettings>(
                          "frames",
                          frame.id
                        );
                        setFrames(frames.filter((_, index) => index !== i));
                      }}
                    />
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function FrameCanvas(props: React.PropsWithChildren<{ frame: FrameSettings }>) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    renderCanvas(ref, props.frame);
  }, [props.frame]);

  return (
    <canvas
      ref={ref}
      width={props.frame.screenWidth}
      height={props.frame.screenHeight}
      className="max-w-full h-auto"
    />
  );
}
