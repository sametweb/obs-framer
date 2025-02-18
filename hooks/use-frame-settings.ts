import {
  deleteFrame,
  saveFrame,
  selectFrameEditor,
  selectFrames,
  selectIsDefaultSettings,
  selectIsSaved,
  updateFrameEditor,
} from "@/lib/store/frameEditorSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { FrameEditor } from "@/lib/types";

export function useFrameEditor() {
  const dispatch = useAppDispatch();
  const frameEditor = useAppSelector(selectFrameEditor);
  const frames = useAppSelector(selectFrames);
  const isDefaultSettings = useAppSelector(selectIsDefaultSettings);
  const isSaved = useAppSelector(selectIsSaved);

  const updateFrameEditorHandler = (partialSettings: Partial<FrameEditor>) => {
    dispatch(updateFrameEditor(partialSettings));
  };

  const saveFrameHandler = (frame: FrameEditor) => {
    dispatch(saveFrame(frame));
  };

  const deleteFrameHandler = (id: string) => {
    dispatch(deleteFrame(id));
  };

  return {
    frameEditor,
    frames,
    updateFrameEditor: updateFrameEditorHandler,
    saveFrame: saveFrameHandler,
    deleteFrame: deleteFrameHandler,
    isDefaultSettings,
    isSaved,
  };
}
