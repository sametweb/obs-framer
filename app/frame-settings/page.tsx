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
import { useFrameSettings } from "@/contexts/FrameSettingsContext";
import localStorageService from "@/lib/localStorageService";
import { deepCompare } from "@/lib/utils";
import clsx from "clsx";
import {
  ArrowLeftRight,
  Check,
  Download,
  Edit,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import {
  FocusEventHandler,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { v4 } from "uuid";
import { commonResolutions, directions, FrameSettings } from "./constants";
import {
  getGradientStyle,
  GradientStop,
  LinearGradientSettings,
  renderCanvas,
} from "./utils";

export default function Home() {
  const { frameSettings, updateFrameSettings: updateGlobalFrameSettings } =
    useFrameSettings();
  const [currentFrameSettings, setCurrentFrameSettings] =
    useState<FrameSettings>(frameSettings);
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
    screenHeight,
    screenWidth,
    documentName,
  } = currentFrameSettings;

  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editableTitleRef = useRef<HTMLHeadingElement>(null);

  const updateFrameSettings = (newSettings: Partial<FrameSettings>) => {
    setCurrentFrameSettings((currentSettings) => ({
      ...currentSettings,
      ...newSettings,
    }));
  };

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

  const handleSaveTitle: FocusEventHandler<HTMLHeadingElement> = (e) => {
    if (editableTitleRef.current != null) {
      const newDocumentName = e.target.textContent ?? "";
      if (newDocumentName != documentName) {
        updateFrameSettings({ documentName: newDocumentName });
      } else {
        onSaveTitle();
      }
    }
  };

  const handleOnKeyDownWhenEditingTitle: KeyboardEventHandler<
    HTMLHeadingElement
  > = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSaveTitle();
      editableTitleRef.current?.blur();
    }
  };

  const onSaveTitle = () => {
    setIsEditingTitle(false);
  };

  const onEditTitle = () => {
    setIsEditingTitle(true);

    editableTitleRef.current?.focus();
    // Move cursor to the end of the text.
    const range = document.createRange();
    range.selectNodeContents(editableTitleRef.current!);
    range.collapse(false); // Collapse to the end
    const selection = window.getSelection();
    selection!.removeAllRanges();
    selection!.addRange(range);
  };

  const handleDownloadCanvas = () => {
    if (canvasRef.current !== null) {
      const dataURL = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas_image.png";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSave = () => {
    if (localStorageService.getItem<FrameSettings[]>("frames") == null) {
      localStorageService.setItem("frames", []);
    }

    if (currentFrameSettings.id.length == 0) {
      currentFrameSettings.id = v4();
    }
    updateGlobalFrameSettings(currentFrameSettings);
    localStorageService.addItemToArray("frames", currentFrameSettings);
  };

  const updateFrameGradientStops = (stops: GradientStop[]) => {
    updateFrameSettings({
      frameGradient: { ...frameGradient, stops },
    });
  };

  const addStop = () => {
    const newStops = [...currentFrameSettings.frameGradient.stops];
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
  const hasUnsavedChanges = !deepCompare(frameSettings, currentFrameSettings);

  useEffect(() => {
    renderCanvas(canvasRef, currentFrameSettings);
  }, [
    screenWidth,
    screenHeight,
    frameLeftWidth,
    frameRightWidth,
    frameBottomWidth,
    frameTopWidth,
    frameSpacing,
    frameRadius,
    frameGradient,
    frameCount,
    currentFrameSettings,
  ]);

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
                <Label>Gradient</Label>
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
                      <Label>{isSolidColor ? "Color" : "Color Stops"}</Label>
                      <Button variant="outline" size="xs" onClick={addStop}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Stop
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

      {/* Main content area */}
      <main className="flex-1 p-6 bg-background">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2 items-center">
              <h2
                ref={editableTitleRef}
                className={clsx("text-lg", "font-semibold", "p-2", {
                  "bg-red-50": isEditingTitle,
                })}
                contentEditable
                suppressContentEditableWarning
                onFocus={(_) => setIsEditingTitle(true)}
                onBlur={handleSaveTitle}
                onKeyDown={handleOnKeyDownWhenEditingTitle}
              >
                {documentName}
              </h2>
              {isEditingTitle ? (
                <Check
                  size={16}
                  onClick={onSaveTitle}
                  className="cursor-pointer"
                />
              ) : (
                <Edit
                  size={16}
                  onClick={onEditTitle}
                  className="cursor-pointer"
                />
              )}
              {currentFrameSettings.id}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
              >
                {hasUnsavedChanges ? "Save" : "Changes saved"}
                <Save className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleDownloadCanvas}>
                Download
                <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <canvas
            ref={canvasRef}
            width={screenWidth}
            height={screenHeight}
            className="max-w-full h-auto"
          />
        </div>
      </main>
    </div>
  );
}
