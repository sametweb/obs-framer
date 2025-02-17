import { LinearGradientSettings } from "@/app/editor/utils";

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
  createdAt: string;
  modifiedAt: string;
}

export interface CommonLayerProperties {
  id: string;
  type: "text" | "image";
  x: number;
  y: number;
}

export interface TextLayerProperties {
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  effects: {
    shadow: {
      enabled: boolean;
      color: string;
      blur: number;
      offsetX: number;
      offsetY: number;
    };
    outline: {
      enabled: boolean;
      color: string;
      width: number;
    };
  };
}

export interface ImageLayerProperties {
  width: number;
  height: number;
  url: string;
}

export type TextLayer = CommonLayerProperties & TextLayerProperties;

export type ImageLayer = CommonLayerProperties & ImageLayerProperties;

export type Layer = TextLayer | ImageLayer;

export interface LayerEditorState {
  layers: Layer[];
  selectedLayerId: string | null;
}

export type TextEditorAction =
  | { type: "ADD_LAYER"; payload: Layer }
  | {
      type: "UPDATE_LAYER";
      payload: { id: string; updates: Partial<Layer> };
    }
  | { type: "DELETE_LAYER"; payload: string }
  | { type: "SELECT_LAYER"; payload: string | null }
  | { type: "SET_CANVAS_SIZE"; payload: { width: number; height: number } }
  | { type: "SET_STATE"; payload: LayerEditorState }
  | { type: "UNDO" }
  | { type: "REDO" };

export interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  layerStartX: number;
  layerStartY: number;
  layerStartWidth: number;
  layerStartHeight: number;
  resizing: boolean;
  resizeHandle?: "nw" | "ne" | "sw" | "se";
  aspectRatio: number;
}
