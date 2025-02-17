import { defaultFrameSettings } from "@/app/editor/constants";
import { deepCompare } from "@/lib/utils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FrameSettings } from "../types";
import { RootState } from "./store";

interface FrameState {
  /**
   * Properties of the frame currently being edited. If this is null, that
   * means the editor should be closed.
   */
  frameSettings: FrameSettings | null;
  /**
   * All the frames available in the projects route. User can select a project
   * from this list to populate the frameSettings and start editing.
   */
  frames: FrameSettings[];
}

const initialState: FrameState = {
  frameSettings: null,
  frames: [],
};

const frameSettingsSlice = createSlice({
  name: "frameSettings",
  initialState,
  reducers: {
    updateFrameSettings: (
      state,
      action: PayloadAction<Partial<FrameSettings>>
    ) => {
      if (state.frameSettings != null) {
        state.frameSettings = {
          ...state.frameSettings,
          ...action.payload,
          modifiedAt: new Date().toISOString(),
        };
      }
    },

    saveFrame: (state, action: PayloadAction<FrameSettings>) => {
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

      // Update frameSettings to match the saved frame
      state.frameSettings = frameToSave;
    },
    deleteFrame: (state, action: PayloadAction<string>) => {
      state.frames = state.frames.filter(
        (frame) => frame.id !== action.payload
      );
    },

    openFrameEditor: (
      state,
      action: PayloadAction<FrameSettings | undefined>
    ) => {
      state.frameSettings = action.payload ?? { ...defaultFrameSettings() };
    },

    closeFrameEditor: (state) => {
      state.frameSettings = null;
    },
  },
});

export const selectFrameSettings = (state: RootState) =>
  state.frameSettings.frameSettings;

export const selectFrames = (state: RootState) => state.frameSettings.frames;

export const selectIsDefaultSettings = (state: RootState) =>
  state.frameSettings.frameSettings != null &&
  deepCompare(state.frameSettings.frameSettings, defaultFrameSettings());

export const selectIsSaved = (state: RootState) => {
  const { frameSettings, frames } = state.frameSettings;
  if (!frameSettings?.id) return false;

  const savedFrame = frames.find((frame) => frame.id === frameSettings?.id);
  return savedFrame ? deepCompare(frameSettings, savedFrame) : false;
};

export const {
  updateFrameSettings,
  saveFrame,
  deleteFrame,
  openFrameEditor,
  closeFrameEditor,
} = frameSettingsSlice.actions;

export default frameSettingsSlice.reducer;
