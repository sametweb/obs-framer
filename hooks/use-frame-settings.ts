import { FrameSettings } from "@/app/frame/constants";
import {
  deleteFrame,
  saveFrame,
  selectCurrentFrameSettings,
  selectFrameSettings,
  selectFrames,
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
  const frames = useAppSelector(selectFrames);
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

  const saveFrameHandler = (frame: FrameSettings) => {
    dispatch(saveFrame(frame));
  };

  const deleteFrameHandler = (id: string) => {
    dispatch(deleteFrame(id));
  };

  return {
    frameSettings,
    currentFrameSettings,
    frames,
    updateFrameSettings: updateFrameSettingsHandler,
    updateCurrentFrameSettings: updateCurrentFrameSettingsHandler,
    saveFrame: saveFrameHandler,
    deleteFrame: deleteFrameHandler,
    isDefaultSettings,
    isCurrentFrameSettingsSaved,
  };
}
