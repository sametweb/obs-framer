"use client";

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
import { useAppDispatch } from "@/lib/store/hooks";
import {
  addLayer,
  deleteLayer,
  moveLayer,
  selectLayer,
  updateLayer,
} from "@/lib/store/layerEditorSlice";
import { Layer, TextLayer } from "@/lib/types";
import {
  Bold,
  ChevronDown,
  ChevronUp,
  Italic,
  Trash2,
  Underline,
} from "lucide-react";
import { useState } from "react";
import { v4 } from "uuid";

export function TextEditSidebar() {
  const { frameEditor } = useFrameEditor();
  const dispatch = useAppDispatch();
  const { layers, layerEditor } = useFrameEditor();
  const [newText, setNewText] = useState("");
  const { fontsLoaded } = useFonts();

  // Find the selected layer and ensure it's a text layer
  const selectedLayer = layers?.find(
    (layer): layer is TextLayer =>
      layer.id === layerEditor?.id && layer.type == "text"
  );

  if (!frameEditor) return null;

  const handleAddLayer = () => {
    if (!newText.trim()) return;

    const { screenWidth, screenHeight } = frameEditor;

    dispatch(
      addLayer({
        id: v4(),
        type: "text",
        text: newText,
        x: screenWidth / 2,
        y: screenHeight / 2,
        fontSize: 32,
        fontFamily: "Inter",
        color: "#000000",
        bold: false,
        italic: false,
        underline: false,
        effects: {
          shadow: {
            enabled: false,
            color: "#000000",
            blur: 4,
            offsetX: 2,
            offsetY: 2,
          },
          outline: {
            enabled: false,
            color: "#000000",
            width: 2,
          },
        },
      })
    );
    setNewText("");
  };

  const handleMoveLayer = (id: string, direction: "up" | "down") => {
    dispatch(moveLayer({ id, direction }));
  };

  if (!fontsLoaded) {
    return (
      <aside className="w-[300px] border-r border-border bg-card p-6">
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading fonts...</p>
        </div>
      </aside>
    );
  }

  // Create a reversed copy of the layers array for display
  const displayLayers = [...(layers ?? [])].reverse();

  const getLayerName = (layer: Layer) => {
    if (layer.hasOwnProperty("text")) {
      return (layer as TextLayer).text;
    }
    return layer.id;
  };

  return (
    <aside className="w-[300px] border-r bg-background">
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="p-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Add new text</Label>
              <div className="flex space-x-2">
                <Input
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Enter text..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddLayer();
                    }
                  }}
                />
                <Button onClick={handleAddLayer} disabled={!newText}>
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Text Layers</Label>
              <ScrollArea className="h-[200px] border rounded-md p-2">
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
            </div>

            {selectedLayer && (
              <>
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
                          variant={
                            selectedLayer.underline ? "default" : "outline"
                          }
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
                          onClick={() =>
                            dispatch(deleteLayer(selectedLayer.id))
                          }
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
              </>
            )}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
