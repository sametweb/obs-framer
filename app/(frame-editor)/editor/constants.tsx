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

export const availableGradientStops = [
  {
    name: "Sunset Serenity",
    stops: [
      { offset: 0, color: "#ff5e62" },
      { offset: 1, color: "#ff9966" },
    ],
  },
  {
    name: "Ocean Breeze",
    stops: [
      { offset: 0, color: "#3494e6" },
      { offset: 1, color: "#ec6ead" },
    ],
  },
  {
    name: "Mystic Purple",
    stops: [
      { offset: 0, color: "#7f00ff" },
      { offset: 1, color: "#e100ff" },
    ],
  },
  {
    name: "Fresh Mint",
    stops: [
      { offset: 0, color: "#45b649" },
      { offset: 1, color: "#a8e063" },
    ],
  },
  {
    name: "Golden Hour",
    stops: [
      { offset: 0, color: "#f7971e" },
      { offset: 1, color: "#ffd200" },
    ],
  },
  {
    name: "Aqua Splash",
    stops: [
      { offset: 0, color: "#13547a" },
      { offset: 1, color: "#80d0c7" },
    ],
  },
  {
    name: "Berry Smoothie",
    stops: [
      { offset: 0, color: "#da4453" },
      { offset: 1, color: "#89216b" },
    ],
  },
  {
    name: "Forest Canopy",
    stops: [
      { offset: 0, color: "#43a047" },
      { offset: 1, color: "#1b5e20" },
    ],
  },
  {
    name: "Twilight Sparkle",
    stops: [
      { offset: 0, color: "#2c3e50" },
      { offset: 1, color: "#3498db" },
    ],
  },
  {
    name: "Vibrant Bloom",
    stops: [
      { offset: 0, color: "#f45c43" },
      { offset: 1, color: "#eb3349" },
    ],
  },
  {
    name: "Tropical Fusion",
    stops: [
      { offset: 0, color: "#d4fc79" },
      { offset: 0.5, color: "#96e6a1" },
      { offset: 1, color: "#33ab9f" },
    ],
  },
  {
    name: "Aurora Borealis",
    stops: [
      { offset: 0, color: "#00c6fb" },
      { offset: 0.5, color: "#005bea" },
      { offset: 1, color: "#a4508b" },
    ],
  },
  {
    name: "Peach Melba",
    stops: [
      { offset: 0, color: "#ffb347" },
      { offset: 0.5, color: "#ffcc33" },
      { offset: 1, color: "#f54ea2" },
    ],
  },
  {
    name: "Electric Violet",
    stops: [
      { offset: 0, color: "#4776e6" },
      { offset: 1, color: "#8e54e9" },
    ],
  },
  {
    name: "Lime Soda",
    stops: [
      { offset: 0, color: "#c3e88d" },
      { offset: 1, color: "#7ec458" },
    ],
  },
  {
    name: "Soft Pastel",
    stops: [
      { offset: 0, color: "#f9d423" },
      { offset: 0.5, color: "#ff4e50" },
      { offset: 1, color: "#f9d4ff" },
    ],
  },
  {
    name: "Deep Sea",
    stops: [
      { offset: 0, color: "#232526" },
      { offset: 1, color: "#414345" },
    ],
  },
  {
    name: "Candy Pop",
    stops: [
      { offset: 0, color: "#ff9a9e" },
      { offset: 0.5, color: "#fecfef" },
      { offset: 1, color: "#fad0c4" },
    ],
  },
  {
    name: "Blue Raspberry",
    stops: [
      { offset: 0, color: "#00b4db" },
      { offset: 1, color: "#0083b0" },
    ],
  },
  {
    name: "Sunset Horizon",
    stops: [
      { offset: 0, color: "#fe8c00" },
      { offset: 0.5, color: "#f83600" },
      { offset: 1, color: "#fe8c00" },
    ],
  },
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
