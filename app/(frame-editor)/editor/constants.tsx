import { FrameEditor } from "@/lib/types";
import { LinearGradientSettings } from "./utils";

// Dropdown options for the screen size setting.
export const commonResolutions = [
  { name: "HD", width: 1366, height: 768 },
  { name: "Full HD", width: 1920, height: 1080 },
  { name: "QHD", width: 2560, height: 1440 },
  { name: "4K UHD", width: 3840, height: 2160 },
  { name: "Mobile", width: 1080, height: 1920 },
];

export const defaultGradientStops = [
  { offset: 0, color: "#cc208e" },
  { offset: 1, color: "#6713d2" },
];

export const enum DirectionKey {
  TopBottom = "top-bottom",
  LeftRight = "left-right",
  Diagonal = "diagonal",
  DiagonalReverse = "diagonal-reverse",
  Radial = "radial",
}

export const directions = [
  { key: DirectionKey.TopBottom, label: "Top to Bottom" },
  { key: DirectionKey.LeftRight, label: "Left to Right" },
  { key: DirectionKey.Diagonal, label: "Diagonal" },
  { key: DirectionKey.DiagonalReverse, label: "Reverse Diagonal" },
  { key: DirectionKey.Radial, label: "Radial" },
] as const;

export const defaultFrameGradient: LinearGradientSettings = {
  direction: "diagonal",
  stops: defaultGradientStops,
};

export const defaultFrameEditor = (): FrameEditor => ({
  id: "",
  documentName: "Untitled Document",
  frameGradient: defaultFrameGradient,
  screenWidth: 2560,
  screenHeight: 1440,
  frameLeftWidth: 50,
  frameRightWidth: 50,
  frameTopWidth: 50,
  frameBottomWidth: 50,
  frameSpacing: 20,
  frameRadius: 10,
  frameCount: 0,
  frameInnerBorderWidth: 1,
  frameInnerBorderColor: "#000000",
  layers: [],
  createdAt: new Date().toISOString(),
  modifiedAt: new Date().toISOString(),
});
