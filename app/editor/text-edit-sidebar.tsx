"use client";

import Layers from "@/components/Canvas/Layers";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFonts } from "@/hooks/use-fonts";
import { useFrameEditor } from "@/hooks/use-frame-settings";
import { GOOGLE_FONTS } from "@/lib/fonts";
import { deleteLayer, updateLayer } from "@/lib/store/editorSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { TextLayer } from "@/lib/types";
import { Bold, Italic, Trash2, Underline } from "lucide-react";

export function TextEditSidebar() {
  const { frameEditor } = useFrameEditor();
  const dispatch = useAppDispatch();
  const { layers, layerEditor } = useFrameEditor();
  const { fontsLoaded } = useFonts();

  // Find the selected layer and ensure it's a text layer
  const selectedLayer = layers?.find(
    (layer): layer is TextLayer =>
      layer.id === layerEditor?.id && layer.type == "text"
  );

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

  return (
    <aside className="w-[300px] border-r bg-background">
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="p-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Layers />
            </div>

            <div className="space-y-2">
              <Label>Edit text</Label>
              <div className="flex space-x-2">
                <Input
                  value={selectedLayer.text}
                  onChange={(e) =>
                    dispatch(
                      updateLayer({
                        id: selectedLayer.id,
                        updates: { text: e.target.value },
                      })
                    )
                  }
                  placeholder="Edit text..."
                />
              </div>
            </div>

            <Tabs defaultValue="style">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="effects">Effects</TabsTrigger>
              </TabsList>

              <TabsContent value="style" className="space-y-4">
                <div className="space-y-2">
                  <Label>Font family</Label>
                  <Select
                    value={selectedLayer.fontFamily}
                    onValueChange={(value) =>
                      dispatch(
                        updateLayer({
                          id: selectedLayer.id,
                          updates: { fontFamily: value },
                        })
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select font family" />
                    </SelectTrigger>
                    <SelectContent className="bg-white drop-shadow-md">
                      {GOOGLE_FONTS.map((font) => (
                        <SelectItem
                          key={font}
                          value={font}
                          style={{ fontFamily: font }}
                        >
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Font size</Label>
                  <Input
                    type="number"
                    min={1}
                    max={200}
                    value={selectedLayer.fontSize}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (isNaN(value)) return;
                      dispatch(
                        updateLayer({
                          id: selectedLayer.id,
                          updates: {
                            fontSize: Math.max(1, Math.min(200, value)),
                          },
                        })
                      );
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp") {
                        e.preventDefault();
                        dispatch(
                          updateLayer({
                            id: selectedLayer.id,
                            updates: {
                              fontSize: Math.max(
                                1,
                                Math.min(200, selectedLayer.fontSize + 1)
                              ),
                            },
                          })
                        );
                      }
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        dispatch(
                          updateLayer({
                            id: selectedLayer.id,
                            updates: {
                              fontSize: Math.max(
                                1,
                                Math.min(200, selectedLayer.fontSize - 1)
                              ),
                            },
                          })
                        );
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex space-x-1">
                    <ColorPicker
                      value={selectedLayer.color}
                      onChange={(color) =>
                        dispatch(
                          updateLayer({
                            id: selectedLayer.id,
                            updates: { color },
                          })
                        )
                      }
                    />

                    <Button
                      variant={selectedLayer.bold ? "default" : "outline"}
                      size="icon"
                      onClick={() =>
                        dispatch(
                          updateLayer({
                            id: selectedLayer.id,
                            updates: { bold: !selectedLayer.bold },
                          })
                        )
                      }
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={selectedLayer.italic ? "default" : "outline"}
                      size="icon"
                      onClick={() =>
                        dispatch(
                          updateLayer({
                            id: selectedLayer.id,
                            updates: { italic: !selectedLayer.italic },
                          })
                        )
                      }
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={selectedLayer.underline ? "default" : "outline"}
                      size="icon"
                      onClick={() =>
                        dispatch(
                          updateLayer({
                            id: selectedLayer.id,
                            updates: {
                              underline: !selectedLayer.underline,
                            },
                          })
                        )
                      }
                    >
                      <Underline className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => dispatch(deleteLayer(selectedLayer.id))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="effects" className="space-y-4">
                <div className="space-y-4">
                  <Label>Shadow</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={selectedLayer.effects.shadow.enabled}
                        onChange={(e) =>
                          dispatch(
                            updateLayer({
                              id: selectedLayer.id,
                              updates: {
                                effects: {
                                  ...selectedLayer.effects,
                                  shadow: {
                                    ...selectedLayer.effects.shadow,
                                    enabled: e.target.checked,
                                  },
                                },
                              },
                            })
                          )
                        }
                      />
                      <Label>Enable Shadow</Label>
                    </div>
                    {selectedLayer.effects.shadow.enabled && (
                      <>
                        <div className="space-y-2">
                          <Label>Shadow Color</Label>
                          <Input
                            type="color"
                            value={selectedLayer.effects.shadow.color}
                            onChange={(e) =>
                              dispatch(
                                updateLayer({
                                  id: selectedLayer.id,
                                  updates: {
                                    effects: {
                                      ...selectedLayer.effects,
                                      shadow: {
                                        ...selectedLayer.effects.shadow,
                                        color: e.target.value,
                                      },
                                    },
                                  },
                                })
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Shadow Blur</Label>
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            value={selectedLayer.effects.shadow.blur}
                            onChange={(e) =>
                              dispatch(
                                updateLayer({
                                  id: selectedLayer.id,
                                  updates: {
                                    effects: {
                                      ...selectedLayer.effects,
                                      shadow: {
                                        ...selectedLayer.effects.shadow,
                                        blur: parseInt(e.target.value),
                                      },
                                    },
                                  },
                                })
                              )
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Outline</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={selectedLayer.effects.outline.enabled}
                        onChange={(e) =>
                          dispatch(
                            updateLayer({
                              id: selectedLayer.id,
                              updates: {
                                effects: {
                                  ...selectedLayer.effects,
                                  outline: {
                                    ...selectedLayer.effects.outline,
                                    enabled: e.target.checked,
                                  },
                                },
                              },
                            })
                          )
                        }
                      />
                      <Label>Enable Outline</Label>
                    </div>
                    {selectedLayer.effects.outline.enabled && (
                      <>
                        <div className="space-y-2">
                          <Label>Outline Color</Label>
                          <Input
                            type="color"
                            value={selectedLayer.effects.outline.color}
                            onChange={(e) =>
                              dispatch(
                                updateLayer({
                                  id: selectedLayer.id,
                                  updates: {
                                    effects: {
                                      ...selectedLayer.effects,
                                      outline: {
                                        ...selectedLayer.effects.outline,
                                        color: e.target.value,
                                      },
                                    },
                                  },
                                })
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Outline Width</Label>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={selectedLayer.effects.outline.width}
                            onChange={(e) =>
                              dispatch(
                                updateLayer({
                                  id: selectedLayer.id,
                                  updates: {
                                    effects: {
                                      ...selectedLayer.effects,
                                      outline: {
                                        ...selectedLayer.effects.outline,
                                        width: parseInt(e.target.value),
                                      },
                                    },
                                  },
                                })
                              )
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
