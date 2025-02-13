export interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
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

export interface ImageLayer {
  id: string;
  type: 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  url: string;
}

export type Layer = TextLayer | ImageLayer;

export interface TextEditorState {
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
  | { type: "SET_STATE"; payload: TextEditorState }
  | { type: "UNDO" }
  | { type: "REDO" };

export interface HistoryState {
  past: TextEditorState[];
  present: TextEditorState;
  future: TextEditorState[];
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
  resizeHandle?: 'nw' | 'ne' | 'sw' | 'se';
  aspectRatio: number;
}