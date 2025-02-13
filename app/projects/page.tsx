"use client";

import { frameRoute } from "@/components/Navigation/routes";
import { Button } from "@/components/ui/button";
import { useFrameSettings } from "@/hooks/use-frame-settings";
import { openFrameEditor } from "@/lib/store/frameSettingsSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { formatDistanceToNow } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { FrameSettings } from "../frame/constants";
import { renderCanvas } from "../frame/utils";

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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { frames, deleteFrame } = useFrameSettings();

  const onProjectClick = (frame: FrameSettings) => {
    dispatch(openFrameEditor(frame));
    router.push(frameRoute.path);
  };

  const onAddNewClick = () => {
    dispatch(openFrameEditor());
    router.push(frameRoute.path);
  };

  return (
    <div className="flex h-screen">
      <main className="flex-1 p-6 bg-background">
        <div className="max-w-screen-xl mx-auto h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Projects </h2>
            <Button onClick={onAddNewClick}>
              Add new <Plus className="w-4 h-4 ml-2" />
            </Button>
          </div>
          {frames.length === 0 && (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <p className="text-muted-foreground">
                No projects yet. Create one to get started.
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {frames.length > 0 &&
              frames.map((frame) => (
                <Card
                  key={frame.id}
                  onClick={() => onProjectClick(frame)}
                  className="cursor-pointer"
                >
                  <CardHeader>
                    <CardTitle>{frame.documentName ?? "(no name)"}</CardTitle>
                    <CardDescription>
                      Last modified:{" "}
                      {formatDistanceToNow(new Date(frame.modifiedAt), {
                        addSuffix: true,
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FrameCanvas frame={frame} />
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Trash2
                      size={16}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFrame(frame.id);
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
    const state = {
      layers: props.frame.textLayers || [],
      selectedLayerId: null,
    };
    renderCanvas(ref, props.frame, state);
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
