import { configureStore } from "@reduxjs/toolkit";
import frameSettingsReducer from "./frameSettingsSlice";
import textEditorReducer from "./textEditorSlice";

export const store = configureStore({
  reducer: {
    textEditor: textEditorReducer,
    frameSettings: frameSettingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
