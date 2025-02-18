import { defaultFrameEditor } from "@/app/editor/constants";
import { deepCompare } from "@/lib/utils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FrameEditor, FrameEditorState } from "../types";
import { RootState } from "./store";

const initialState: FrameEditorState = {
  frameEditor: null,
  frames: [],
};

const frameEditorSlice = createSlice({
  name: "frameEditor",
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
        // Update existing frame
        state.frames[existingFrameIndex] = frameToSave;
      } else {
        // Add new frame with creation timestamp
        frameToSave.createdAt = now;
        state.frames.push(frameToSave);
      }

      // Update frameEditor to match the saved frame
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
    },

    closeFrameEditor: (state) => {
      state.frameEditor = null;
    },
  },
});

export const selectFrameEditor = (state: RootState) =>
  state.frameEditor.frameEditor;

export const selectFrames = (state: RootState) => state.frameEditor.frames;

export const selectIsDefaultSettings = (state: RootState) =>
  state.frameEditor.frameEditor != null &&
  deepCompare(state.frameEditor.frameEditor, defaultFrameEditor());

export const selectIsSaved = (state: RootState) => {
  const { frameEditor, frames } = state.frameEditor;
  const { layers, selectedLayerId } = state.layerEditor;
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
} = frameEditorSlice.actions;

export default frameEditorSlice.reducer;
