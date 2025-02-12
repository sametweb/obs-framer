import { FrameSettings } from "@/app/frame/constants";
import {
  deleteFrame,
  saveFrame,
  selectFrameSettings,
  selectFrames,
  selectIsDefaultSettings,
  selectIsSaved,
  updateFrameSettings,
} from "@/lib/store/frameSettingsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

export function useFrameSettings() {
  const dispatch = useAppDispatch();
  const frameSettings = useAppSelector(selectFrameSettings);
  const frames = useAppSelector(selectFrames);
  const isDefaultSettings = useAppSelector(selectIsDefaultSettings);
  const isSaved = useAppSelector(selectIsSaved);

  const updateFrameSettingsHandler = (
    partialSettings: Partial<FrameSettings>
  ) => {
    dispatch(updateFrameSettings(partialSettings));
  };

  const saveFrameHandler = (frame: FrameSettings) => {
    dispatch(saveFrame(frame));
  };

  const deleteFrameHandler = (id: string) => {
    dispatch(deleteFrame(id));
  };

  return {
    frameSettings,
    frames,
    updateFrameSettings: updateFrameSettingsHandler,
    saveFrame: saveFrameHandler,
    deleteFrame: deleteFrameHandler,
    isDefaultSettings,
    isSaved,
  };
}
