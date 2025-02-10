"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFrameSettings } from "@/contexts/FrameSettingsContext";
import { useTextEditor } from "@/contexts/TextEditorContext";
import { useFonts } from "@/hooks/use-fonts";
import { GOOGLE_FONTS } from "@/lib/fonts";
import {
  Bold,
  Italic,
  Redo2,
  Trash2,
  Type,
  Underline,
  Undo2,
} from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const {
    currentFrameSettings: { screenWidth, screenHeight },
  } = useFrameSettings();
  const { state, dispatch, undo, redo, canUndo, canRedo } = useTextEditor();
  const [newText, setNewText] = useState("");
  const { fontsLoaded } = useFonts();

  const selectedLayer = state.layers.find(
    (layer) => layer.id === state.selectedLayerId
  );

  const handleAddLayer = () => {
    if (!newText.trim()) return;

    dispatch({
      type: "ADD_LAYER",
      payload: {
        id: crypto.randomUUID(),
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
      },
    });
    setNewText("");
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

  return (
    <aside className="w-[300px] border-r border-border bg-card p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Add New Text</Label>
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
            <Button onClick={handleAddLayer}>
              <Type className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={undo}
            disabled={!canUndo}
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={redo}
            disabled={!canRedo}
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>

        {selectedLayer && (
          <>
            <div className="space-y-2">
              <Label>Edit Text</Label>
              <div className="flex space-x-2">
                <Input
                  value={selectedLayer.text}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_LAYER",
                      payload: {
                        id: selectedLayer.id,
                        updates: { text: e.target.value },
                      },
                    })
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
                      dispatch({
                        type: "UPDATE_LAYER",
                        payload: {
                          id: selectedLayer.id,
                          updates: { fontFamily: value },
                        },
                      })
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
                  <Label>Font Size</Label>
                  <Input
                    type="number"
                    min={1}
                    max={200}
                    value={selectedLayer.fontSize}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      dispatch({
                        type: "UPDATE_LAYER",
                        payload: {
                          id: selectedLayer.id,
                          updates: {
                            fontSize: Math.max(1, Math.min(200, value)),
                          },
                        },
                      });
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input
                    type="color"
                    value={selectedLayer.color}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_LAYER",
                        payload: {
                          id: selectedLayer.id,
                          updates: { color: e.target.value },
                        },
                      })
                    }
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant={selectedLayer.bold ? "default" : "outline"}
                    size="icon"
                    onClick={() =>
                      dispatch({
                        type: "UPDATE_LAYER",
                        payload: {
                          id: selectedLayer.id,
                          updates: { bold: !selectedLayer.bold },
                        },
                      })
                    }
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={selectedLayer.italic ? "default" : "outline"}
                    size="icon"
                    onClick={() =>
                      dispatch({
                        type: "UPDATE_LAYER",
                        payload: {
                          id: selectedLayer.id,
                          updates: { italic: !selectedLayer.italic },
                        },
                      })
                    }
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={selectedLayer.underline ? "default" : "outline"}
                    size="icon"
                    onClick={() =>
                      dispatch({
                        type: "UPDATE_LAYER",
                        payload: {
                          id: selectedLayer.id,
                          updates: { underline: !selectedLayer.underline },
                        },
                      })
                    }
                  >
                    <Underline className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() =>
                      dispatch({
                        type: "DELETE_LAYER",
                        payload: selectedLayer.id,
                      })
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
                          dispatch({
                            type: "UPDATE_LAYER",
                            payload: {
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
                            },
                          })
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
                              dispatch({
                                type: "UPDATE_LAYER",
                                payload: {
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
                                },
                              })
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
                              dispatch({
                                type: "UPDATE_LAYER",
                                payload: {
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
                                },
                              })
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
                          dispatch({
                            type: "UPDATE_LAYER",
                            payload: {
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
                            },
                          })
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
                              dispatch({
                                type: "UPDATE_LAYER",
                                payload: {
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
                                },
                              })
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
                              dispatch({
                                type: "UPDATE_LAYER",
                                payload: {
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
                                },
                              })
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
    </aside>
  );
}
