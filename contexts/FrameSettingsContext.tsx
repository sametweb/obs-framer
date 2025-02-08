"use client";

import {
  defaultFrameSettings,
  FrameSettings,
} from "@/app/frame-settings/constants";
import { deepCompare } from "@/lib/utils";
import React, { createContext, useContext, useState } from "react";

interface FrameSettingsContextProps {
  frameSettings: FrameSettings;
  updateFrameSettings: (partialSettings: Partial<FrameSettings>) => void;
  isDefaultSettings: boolean;
}

const FrameSettingsContext = createContext<FrameSettingsContextProps>({
  frameSettings: defaultFrameSettings,
  updateFrameSettings: () => {},
  isDefaultSettings: true,
});

interface FrameSettingsProviderProps {
  children: React.ReactNode;
}

const FrameSettingsProvider: React.FC<FrameSettingsProviderProps> = ({
  children,
}) => {
  const [frameSettings, setFrameSettings] =
    useState<FrameSettings>(defaultFrameSettings);

  const _isDefaultSettings = (settings: FrameSettings): boolean => {
    return deepCompare(settings, defaultFrameSettings);
  };

  const isDefaultSettings = _isDefaultSettings(frameSettings);

  const updateFrameSettings = (partialSettings: Partial<FrameSettings>) => {
    setFrameSettings((prevSettings) => {
      const newSettings = { ...prevSettings, ...partialSettings };
      return newSettings;
    });
  };

  return (
    <FrameSettingsContext.Provider
      value={{ frameSettings, updateFrameSettings, isDefaultSettings }}
    >
      {children}
    </FrameSettingsContext.Provider>
  );
};

const useFrameSettings = () => {
  const context = useContext(FrameSettingsContext);
  if (!context) {
    throw new Error(
      "useFrameSettings must be used within a FrameSettingsProvider"
    );
  }
  return context;
};

export { FrameSettingsProvider, useFrameSettings };
export type { FrameSettings };
