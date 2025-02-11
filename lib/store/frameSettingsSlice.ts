import { FrameSettings, defaultFrameSettings } from "@/app/frame/constants";
import { deepCompare } from "@/lib/utils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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
      state.frameSettings = { ...state.frameSettings, ...action.payload };
    },
    updateCurrentFrameSettings: (
      state,
      action: PayloadAction<Partial<FrameSettings>>
    ) => {
      state.currentFrameSettings = {
        ...state.currentFrameSettings,
        ...action.payload,
      };
    },
    saveFrame: (state, action: PayloadAction<FrameSettings>) => {
      const existingFrameIndex = state.frames.findIndex(
        (frame) => frame.id === action.payload.id
      );

      if (existingFrameIndex !== -1) {
        // Update existing frame
        state.frames[existingFrameIndex] = action.payload;
      } else {
        // Add new frame
        state.frames.push(action.payload);
      }

      // Update frameSettings to match the saved frame
      state.frameSettings = action.payload;
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
  saveFrame,
  deleteFrame,
} = frameSettingsSlice.actions;

export default frameSettingsSlice.reducer;
