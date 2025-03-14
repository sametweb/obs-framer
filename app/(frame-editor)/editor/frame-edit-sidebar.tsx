"use client";
import { Button } from "@/components/ui/button";
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
import { Slider } from "@/components/ui/slider";
import { useFrameEditor } from "@/hooks/use-frame-settings";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowLeftRight, Plus, Trash2 } from "lucide-react";
import {
  availableGradientStops,
  commonResolutions,
  directions,
} from "./constants";
import {
  getGradientStyle,
  GradientStop,
  LinearGradientSettings,
} from "./utils";

export default function FrameEditSidebar() {
  const { frameEditor, updateFrameEditor } = useFrameEditor();

  if (!frameEditor) {
    return null;
  }

  const {
    frameBottomWidth,
    frameCount,
    frameGradient,
    frameInnerBorderColor,
    frameInnerBorderWidth,
    frameLeftWidth,
    frameRadius,
    frameRightWidth,
    frameSpacing,
    frameTopWidth,
  } = frameEditor;

  const handleScreenSizeChange = (value: string) => {
    const selectedResolution = commonResolutions.find(
      (resolution) => resolution.name === value
    );
    if (selectedResolution) {
      updateFrameEditor({
        screenWidth: selectedResolution.width,
        screenHeight: selectedResolution.height,
      });
    }
  };

  const swapFrameLeftAndRight = () => {
    const left = frameLeftWidth;
    updateFrameEditor({
      frameLeftWidth: frameRightWidth,
      frameRightWidth: left,
    });
  };

  const swapFrameTopAndBottom = () => {
    const top = frameTopWidth;
    updateFrameEditor({
      frameTopWidth: frameBottomWidth,
      frameBottomWidth: top,
    });
  };

  const updateFrameGradientStops = (stops: GradientStop[]) => {
    updateFrameEditor({
      frameGradient: { ...frameGradient, stops },
    });
  };

  const addStop = () => {
    const newStops = [...frameGradient.stops];
    const lastOffset = newStops[newStops.length - 1]?.offset || 0;
    const newOffset = Math.min(lastOffset + 0.1, 1);
    newStops.push({ offset: newOffset, color: "#ffffff" });
    updateFrameGradientStops(newStops);
  };

  const removeStop = (index: number) => {
    const newStops = frameGradient.stops.filter((_, i) => i !== index);
    updateFrameGradientStops(newStops);
  };

  const updateStop = (index: number, updates: Partial<GradientStop>) => {
    const newStops = [...frameGradient.stops];
    newStops[index] = { ...newStops[index], ...updates };
    updateFrameGradientStops(newStops);
  };

  const onSliderValueChange = (value: number[], index: number) =>
    updateStop(index, {
      offset: value[0] / 100,
    });

  const onSliderInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) =>
    updateStop(index, {
      offset: Math.max(0, Math.min(1, Number(e.target.value) / 100)),
    });

  const handleGradientPresetChange = (presetName: string) => {
    const preset = availableGradientStops.find((g) => g.name === presetName);
    if (preset) {
      updateFrameEditor({
        frameGradient: {
          ...frameGradient,
          stops: preset.stops,
        },
      });
    }
  };

  const isSolidColor = frameGradient.stops.length === 1;

  const hasCutOut = frameCount > 0;

  const inputVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3, ease: "easeIn" },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <aside className="w-[300px] border-r bg-background">
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="p-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="frameSize">Size</Label>
              <Select onValueChange={handleScreenSizeChange} defaultValue="QHD">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent className="bg-white drop-shadow-md">
                  {commonResolutions.map((resolution) => (
                    <SelectItem key={resolution.name} value={resolution.name}>
                      {resolution.name} ({resolution.width}x{resolution.height})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cut-out count</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={frameCount}
                  onChange={(e) =>
                    updateFrameEditor({
                      frameCount: Math.max(Number(e.target.value), 0),
                    })
                  }
                  min={0}
                />
              </div>
            </div>
            <LayoutGroup>
              <AnimatePresence>
                {hasCutOut && (
                  <motion.div
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label>Border sizes</Label>
                      <div className="grid grid-cols-[1fr_32px_1fr] gap-1 items-end">
                        <div className="space-y-1">
                          <Label htmlFor="leftBorder" className="text-xs">
                            Left
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="leftBorder"
                              type="number"
                              value={frameLeftWidth}
                              onChange={(e) =>
                                updateFrameEditor({
                                  frameLeftWidth: Number(e.target.value),
                                })
                              }
                              min={0}
                            />
                          </div>
                        </div>
                        <Button
                          size="xs"
                          onClick={swapFrameLeftAndRight}
                          variant="ghost"
                          className="justify-self-center mb-1"
                        >
                          <ArrowLeftRight size={14} />
                        </Button>
                        <div className="space-y-1">
                          <Label htmlFor="rightBorder" className="text-xs">
                            Right
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="rightBorder"
                              type="number"
                              value={frameRightWidth}
                              onChange={(e) =>
                                updateFrameEditor({
                                  frameRightWidth: Number(e.target.value),
                                })
                              }
                              min={0}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="topBorder" className="text-xs">
                            Top
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="topBorder"
                              type="number"
                              value={frameTopWidth}
                              onChange={(e) =>
                                updateFrameEditor({
                                  frameTopWidth: Number(e.target.value),
                                })
                              }
                              min={0}
                            />
                          </div>
                        </div>
                        <Button
                          size="xs"
                          onClick={swapFrameTopAndBottom}
                          variant="ghost"
                          className="justify-self-center mb-1"
                        >
                          <ArrowLeftRight size={14} />
                        </Button>
                        <div className="space-y-1">
                          <Label htmlFor="bottomBorder" className="text-xs">
                            Bottom
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="bottomBorder"
                              type="number"
                              value={frameBottomWidth}
                              onChange={(e) =>
                                updateFrameEditor({
                                  frameBottomWidth: Number(e.target.value),
                                })
                              }
                              min={0}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Inner border</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={frameInnerBorderColor}
                          onChange={(e) => {
                            updateFrameEditor({
                              frameInnerBorderColor: e.target.value,
                            });
                          }}
                          className="h-8 w-8 cursor-pointer"
                        />

                        <Input
                          type="number"
                          value={frameInnerBorderWidth}
                          onChange={(e) =>
                            updateFrameEditor({
                              frameInnerBorderWidth: Number(e.target.value),
                            })
                          }
                          min={0}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Cut-out radius</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={frameRadius}
                          onChange={(e) =>
                            updateFrameEditor({
                              frameRadius: Number(e.target.value),
                            })
                          }
                          min={0}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Cut-out spacing</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={frameSpacing}
                          onChange={(e) =>
                            updateFrameEditor({
                              frameSpacing: Math.max(Number(e.target.value), 1),
                            })
                          }
                          min={1}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div layout className="space-y-4 bg-white">
                <Label>Background</Label>
                <div
                  className="h-32 rounded-lg shadow-lg"
                  style={{ background: getGradientStyle(frameGradient) }}
                />

                <div className="space-y-4">
                  <Select
                    value={frameGradient.direction}
                    onValueChange={(
                      value: LinearGradientSettings["direction"]
                    ) =>
                      updateFrameEditor({
                        frameGradient: { ...frameGradient, direction: value },
                      })
                    }
                    disabled={isSolidColor}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent className="bg-white drop-shadow-md">
                      {directions.map((direction) => (
                        <SelectItem key={direction.key} value={direction.key}>
                          {direction.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>{isSolidColor ? "Color" : "Color stops"}</Label>
                      <Button variant="outline" size="xs" onClick={addStop}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add stop
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {frameGradient.stops.map((stop, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="color"
                            value={stop.color}
                            onChange={(e) =>
                              updateStop(index, { color: e.target.value })
                            }
                            className="h-8 w-8 cursor-pointer"
                          />
                          {!isSolidColor && (
                            <>
                              <Slider
                                value={[stop.offset * 100]}
                                onValueChange={(v) =>
                                  onSliderValueChange(v, index)
                                }
                                max={100}
                                step={1}
                                className="flex-1"
                                color={stop.color}
                              />
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                value={Math.round(stop.offset * 100)}
                                onChange={(e) => onSliderInputChange(e, index)}
                                className="w-16 h-8"
                              />
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeStop(index)}
                            disabled={frameGradient.stops.length === 1}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <Label>Gradient presets</Label>
                      <Select onValueChange={handleGradientPresetChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Presets" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableGradientStops.map((preset) => (
                            <SelectItem key={preset.name} value={preset.name}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-10 h-6 rounded"
                                  style={{
                                    background: getGradientStyle({
                                      direction: frameGradient.direction,
                                      stops: preset.stops,
                                    }),
                                  }}
                                />
                                <span>{preset.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </motion.div>
            </LayoutGroup>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
