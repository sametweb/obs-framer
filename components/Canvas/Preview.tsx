import { renderCanvas } from "@/app/frame-settings/utils";
import { useFrameSettings } from "@/contexts/FrameSettingsContext";
import { useTextEditor } from "@/contexts/TextEditorContext";
import localStorageService from "@/lib/localStorageService";
import { TextLayer } from "@/lib/types";
import clsx from "clsx";
import { Check, Download, Edit, Save } from "lucide-react";
import { FocusEventHandler, KeyboardEventHandler, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import { Button } from "../ui/button";

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  layerStartX: number;
  layerStartY: number;
}

export default function Preview() {
  const { currentFrameSettings, updateFrameSettings, updateCurrentFrameSettings, isCurrentFrameSettingsSaved } = useFrameSettings();
  const { state, dispatch } = useTextEditor();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editableTitleRef = useRef<HTMLHeadingElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    layerStartX: 0,
    layerStartY: 0,
  });

  const { screenHeight, screenWidth, documentName } = currentFrameSettings;

  // Initial render and frame settings changes
  useEffect(() => {
    if (!canvasRef.current) return;
    renderCanvas(canvasRef, currentFrameSettings, state);
  }, [currentFrameSettings]);

  // Handle text layer changes
  useEffect(() => {
    if (!canvasRef.current) return;
    renderCanvas(canvasRef, currentFrameSettings, state);
  }, [state, state.layers, state.selectedLayerId]);

  const handleSaveTitle: FocusEventHandler<HTMLHeadingElement> = (e) => {
    if (editableTitleRef.current != null) {
      const newDocumentName = e.target.textContent ?? "";
      if (newDocumentName != documentName) {
        updateCurrentFrameSettings({ documentName: newDocumentName });
      } else {
        onSaveTitle();
      }
    }
  };

  const onSaveTitle = () => {
    setIsEditingTitle(false);
  };

  const handleOnKeyDownWhenEditingTitle: KeyboardEventHandler<HTMLHeadingElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSaveTitle();
      editableTitleRef.current?.blur();
    }
  };

  const onEditTitle = () => {
    setIsEditingTitle(true);
    editableTitleRef.current?.focus();
    const range = document.createRange();
    range.selectNodeContents(editableTitleRef.current!);
    range.collapse(false);
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

  const getMousePos = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const isPointInTextBounds = (x: number, y: number, layer: TextLayer) => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    ctx.save();
    ctx.font = `${layer.italic ? "italic " : ""}${layer.bold ? "bold " : ""}${layer.fontSize}px ${layer.fontFamily}`;
    const metrics = ctx.measureText(layer.text);
    const height = layer.fontSize;
    ctx.restore();

    return (
      x >= layer.x &&
      x <= layer.x + metrics.width &&
      y >= layer.y - height &&
      y <= layer.y
    );
  };

  const handleMouseDown = (e: MouseEvent) => {
    const pos = getMousePos(e);

    // Check each layer in reverse order (top to bottom)
    for (let i = state.layers.length - 1; i >= 0; i--) {
      const layer = state.layers[i];
      if (isPointInTextBounds(pos.x, pos.y, layer)) {
        setDragState({
          isDragging: true,
          startX: pos.x,
          startY: pos.y,
          layerStartX: layer.x,
          layerStartY: layer.y,
        });
        dispatch({ type: "SELECT_LAYER", payload: layer.id });
        return;
      }
    }

    dispatch({ type: "SELECT_LAYER", payload: null });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragState.isDragging || !state.selectedLayerId) return;
    const pos = getMousePos(e);
    const dx = pos.x - dragState.startX;
    const dy = pos.y - dragState.startY;

    dispatch({
      type: "UPDATE_LAYER",
      payload: {
        id: state.selectedLayerId,
        updates: {
          x: dragState.layerStartX + dx,
          y: dragState.layerStartY + dy,
        },
      },
    });
  };

  const handleMouseUp = () => {
    setDragState({
      isDragging: false,
      startX: 0,
      startY: 0,
      layerStartX: 0,
      layerStartY: 0,
    });
  };

  // Add keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!state.selectedLayerId) return;

      const moveAmount = e.shiftKey ? 10 : 1;
      let dx = 0;
      let dy = 0;

      switch (e.key) {
        case "ArrowLeft":
          dx = -moveAmount;
          break;
        case "ArrowRight":
          dx = moveAmount;
          break;
        case "ArrowUp":
          dy = -moveAmount;
          break;
        case "ArrowDown":
          dy = moveAmount;
          break;
        default:
          return;
      }

      e.preventDefault();

      const layer = state.layers.find((layer) => layer.id === state.selectedLayerId);
      if (!layer) return;

      dispatch({
        type: "UPDATE_LAYER",
        payload: {
          id: state.selectedLayerId,
          updates: {
            x: layer.x + dx,
            y: layer.y + dy,
          },
        },
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.selectedLayerId, dispatch, state.layers]);

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
              <Check size={16} onClick={onSaveTitle} className="cursor-pointer" />
            ) : (
              <Edit size={16} onClick={onEditTitle} className="cursor-pointer" />
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
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          tabIndex={0}
        />
      </div>
    </main>
  );
}