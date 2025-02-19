import { defaultFrameEditor } from "@/app/editor/constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 } from "uuid";
import { EditorState, FrameEditor, Layer, TextLayer } from "../types";
import { deepCompare } from "../utils";
import { RootState } from "./store";

const initialState: EditorState = {
  frameEditor: null,
  layerEditor: null,
  frames: [],
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    updateFrameEditor: (state, action: PayloadAction<Partial<FrameEditor>>) => {
      if (state.frameEditor != null) {
        state.frameEditor = {
          ...state.frameEditor,
          ...action.payload,
          modifiedAt: new Date().toISOString(),
        };
      }
    },

    saveFrame: (state, action: PayloadAction<FrameEditor>) => {
      const now = new Date().toISOString();
      const frameToSave = {
        ...action.payload,
        modifiedAt: now,
      };

      const existingFrameIndex = state.frames.findIndex(
        (frame) => frame.id === action.payload.id
      );

      if (existingFrameIndex !== -1) {
        state.frames[existingFrameIndex] = frameToSave;
      } else {
        frameToSave.createdAt = now;
        state.frames.push(frameToSave);
      }

      state.frameEditor = frameToSave;
    },
    deleteFrame: (state, action: PayloadAction<string>) => {
      state.frames = state.frames.filter(
        (frame) => frame.id !== action.payload
      );
    },

    openFrameEditor: (
      state,
      action: PayloadAction<FrameEditor | undefined>
    ) => {
      state.frameEditor = action.payload ?? { ...defaultFrameEditor() };
      state.layerEditor = null;
    },

    closeFrameEditor: (state) => {
      state.frameEditor = null;
      state.layerEditor = null;
    },
    addLayer: (state, action: PayloadAction<Layer>) => {
      state.frameEditor?.layers.push(action.payload);
      state.layerEditor = action.payload;
    },
    addTextLayer: (
      state,
      action: PayloadAction<{ text: string; width: number; height: number }>
    ) => {
      const newTextLayer = {
        id: v4(),
        type: "text" as TextLayer["type"],
        text: action.payload.text,
        x: action.payload.width / 2,
        y: action.payload.height / 2,
        fontSize: 32,
        fontFamily: "Inter",
        color: "#000000",
        bold: false,
        italic: false,
        underline: false,
        effects: {
          shadow: {
            enabled: false,
            color: "#000000",
            blur: 4,
            offsetX: 2,
            offsetY: 2,
          },
          outline: {
            enabled: false,
            color: "#000000",
            width: 2,
          },
        },
      };
      state.frameEditor?.layers.push(newTextLayer);
      state.layerEditor = newTextLayer;
    },
    updateLayer: (
      state,
      action: PayloadAction<{ id: string | undefined; updates: Partial<Layer> }>
    ) => {
      if (action.payload.id == null) return;
      const layer = state.frameEditor?.layers.find(
        (l) => l.id === action.payload.id
      );
      if (layer) {
        Object.assign(layer, action.payload.updates);
      }
    },
    deleteLayer: (state, action: PayloadAction<string>) => {
      if (!state.frameEditor) return;
      state.frameEditor.layers = state.frameEditor.layers.filter(
        (layer) => layer.id !== action.payload
      );
      if (state.frameEditor.id === action.payload) {
        state.frameEditor = null;
      }
    },
    selectLayer: (state, action: PayloadAction<string | null>) => {
      if (action.payload == null) {
        state.layerEditor = null;
        return;
      }
      state.layerEditor =
        state.frameEditor?.layers.find(
          (layer) => layer.id === action.payload
        ) ?? null;
    },
    moveLayer: (
      state,
      action: PayloadAction<{ id: string; direction: "up" | "down" }>
    ) => {
      const { id, direction } = action.payload;
      const index = state.frameEditor?.layers.findIndex(
        (layer) => layer.id === id
      );
      if (index === undefined || index === -1) return;

      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (
        !state.frameEditor ||
        newIndex < 0 ||
        newIndex >= state.frameEditor.layers.length
      )
        return;

      // Swap layers
      const temp = state.frameEditor.layers[index];
      state.frameEditor.layers[index] = state.frameEditor.layers[newIndex];
      state.frameEditor.layers[newIndex] = temp;
    },
  },
});

export const selectFrameEditor = (state: RootState) => state.frameEditor;

export const selectLayerEditor = (state: RootState) => state.layerEditor;

export const selectFrames = (state: RootState) => state.frames;

export const selectLayers = (state: RootState) => state.frameEditor?.layers;

export const selectIsDefaultSettings = (state: RootState) =>
  state.frameEditor != null &&
  deepCompare(state.frameEditor, defaultFrameEditor());

export const selectIsSaved = (state: RootState) => {
  const { frameEditor, frames } = state;
  if (!frameEditor?.id) return false;

  const savedFrame = frames.find((frame) => frame.id === frameEditor?.id);
  return savedFrame ? deepCompare(frameEditor, savedFrame) : false;
};

export const {
  updateFrameEditor,
  saveFrame,
  deleteFrame,
  openFrameEditor,
  closeFrameEditor,
  addLayer,
  addTextLayer,
  updateLayer,
  deleteLayer,
  selectLayer,
  moveLayer,
} = editorSlice.actions;

export default editorSlice.reducer;
