import { renderCanvas } from "@/app/frame-settings/utils";
import {
  FrameSettings,
  useFrameSettings,
} from "@/contexts/FrameSettingsContext";
import { useTextEditor } from "@/contexts/TextEditorContext";
import localStorageService from "@/lib/localStorageService";
import { TextLayer } from "@/lib/types";
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

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  layerStartX: number;
  layerStartY: number;
}

export default function Preview() {
  const {
    currentFrameSettings,
    updateFrameSettings,
    updateCurrentFrameSettings,
    isCurrentFrameSettingsSaved,
  } = useFrameSettings();

  const { state, dispatch } = useTextEditor();
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    layerStartX: 0,
    layerStartY: 0,
  });

  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editableTitleRef = useRef<HTMLHeadingElement>(null);

  const { screenHeight, screenWidth, documentName } = currentFrameSettings;

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
    renderCanvas(canvasRef, currentFrameSettings, state);
  }, [currentFrameSettings, state]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    setCtx(context);
  }, []);

  // Add keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!state.selectedLayerId) return;

      const moveAmount = e.shiftKey ? 10 : 1; // Move 10px with shift, 1px without
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

      e.preventDefault(); // Prevent page scrolling

      const layer = state.layers.find(
        (layer) => layer.id === state.selectedLayerId
      );
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
    if (!ctx) return false;

    ctx.save();
    ctx.font = `${layer.italic ? "italic " : ""}${layer.bold ? "bold " : ""}${
      layer.fontSize
    }px ${layer.fontFamily}`;

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

  useEffect(() => {
    if (!ctx || !canvasRef.current) return;

    // Clear the entire canvas first
    ctx.clearRect(0, 0, screenWidth, screenHeight);

    // Create a temporary canvas for text layers
    const textCanvas = document.createElement("canvas");
    textCanvas.width = screenWidth;
    textCanvas.height = screenHeight;
    const textCtx = textCanvas.getContext("2d", { alpha: true });

    if (!textCtx) return;

    // Clear the text canvas
    textCtx.clearRect(0, 0, screenWidth, screenHeight);

    // Render each text layer on the temporary canvas
    state.layers.forEach((layer) => {
      textCtx.save();

      // Set text styles
      textCtx.font = `${layer.italic ? "italic " : ""}${
        layer.bold ? "bold " : ""
      }${layer.fontSize}px ${layer.fontFamily}`;
      textCtx.fillStyle = layer.color;

      // Apply effects
      if (layer.effects.shadow.enabled) {
        textCtx.shadowColor = layer.effects.shadow.color;
        textCtx.shadowBlur = layer.effects.shadow.blur;
        textCtx.shadowOffsetX = layer.effects.shadow.offsetX;
        textCtx.shadowOffsetY = layer.effects.shadow.offsetY;
      }

      if (layer.effects.outline.enabled) {
        textCtx.strokeStyle = layer.effects.outline.color;
        textCtx.lineWidth = layer.effects.outline.width;
        textCtx.strokeText(layer.text, layer.x, layer.y);
      }

      // Draw text
      textCtx.fillText(layer.text, layer.x, layer.y);

      // Draw underline if enabled
      if (layer.underline) {
        const metrics = textCtx.measureText(layer.text);
        const lineY = layer.y + 3;
        textCtx.beginPath();
        textCtx.moveTo(layer.x, lineY);
        textCtx.lineTo(layer.x + metrics.width, lineY);
        textCtx.strokeStyle = layer.color;
        textCtx.lineWidth = 1;
        textCtx.stroke();
      }

      // Draw bounding box for selected layer
      if (layer.id === state.selectedLayerId) {
        const metrics = textCtx.measureText(layer.text);
        const height = layer.fontSize;

        textCtx.strokeStyle = "#0066ff";
        textCtx.lineWidth = 1;
        textCtx.setLineDash([5, 5]);
        textCtx.strokeRect(
          layer.x - 4,
          layer.y - height - 4,
          metrics.width + 8,
          height + 8
        );

        // Draw coordinates
        textCtx.fillStyle = "#0066ff";
        textCtx.font = "12px Inter";
        textCtx.setLineDash([]);
        textCtx.fillText(
          `(${Math.round(layer.x)}, ${Math.round(layer.y)})`,
          layer.x,
          layer.y + 20
        );
      }

      textCtx.restore();
    });

    // Draw the text layers onto the main canvas
    ctx.drawImage(textCanvas, 0, 0);
  }, [state.layers, state.selectedLayerId, ctx, screenWidth, screenHeight]);

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
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          tabIndex={0} // Make canvas focusable
        />
      </div>
    </main>
  );
}
