import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { v4 } from "uuid";
import { Layer, LayerEditorState, TextLayer } from "../types";

const initialState: LayerEditorState = {
  layers: [],
  selectedLayerId: null,
};

const textEditorSlice = createSlice({
  name: "textEditor",
  initialState,
  reducers: {
    addLayer: (state, action: PayloadAction<Layer>) => {
      state.layers.push(action.payload);
      state.selectedLayerId = action.payload.id;
    },
    addNewTextLayer: (
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
      state.layers.push(newTextLayer);
      state.selectedLayerId = newTextLayer.id;
    },
    updateLayer: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Layer> }>
    ) => {
      const layer = state.layers.find((l) => l.id === action.payload.id);
      if (layer) {
        Object.assign(layer, action.payload.updates);
      }
    },
    deleteLayer: (state, action: PayloadAction<string>) => {
      state.layers = state.layers.filter(
        (layer) => layer.id !== action.payload
      );
      if (state.selectedLayerId === action.payload) {
        state.selectedLayerId = null;
      }
    },
    selectLayer: (state, action: PayloadAction<string | null>) => {
      state.selectedLayerId = action.payload;
    },
    setState: (state, action: PayloadAction<LayerEditorState>) => {
      return action.payload;
    },
    moveLayer: (
      state,
      action: PayloadAction<{ id: string; direction: "up" | "down" }>
    ) => {
      const { id, direction } = action.payload;
      const index = state.layers.findIndex((layer) => layer.id === id);
      if (index === -1) return;

      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= state.layers.length) return;

      // Swap layers
      const temp = state.layers[index];
      state.layers[index] = state.layers[newIndex];
      state.layers[newIndex] = temp;
    },
  },
});

export const {
  addLayer,
  addNewTextLayer,
  updateLayer,
  deleteLayer,
  selectLayer,
  setState,
  moveLayer,
} = textEditorSlice.actions;

export default textEditorSlice.reducer;
