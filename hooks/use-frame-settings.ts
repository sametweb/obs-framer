import { FrameSettings } from "@/app/frame/constants";
import {
  selectCurrentFrameSettings,
  selectFrameSettings,
  selectIsCurrentFrameSettingsSaved,
  selectIsDefaultSettings,
  updateCurrentFrameSettings,
  updateFrameSettings,
} from "@/lib/store/frameSettingsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

export function useFrameSettings() {
  const dispatch = useAppDispatch();
  const frameSettings = useAppSelector(selectFrameSettings);
  const currentFrameSettings = useAppSelector(selectCurrentFrameSettings);
  const isDefaultSettings = useAppSelector(selectIsDefaultSettings);
  const isCurrentFrameSettingsSaved = useAppSelector(
    selectIsCurrentFrameSettingsSaved
  );

  const updateFrameSettingsHandler = (
    partialSettings: Partial<FrameSettings>
  ) => {
    dispatch(updateFrameSettings(partialSettings));
  };

  const updateCurrentFrameSettingsHandler = (
    partialSettings: Partial<FrameSettings>
  ) => {
    dispatch(updateCurrentFrameSettings(partialSettings));
  };

  return {
    frameSettings,
    currentFrameSettings,
    updateFrameSettings: updateFrameSettingsHandler,
    updateCurrentFrameSettings: updateCurrentFrameSettingsHandler,
    isDefaultSettings,
    isCurrentFrameSettingsSaved,
  };
}
