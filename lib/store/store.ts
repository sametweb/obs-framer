import { configureStore } from "@reduxjs/toolkit";
import frameSettingsReducer from "./frameSettingsSlice";
import layerEditorReducer from "./layerEditorSlice";

export const store = configureStore({
  reducer: {
    layerEditor: layerEditorReducer,
    frameSettings: frameSettingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
