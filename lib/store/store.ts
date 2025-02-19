import editorReducer from "@/lib/store/editorSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: editorReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
