import { LinearGradientSettings } from "@/app/editor/utils";

export interface FrameEditorState {
  /**
   * Properties of the frame currently being edited. If this is null, that
   * means the editor should be closed.
   */
  frameEditor: FrameEditor | null;
  /**
   * All the frames available in the projects route. User can select a project
   * from this list to populate the frameEditor and start editing.
   */
  frames: FrameEditor[];
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
