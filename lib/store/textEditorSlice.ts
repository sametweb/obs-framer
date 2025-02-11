import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TextEditorState, TextLayer } from '../types';

const initialState: TextEditorState = {
  layers: [],
  selectedLayerId: null,
};

const textEditorSlice = createSlice({
  name: 'textEditor',
  initialState,
  reducers: {
    addLayer: (state, action: PayloadAction<TextLayer>) => {
      state.layers.push(action.payload);
      state.selectedLayerId = action.payload.id;
    },
    updateLayer: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<TextLayer> }>
    ) => {
      const layer = state.layers.find((l) => l.id === action.payload.id);
      if (layer) {
        Object.assign(layer, action.payload.updates);
      }
    },
    deleteLayer: (state, action: PayloadAction<string>) => {
      state.layers = state.layers.filter((layer) => layer.id !== action.payload);
      if (state.selectedLayerId === action.payload) {
        state.selectedLayerId = null;
      }
    },
    selectLayer: (state, action: PayloadAction<string | null>) => {
      state.selectedLayerId = action.payload;
    },
    setState: (state, action: PayloadAction<TextEditorState>) => {
      return action.payload;
    },
  },
});

export const { addLayer, updateLayer, deleteLayer, selectLayer, setState } =
  textEditorSlice.actions;

export default textEditorSlice.reducer;