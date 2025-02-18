"use client";

import { editorRoute } from "@/components/Navigation/routes";
import { Button } from "@/components/ui/button";
import { useFrameEditor } from "@/hooks/use-frame-settings";
import { openFrameEditor } from "@/lib/store/frameEditorSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setState } from "@/lib/store/layerEditorSlice";
import { FrameEditor, Layer } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { renderCanvas } from "../editor/utils";

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
  const { frames, deleteFrame } = useFrameEditor();
  const { layers } = useAppSelector((state) => state.layerEditor);

  const onProjectClick = (frame: FrameEditor) => {
    // Reset text editor state before opening the frame
    dispatch(setState({ layers: layers || [], selectedLayerId: null }));
    dispatch(openFrameEditor(frame));
    router.push(editorRoute.path);
  };

  const onAddNewClick = () => {
    // Reset text editor state before creating a new frame
    dispatch(setState({ layers: [], selectedLayerId: null }));
    dispatch(openFrameEditor());
    router.push(editorRoute.path);
  };

  return (
    <div className="flex h-screen">
      <main className="flex-1 p-6 bg-background">
        <div className="max-w-screen-xl mx-auto h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My frames </h2>
            <Button onClick={onAddNewClick}>
              Add new <Plus className="w-4 h-4 ml-2" />
            </Button>
          </div>
          {frames.length === 0 && (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <p className="text-muted-foreground">
                You don&apos;t have any frames yet. Create one to get started.
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
                    <FrameCanvas frame={frame} layers={layers} />
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

function FrameCanvas(
  props: React.PropsWithChildren<{ frame: FrameEditor; layers: Layer[] }>
) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const state = {
      layers: props.layers || [],
      selectedLayerId: null,
    };
    renderCanvas(ref, props.frame, state);
  }, [props.frame, props.layers]);

  return (
    <canvas
      ref={ref}
      width={props.frame.screenWidth}
      height={props.frame.screenHeight}
      className="max-w-full h-auto"
    />
  );
}
