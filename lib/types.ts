import { LinearGradientSettings } from "@/app/editor/utils";

/**
 * Represents the state of the editor, including the collection of frame editors,
 * the currently active frame editor, and the currently active layer editor.
 *
 * @property frames - An array of frame editors that are present in the editor state.
 * @property frameEditor - The currently active frame editor, or null if none is selected.
 * @property layerEditor - The currently active layer editor, or null if none is selected.
 */
export interface EditorState {
  frames: FrameEditor[];
  frameEditor: FrameEditor | null;
  layerEditor: Layer | null;
}

export interface FrameEditor {
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
  layers: Layer[];
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
