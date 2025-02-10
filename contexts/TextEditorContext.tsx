"use client";

import type {
  HistoryState,
  TextEditorAction,
  TextEditorState,
} from "@/lib/types";
import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";

const initialState: TextEditorState = {
  layers: [],
  selectedLayerId: null,
};

const initialHistory: HistoryState = {
  past: [],
  present: initialState,
  future: [],
};

function textEditorReducer(
  state: TextEditorState,
  action: TextEditorAction
): TextEditorState {
  switch (action.type) {
    case "ADD_LAYER":
      return {
        ...state,
        layers: [...state.layers, action.payload],
        selectedLayerId: action.payload.id,
      };
    case "UPDATE_LAYER":
      return {
        ...state,
        layers: state.layers.map((layer) =>
          layer.id === action.payload.id
            ? { ...layer, ...action.payload.updates }
            : layer
        ),
      };
    case "DELETE_LAYER":
      return {
        ...state,
        layers: state.layers.filter((layer) => layer.id !== action.payload),
        selectedLayerId:
          state.selectedLayerId === action.payload
            ? null
            : state.selectedLayerId,
      };
    case "SELECT_LAYER":
      return {
        ...state,
        selectedLayerId: action.payload,
      };
    case "SET_STATE":
      return action.payload;
    default:
      return state;
  }
}

function historyReducer(
  state: HistoryState,
  action: TextEditorAction
): HistoryState {
  if (action.type === "UNDO") {
    const [newPresent, ...newPast] = [...state.past].reverse();
    if (!newPresent) return state;

    return {
      past: newPast.reverse(),
      present: newPresent,
      future: [state.present, ...state.future],
    };
  }

  if (action.type === "REDO") {
    const [newPresent, ...newFuture] = state.future;
    if (!newPresent) return state;

    return {
      past: [...state.past, state.present],
      present: newPresent,
      future: newFuture,
    };
  }

  const newPresent = textEditorReducer(state.present, action);

  if (newPresent === state.present) {
    return state;
  }

  return {
    past: [...state.past, state.present],
    present: newPresent,
    future: [],
  };
}

interface TextEditorContextType {
  state: TextEditorState;
  dispatch: React.Dispatch<TextEditorAction>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const TextEditorContext = createContext<TextEditorContextType | null>(null);

export function TextEditorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ past, present, future }, dispatch] = useReducer(
    historyReducer,
    initialHistory
  );

  const undo = useCallback(() => {
    if (past.length === 0) return;
    dispatch({ type: "UNDO" });
  }, [past]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    dispatch({ type: "REDO" });
  }, [future]);

  const value = {
    state: present,
    dispatch,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };

  return (
    <TextEditorContext.Provider value={value}>
      {children}
    </TextEditorContext.Provider>
  );
}

export function useTextEditor() {
  const context = useContext(TextEditorContext);
  if (!context) {
    throw new Error("useTextEditor must be used within a TextEditorProvider");
  }
  return context;
}
