import { configureStore } from "@reduxjs/toolkit";
import frameEditorReducer from "./frameEditorSlice";
import layerEditorReducer from "./layerEditorSlice";

export const store = configureStore({
  reducer: {
    layerEditor: layerEditorReducer,
    frameEditor: frameEditorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
