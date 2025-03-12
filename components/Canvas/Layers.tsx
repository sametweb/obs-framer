"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFrameEditor } from "@/hooks/use-frame-settings";
import { deleteLayer, moveLayer, selectLayer } from "@/lib/store/editorSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { ImageLayer, Layer, TextLayer } from "@/lib/types";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

export default function Layers() {
  const { layers, layerEditor } = useFrameEditor();
  const dispatch = useAppDispatch();

  const handleMoveLayer = (id: string, direction: "up" | "down") => {
    dispatch(moveLayer({ id, direction }));
  };

  const getLayerName = (layer: Layer) => {
    if (layer.type === "text") {
      return (layer as TextLayer).text;
    } else if (layer.type === "image") {
      return (layer as ImageLayer).fileName;
    }
    return layer.id;
  };

  const displayLayers = [...(layers ?? [])].reverse();

  return (
    <>
      <Label>Layers</Label>
      <ScrollArea className="max-h-[300px] border rounded-md p-2">
        {displayLayers.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No text layers yet. Add some text to get started.
          </p>
        ) : (
          <div className="space-y-2">
            {displayLayers.map((layer, index) => (
              <div
                key={layer.id}
                className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                  layer.id === layerEditor?.id
                    ? "bg-accent"
                    : "hover:bg-accent/50"
                }`}
                onClick={() => dispatch(selectLayer(layer.id))}
              >
                <div className="flex flex-col space-y-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={index === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveLayer(layer.id, "down");
                    }}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={index === displayLayers.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveLayer(layer.id, "up");
                    }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {getLayerName(layer)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(deleteLayer(layer.id));
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </>
  );
}
