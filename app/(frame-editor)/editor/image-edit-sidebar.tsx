"use client";

import Layers from "@/components/Canvas/Layers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFonts } from "@/hooks/use-fonts";
import { useFrameEditor } from "@/hooks/use-frame-settings";
import { updateLayer } from "@/lib/store/editorSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { ImageLayer } from "@/lib/types";
import { useEffect, useState } from "react";

export function ImageEditSidebar() {
  const { frameEditor, layerEditor } = useFrameEditor();
  const dispatch = useAppDispatch();
  const { fontsLoaded } = useFonts();

  const selectedLayer =
    layerEditor?.type === "image" ? (layerEditor as ImageLayer) : undefined;
  const [width, setWidth] = useState(selectedLayer ? selectedLayer.width : 0);
  const [height, setHeight] = useState(
    selectedLayer ? selectedLayer.height : 0
  );
  const [x, setX] = useState(selectedLayer ? selectedLayer.x : 0);
  const [y, setY] = useState(selectedLayer ? selectedLayer.y : 0);

  useEffect(() => {
    if (selectedLayer) {
      setWidth(selectedLayer.width);
      setHeight(selectedLayer.height);
      setX(selectedLayer.x);
      setY(selectedLayer.y);
    }
  }, [selectedLayer]);

  if (!frameEditor || !selectedLayer) return null;

  if (!fontsLoaded) {
    return (
      <aside className="w-[300px] border-r border-border bg-card p-6">
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading fonts...</p>
        </div>
      </aside>
    );
  }

  const onSizeSave = () => {
    if (width != null && height != null) {
      const updates = { id: selectedLayer.id, updates: { width, height } };
      dispatch(updateLayer(updates));
    }
  };

  const onPositionSave = () => {
    if (x != null && y != null) {
      const updates = { id: selectedLayer.id, updates: { x, y } };
      dispatch(updateLayer(updates));
    }
  };

  return (
    <aside className="w-[300px] border-r bg-background">
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="p-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Layers />
            </div>
            <div className="space-y-2">
              <Label>Position</Label>
              <div className="flex space-x-2 items-end mt-2">
                <div>
                  <Label className="text-xs" htmlFor="x">
                    X
                  </Label>
                  <Input
                    id="x"
                    type="number"
                    value={Math.round(x)}
                    onChange={(e) => {
                      const newX = parseInt(e.target.value);
                      setX(newX);
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xs" htmlFor="y">
                    Y
                  </Label>
                  <Input
                    id="y"
                    type="number"
                    value={Math.round(y)}
                    onChange={(e) => {
                      const newY = parseInt(e.target.value);
                      setY(newY);
                    }}
                  />
                </div>
                <Button onClick={onPositionSave}>Save</Button>
              </div>
            </div>
            <div>
              <Label>Size</Label>
              <div className="flex space-x-2 items-end mt-2">
                <div>
                  <Label className="text-xs" htmlFor="width">
                    Width
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    placeholder="Width"
                    value={width}
                    onChange={(e) => {
                      const newWidth = parseInt(e.target.value);
                      setWidth(newWidth);
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xs" htmlFor="height">
                    Height
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Height"
                    value={height}
                    onChange={(e) => {
                      const newHeight = parseInt(e.target.value);
                      setHeight(newHeight);
                    }}
                  />
                </div>
                <Button onClick={onSizeSave}>Save</Button>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
