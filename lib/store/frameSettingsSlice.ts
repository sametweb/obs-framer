import { FrameSettings, defaultFrameSettings } from "@/app/frame/constants";
import { deepCompare } from "@/lib/utils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TextLayer } from "../types";

interface FrameSettingsState {
  frameSettings: FrameSettings;
  currentFrameSettings: FrameSettings;
  frames: FrameSettings[];
}

const initialState: FrameSettingsState = {
  frameSettings: defaultFrameSettings,
  currentFrameSettings: defaultFrameSettings,
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
      state.frameSettings = {
        ...state.frameSettings,
        ...action.payload,
        modifiedAt: new Date().toISOString(),
      };
    },
    updateCurrentFrameSettings: (
      state,
      action: PayloadAction<Partial<FrameSettings>>
    ) => {
      state.currentFrameSettings = {
        ...state.currentFrameSettings,
        ...action.payload,
        modifiedAt: new Date().toISOString(),
      };
    },
    updateTextLayers: (state, action: PayloadAction<TextLayer[]>) => {
      state.currentFrameSettings.textLayers = action.payload;
      state.currentFrameSettings.modifiedAt = new Date().toISOString();
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
  },
});

// Selectors
export const selectFrameSettings = (state: {
  frameSettings: FrameSettingsState;
}) => state.frameSettings.frameSettings;

export const selectCurrentFrameSettings = (state: {
  frameSettings: FrameSettingsState;
}) => state.frameSettings.currentFrameSettings;

export const selectFrames = (state: { frameSettings: FrameSettingsState }) =>
  state.frameSettings.frames;

export const selectIsDefaultSettings = (state: {
  frameSettings: FrameSettingsState;
}) => deepCompare(state.frameSettings.frameSettings, defaultFrameSettings);

export const selectIsCurrentFrameSettingsSaved = (state: {
  frameSettings: FrameSettingsState;
}) =>
  deepCompare(
    state.frameSettings.frameSettings,
    state.frameSettings.currentFrameSettings
  );

export const {
  updateFrameSettings,
  updateCurrentFrameSettings,
  updateTextLayers,
  saveFrame,
  deleteFrame,
} = frameSettingsSlice.actions;

export default frameSettingsSlice.reducer;
