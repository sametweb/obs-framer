import { configureStore } from '@reduxjs/toolkit';
import textEditorReducer from './textEditorSlice';

export const store = configureStore({
  reducer: {
    textEditor: textEditorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;