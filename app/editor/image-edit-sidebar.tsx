"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFonts } from "@/hooks/use-fonts";
import { useFrameSettings } from "@/hooks/use-frame-settings";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { updateLayer } from "@/lib/store/textEditorSlice";
import { ImageLayer } from "@/lib/types";
import { useEffect, useState } from "react";

export function ImageEditSidebar() {
  const { frameSettings } = useFrameSettings();
  const dispatch = useAppDispatch();
  const { layers, selectedLayerId } = useAppSelector(
    (state) => state.textEditor
  );
  const { fontsLoaded } = useFonts();

  // Find the selected layer and ensure it's an image layer
  const selectedLayer = layers.find(
    (layer): layer is ImageLayer =>
      layer.id === selectedLayerId && layer.type == "image"
  );

  const [width, setWidth] = useState(selectedLayer?.width);
  const [height, setHeight] = useState(selectedLayer?.height);

  useEffect(() => {
    if (selectedLayer && selectedLayer.type == "image") {
      setWidth(selectedLayer.width);
      setHeight(selectedLayer.height);
    }
  }, [selectedLayer]);

  if (!frameSettings || !selectedLayer) return null;

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

  return (
    <aside className="w-[300px] border-r border-border bg-card p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex space-x-2 items-end">
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
              <Label className="text-xs" htmlFor="width">
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
    </aside>
  );
}
