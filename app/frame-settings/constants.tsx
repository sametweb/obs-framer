import { LinearGradientSettings } from "./utils";

export const commonResolutions = [
  { name: "HD", width: 1366, height: 768 },
  { name: "Full HD", width: 1920, height: 1080 },
  { name: "QHD", width: 2560, height: 1440 },
  { name: "4K UHD", width: 3840, height: 2160 },
];

export const defaultGradientStops = [
  { offset: 0, color: "#c5f9d7" },
  { offset: 0.5, color: "#f7d486" },
  { offset: 1, color: "#f27a7d" },
];

export const enum DirectionKey {
  TopBottom = "top-bottom",
  LeftRight = "left-right",
  Diagonal = "diagonal",
  DiagonalReverse = "diagonal-reverse",
}

export const directions = [
  { key: DirectionKey.TopBottom, label: "Top to Bottom" },
  { key: DirectionKey.LeftRight, label: "Left to Right" },
  { key: DirectionKey.Diagonal, label: "Diagonal" },
  { key: DirectionKey.DiagonalReverse, label: "Reverse Diagonal" },
] as const;

export const defaultFrameGradient: LinearGradientSettings = {
  direction: "diagonal",
  stops: defaultGradientStops,
};

export const defaultWidth = 2560;
export const defaultHeight = 1440;
export const defaultFrameBorder = 50;
export const defaultSpace = 20;
export const defaultRadius = 10;
export const defaultFrameCount = 1;
export const frameInnerBorderWidth = 1;
export const frameInnerBorderColor = "#000000";

export interface FrameSettings {
  id: string;
  documentName: string;
  frameGradient: LinearGradientSettings;
  screenWidth: number;
  screenHeight: number;
  frameLeftWidth: number;
  frameRightWidth: number;
  frameTopWidth: number;
  frameBottomWidth: number;
  frameSpacing: number;
  frameRadius: number;
  frameCount: number;
  frameInnerBorderWidth: number;
  frameInnerBorderColor: string;
}

export const defaultFrameSettings: FrameSettings = {
  id: "",
  documentName: "Untitled Document",
  frameGradient: defaultFrameGradient,
  screenWidth: defaultWidth,
  screenHeight: defaultHeight,
  frameLeftWidth: defaultFrameBorder,
  frameRightWidth: defaultFrameBorder,
  frameTopWidth: defaultFrameBorder,
  frameBottomWidth: defaultFrameBorder,
  frameSpacing: defaultSpace,
  frameRadius: defaultRadius,
  frameCount: defaultFrameCount,
  frameInnerBorderWidth: frameInnerBorderWidth,
  frameInnerBorderColor: frameInnerBorderColor,
};
