"use client";
import Preview from "@/components/Canvas/Preview";
import { projectsRoute } from "@/components/Navigation/routes";
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
import { useFrameSettings } from "@/hooks/use-frame-settings";
import { ArrowLeftRight, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { commonResolutions, directions } from "./constants";
import {
  getGradientStyle,
  GradientStop,
  LinearGradientSettings,
} from "./utils";

export default function Home() {
  const { frameSettings, updateFrameSettings } = useFrameSettings();
  const router = useRouter();

  useEffect(() => {
    if (!frameSettings) {
      router.push(projectsRoute.path);
    }
  }, [frameSettings, router]);

  if (!frameSettings) {
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
  } = frameSettings;

  const swapFrameLeftAndRight = () => {
    const left = frameLeftWidth;
    updateFrameSettings({
      frameLeftWidth: frameRightWidth,
      frameRightWidth: left,
    });
  };

  const swapFrameTopAndBottom = () => {
    const top = frameTopWidth;
    updateFrameSettings({
      frameTopWidth: frameBottomWidth,
      frameBottomWidth: top,
    });
  };

  const handleScreenSizeChange = (value: string) => {
    const selectedResolution = commonResolutions.find(
      (resolution) => resolution.name === value
    );
    if (selectedResolution) {
      updateFrameSettings({
        screenWidth: selectedResolution.width,
        screenHeight: selectedResolution.height,
      });
    }
  };

  const updateFrameGradientStops = (stops: GradientStop[]) => {
    updateFrameSettings({
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

  const isSolidColor = frameGradient.stops.length === 1;

  return (
    <div className="flex h-screen">
      {/* Fixed width sidebar */}
      <aside className="w-[300px] border-r bg-background">
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-6">Frame settings</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="frameSize">Screen size</Label>
                <Select
                  onValueChange={handleScreenSizeChange}
                  defaultValue="QHD"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent className="bg-white drop-shadow-md">
                    {commonResolutions.map((resolution) => (
                      <SelectItem key={resolution.name} value={resolution.name}>
                        {resolution.name} ({resolution.width}x
                        {resolution.height})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Frame borders</Label>
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
                          updateFrameSettings({
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
                          updateFrameSettings({
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
                          updateFrameSettings({
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
                          updateFrameSettings({
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
                <Label>Frame inner border</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={frameInnerBorderColor}
                    onChange={(e) => {
                      updateFrameSettings({
                        frameInnerBorderColor: e.target.value,
                      });
                    }}
                    className="h-8 w-8 cursor-pointer"
                  />

                  <Input
                    type="number"
                    value={frameInnerBorderWidth}
                    onChange={(e) =>
                      updateFrameSettings({
                        frameInnerBorderWidth: Number(e.target.value),
                      })
                    }
                    min={0}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Frame radius</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={frameRadius}
                    onChange={(e) =>
                      updateFrameSettings({
                        frameRadius: Number(e.target.value),
                      })
                    }
                    min={0}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Frame count</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={frameCount}
                    onChange={(e) =>
                      updateFrameSettings({
                        frameCount: Math.max(Number(e.target.value), 1),
                      })
                    }
                    min={1}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Frame spacing</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={frameSpacing}
                    onChange={(e) =>
                      updateFrameSettings({
                        frameSpacing: Math.max(Number(e.target.value), 1),
                      })
                    }
                    min={1}
                  />
                </div>
              </div>

              <div className="space-y-4">
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
                      updateFrameSettings({
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>
      <Preview />
    </div>
  );
}
