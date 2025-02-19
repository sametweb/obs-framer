import {
  closeFrameEditor,
  deleteFrame,
  openFrameEditor,
  saveFrame,
  selectFrameEditor,
  selectFrames,
  selectIsDefaultSettings,
  selectIsSaved,
  selectLayerEditor,
  selectLayers,
  updateFrameEditor,
} from "@/lib/store/editorSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { FrameEditor } from "@/lib/types";

export function useFrameEditor() {
  const dispatch = useAppDispatch();
  const frameEditor = useAppSelector(selectFrameEditor);
  const layerEditor = useAppSelector(selectLayerEditor);
  const frames = useAppSelector(selectFrames);
  const layers = useAppSelector(selectLayers);
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

  const open = (frame: FrameEditor) => dispatch(openFrameEditor(frame));

  const close = () => dispatch(closeFrameEditor());

  return {
    frameEditor,
    layerEditor,
    frames,
    layers,
    updateFrameEditor: updateFrameEditorHandler,
    saveFrame: saveFrameHandler,
    deleteFrame: deleteFrameHandler,
    isDefaultSettings,
    isSaved,
    open,
    close,
  };
}
