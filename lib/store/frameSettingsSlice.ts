import { FrameSettings, defaultFrameSettings } from "@/app/frame/constants";
import { deepCompare } from "@/lib/utils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface FrameSettingsState {
  frameSettings: FrameSettings;
  currentFrameSettings: FrameSettings;
}

const initialState: FrameSettingsState = {
  frameSettings: defaultFrameSettings,
  currentFrameSettings: defaultFrameSettings,
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
  },
});

// Selectors
export const selectFrameSettings = (state: {
  frameSettings: FrameSettingsState;
}) => state.frameSettings.frameSettings;
export const selectCurrentFrameSettings = (state: {
  frameSettings: FrameSettingsState;
}) => state.frameSettings.currentFrameSettings;
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

export const { updateFrameSettings, updateCurrentFrameSettings } =
  frameSettingsSlice.actions;
export default frameSettingsSlice.reducer;
