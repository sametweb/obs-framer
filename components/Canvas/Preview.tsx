import { renderCanvas } from "@/app/frame-settings/utils";
import {
  FrameSettings,
  useFrameSettings,
} from "@/contexts/FrameSettingsContext";
import localStorageService from "@/lib/localStorageService";
import clsx from "clsx";
import { Check, Download, Edit, Save } from "lucide-react";
import {
  FocusEventHandler,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { v4 } from "uuid";
import { Button } from "../ui/button";

export default function Preview() {
  const {
    currentFrameSettings,
    updateFrameSettings,
    isCurrentFrameSettingsSaved,
  } = useFrameSettings();

  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editableTitleRef = useRef<HTMLHeadingElement>(null);

  const {
    frameBottomWidth,
    frameCount,
    frameGradient,
    frameLeftWidth,
    frameRadius,
    frameRightWidth,
    frameSpacing,
    frameTopWidth,
    screenHeight,
    screenWidth,
    documentName,
  } = currentFrameSettings;

  const handleSaveTitle: FocusEventHandler<HTMLHeadingElement> = (e) => {
    if (editableTitleRef.current != null) {
      const newDocumentName = e.target.textContent ?? "";
      if (newDocumentName != documentName) {
        updateFrameSettings({ documentName: newDocumentName });
      } else {
        onSaveTitle();
      }
    }
  };

  const onSaveTitle = () => {
    setIsEditingTitle(false);
  };

  const handleOnKeyDownWhenEditingTitle: KeyboardEventHandler<
    HTMLHeadingElement
  > = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSaveTitle();
      editableTitleRef.current?.blur();
    }
  };

  const onEditTitle = () => {
    setIsEditingTitle(true);

    editableTitleRef.current?.focus();
    // Move cursor to the end of the text.
    const range = document.createRange();
    range.selectNodeContents(editableTitleRef.current!);
    range.collapse(false); // Collapse to the end
    const selection = window.getSelection();
    selection!.removeAllRanges();
    selection!.addRange(range);
  };

  const handleSave = () => {
    if (localStorageService.getItem<FrameSettings[]>("frames") == null) {
      localStorageService.setItem("frames", []);
    }

    if (currentFrameSettings.id.length == 0) {
      currentFrameSettings.id = v4();
    }
    updateFrameSettings(currentFrameSettings);
    localStorageService.addItemToArray("frames", currentFrameSettings);
  };

  const handleDownloadCanvas = () => {
    if (canvasRef.current !== null) {
      const dataURL = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas_image.png";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    renderCanvas(canvasRef, currentFrameSettings);
  }, [
    screenWidth,
    screenHeight,
    frameLeftWidth,
    frameRightWidth,
    frameBottomWidth,
    frameTopWidth,
    frameSpacing,
    frameRadius,
    frameGradient,
    frameCount,
    currentFrameSettings,
  ]);

  return (
    <main className="flex-1 p-6 bg-background">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 items-center">
            <h2
              ref={editableTitleRef}
              className={clsx("text-lg", "font-semibold", "p-2", {
                "bg-red-50": isEditingTitle,
              })}
              contentEditable
              suppressContentEditableWarning
              onFocus={(_) => setIsEditingTitle(true)}
              onBlur={handleSaveTitle}
              onKeyDown={handleOnKeyDownWhenEditingTitle}
            >
              {documentName}
            </h2>
            {isEditingTitle ? (
              <Check
                size={16}
                onClick={onSaveTitle}
                className="cursor-pointer"
              />
            ) : (
              <Edit
                size={16}
                onClick={onEditTitle}
                className="cursor-pointer"
              />
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isCurrentFrameSettingsSaved}
            >
              {isCurrentFrameSettingsSaved ? "Changes saved" : "Save"}
              <Save className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleDownloadCanvas}>
              Download
              <Download className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width={screenWidth}
          height={screenHeight}
          className="max-w-full h-auto"
        />
      </div>
    </main>
  );
}
