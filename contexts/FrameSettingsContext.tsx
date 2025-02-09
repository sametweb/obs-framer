"use client";

import {
  defaultFrameSettings,
  FrameSettings,
} from "@/app/frame-settings/constants";
import { deepCompare } from "@/lib/utils";
import React, { createContext, useContext, useState } from "react";

interface FrameSettingsContextProps {
  frameSettings: FrameSettings;
  currentFrameSettings: FrameSettings;
  updateFrameSettings: (partialSettings: Partial<FrameSettings>) => void;
  updateCurrentFrameSettings: (partialSettings: Partial<FrameSettings>) => void;
  isDefaultSettings: boolean;
  isCurrentFrameSettingsSaved: boolean;
}

const FrameSettingsContext = createContext<FrameSettingsContextProps>({
  frameSettings: defaultFrameSettings,
  currentFrameSettings: defaultFrameSettings,
  updateFrameSettings: () => {},
  updateCurrentFrameSettings: () => {},
  isDefaultSettings: true,
  isCurrentFrameSettingsSaved: false,
});

interface FrameSettingsProviderProps {
  children: React.ReactNode;
}

const FrameSettingsProvider: React.FC<FrameSettingsProviderProps> = ({
  children,
}) => {
  const [frameSettings, setFrameSettings] =
    useState<FrameSettings>(defaultFrameSettings);

  const [currentFrameSettings, setCurrentFrameSettings] =
    useState<FrameSettings>(defaultFrameSettings);

  const isDefaultSettings = deepCompare(frameSettings, defaultFrameSettings);
  const isCurrentFrameSettingsSaved = deepCompare(
    frameSettings,
    currentFrameSettings
  );

  const updateFrameSettings = (partialSettings: Partial<FrameSettings>) => {
    setFrameSettings((prevSettings) => {
      const newSettings = { ...prevSettings, ...partialSettings };
      return newSettings;
    });
  };

  const updateCurrentFrameSettings = (
    partialSettings: Partial<FrameSettings>
  ) => {
    setCurrentFrameSettings((prevSettings) => {
      const newSettings = { ...prevSettings, ...partialSettings };
      return newSettings;
    });
  };

  return (
    <FrameSettingsContext.Provider
      value={{
        frameSettings,
        currentFrameSettings,
        updateFrameSettings,
        updateCurrentFrameSettings,
        isDefaultSettings,
        isCurrentFrameSettingsSaved,
      }}
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
