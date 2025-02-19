"use client";
import {
  isPointInLayer,
  isPointInResizeHandle,
  renderCanvas,
} from "@/app/editor/utils";
import { myFramesRoute } from "@/components/Navigation/routes";
import { Button } from "@/components/ui/button";
import { useFrameEditor } from "@/hooks/use-frame-settings";
import {
  addLayer,
  addTextLayer,
  closeFrameEditor,
  selectLayer,
  updateLayer,
} from "@/lib/store/editorSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { DragState, ImageLayer } from "@/lib/types";
import { Popover } from "@radix-ui/react-popover";
import clsx from "clsx";
import * as Icons from "lucide-react";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  FocusEventHandler,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { v4 } from "uuid";
import { Input } from "../ui/input";
import { PopoverContent, PopoverTrigger } from "../ui/popover";

const defaultDragState = {
  isDragging: false,
  startX: 0,
  startY: 0,
  layerStartX: 0,
  layerStartY: 0,
  layerStartWidth: 0,
  layerStartHeight: 0,
  resizing: false,
  resizeHandle: undefined,
  aspectRatio: 1,
};

export default function Preview() {
  const { frameEditor, updateFrameEditor, saveFrame, isSaved } =
    useFrameEditor();

  const dispatch = useAppDispatch();
  const state = useFrameEditor();
  const router = useRouter();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [dragState, setDragState] = useState<DragState>(defaultDragState);
  const [newText, setNewText] = useState("");
  const [addTextPopover, setAddTextPopover] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editableTitleRef = useRef<HTMLHeadingElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!frameEditor) {
      router.push(myFramesRoute.path);
      return;
    }

    if (!canvasRef.current) return;
    renderCanvas(canvasRef, state);
  }, [frameEditor, router, state]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!state.layerEditor) return;

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

      const layer = state.frameEditor?.layers.find(
        (layer) => layer.id === state.layerEditor?.id
      );
      if (!layer) return;

      dispatch(
        updateLayer({
          id: state.layerEditor.id,
          updates: {
            x: ("x" in layer ? layer.x : 0) + dx,
            y: ("y" in layer ? layer.y : 0) + dy,
          },
        })
      );
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, state.frameEditor?.layers, state.layerEditor]);

  const handleLayerSelect = useCallback(
    (layerId: string) => {
      dispatch(selectLayer(layerId));
    },
    [dispatch]
  );

  if (!frameEditor) {
    return null;
  }

  const { screenHeight, screenWidth, documentName } = frameEditor;

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.onload = () => {
        const aspectRatio = image.width / image.height;
        const newWidth = Math.min(400, image.width);
        const newHeight = newWidth / aspectRatio;

        const imageLayer: ImageLayer = {
          id: v4(),
          type: "image",
          x: screenWidth / 2 - newWidth / 2,
          y: screenHeight / 2 - newHeight / 2,
          width: newWidth,
          height: newHeight,
          url: event.target?.result as string,
        };

        dispatch(addLayer(imageLayer));
        dispatch(selectLayer(imageLayer.id));
      };
      image.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveTitle: FocusEventHandler<HTMLHeadingElement> = (e) => {
    if (editableTitleRef.current != null) {
      const newDocumentName = e.target.textContent ?? "";
      if (newDocumentName != documentName) {
        updateFrameEditor({ documentName: newDocumentName });
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
    const range = document.createRange();
    range.selectNodeContents(editableTitleRef.current!);
    range.collapse(false);
    const selection = window.getSelection();
    selection!.removeAllRanges();
    selection!.addRange(range);
  };

  const handleSave = () => {
    if (frameEditor.id.length === 0) {
      const frameWithId = { ...frameEditor, id: v4() };
      updateFrameEditor({ id: frameWithId.id });
      saveFrame(frameWithId);
    } else {
      saveFrame(frameEditor);
    }
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

  const handleXClick = () => {
    dispatch(closeFrameEditor());
    router.push(myFramesRoute.path);
  };

  const getMousePos = (e: React.MouseEvent) => {
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

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e);

    const layerCount = (state.frameEditor?.layers ?? []).length;
    // Check each layer in reverse order (top to bottom)
    for (let i = layerCount - 1; i >= 0; i--) {
      let layer = state.frameEditor?.layers[i];

      if (!layer) return;

      // Check resize handles for image layers
      if (layer?.type == "image" && layer.id === state.layerEditor?.id) {
        layer = layer as ImageLayer;
        const resizeHandles: Array<"nw" | "ne" | "sw" | "se"> = [
          "nw",
          "ne",
          "sw",
          "se",
        ];
        for (const handle of resizeHandles) {
          if (
            isPointInResizeHandle(pos.x, pos.y, layer as ImageLayer, handle)
          ) {
            setDragState({
              ...defaultDragState,
              isDragging: true,
              resizing: true,
              resizeHandle: handle,
              startX: pos.x,
              startY: pos.y,
              layerStartX: layer.x,
              layerStartY: layer.y,
              layerStartWidth: layer.width,
              layerStartHeight: layer.height,
              aspectRatio: layer.width / layer.height,
            });
            return;
          }
        }
      }

      if (isPointInLayer(pos.x, pos.y, layer)) {
        setDragState({
          ...defaultDragState,
          isDragging: true,
          startX: pos.x,
          startY: pos.y,
          layerStartX: layer.x,
          layerStartY: layer.y,
          layerStartWidth: "width" in layer ? layer.width : 0,
          layerStartHeight: "height" in layer ? layer.height : 0,
          aspectRatio: "width" in layer ? layer.width / layer.height : 1,
        });
        handleLayerSelect(layer.id);
        return;
      }
    }

    dispatch(selectLayer(null));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState.isDragging || !state.layerEditor) return;
    const pos = getMousePos(e);

    const layer = state.frameEditor?.layers.find(
      (l) => l.id === state.layerEditor?.id
    );
    if (!layer) return;

    if (dragState.resizing && layer.type == "image") {
      const dx = pos.x - dragState.startX;
      const dy = pos.y - dragState.startY;

      let newWidth = dragState.layerStartWidth;
      let newHeight = dragState.layerStartHeight;
      let newX = layer.x;
      let newY = layer.y;

      switch (dragState.resizeHandle) {
        case "se":
          newWidth = dragState.layerStartWidth + dx;
          newHeight = newWidth / dragState.aspectRatio;
          break;
        case "sw":
          newWidth = dragState.layerStartWidth - dx;
          newHeight = newWidth / dragState.aspectRatio;
          newX = dragState.layerStartX + dx;
          break;
        case "ne":
          newWidth = dragState.layerStartWidth + dx;
          newHeight = newWidth / dragState.aspectRatio;
          newY =
            dragState.layerStartY + (dragState.layerStartHeight - newHeight);
          break;
        case "nw":
          newWidth = dragState.layerStartWidth - dx;
          newHeight = newWidth / dragState.aspectRatio;
          newX = dragState.layerStartX + dx;
          newY =
            dragState.layerStartY + (dragState.layerStartHeight - newHeight);
          break;
      }

      // Maintain minimum size
      const minSize = 20;
      if (newWidth < minSize) {
        newWidth = minSize;
        newHeight = minSize / dragState.aspectRatio;
      }

      dispatch(
        updateLayer({
          id: state.layerEditor?.id,
          updates: {
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
          },
        })
      );
    } else {
      const dx = pos.x - dragState.startX;
      const dy = pos.y - dragState.startY;

      dispatch(
        updateLayer({
          id: state.layerEditor?.id,
          updates: {
            x: dragState.layerStartX + dx,
            y: dragState.layerStartY + dy,
          },
        })
      );
    }
  };

  const handleMouseUp = () => {
    setDragState(defaultDragState);
  };

  const handleAddLayer = () => {
    if (!newText.trim()) return;

    const { screenWidth, screenHeight } = frameEditor;

    dispatch(
      addTextLayer({
        text: newText,
        width: screenWidth,
        height: screenHeight,
      })
    );
    setNewText("");
    setAddTextPopover(false);
  };

  return (
    <main className="flex-1 p-6 bg-background">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 items-center">
            <h2
              ref={editableTitleRef}
              className={clsx("text-lg", "font-medium", "p-2", {
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
              <Icons.Check
                size={16}
                onClick={onSaveTitle}
                className="cursor-pointer"
              />
            ) : (
              <Icons.Edit
                size={16}
                onClick={onEditTitle}
                className="cursor-pointer"
              />
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant={isSaved ? "ghost" : "outline"}
              onClick={handleSave}
              disabled={isSaved}
            >
              {isSaved ? (
                <span>Changes saved</span>
              ) : (
                <Icons.Save className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" onClick={handleDownloadCanvas}>
              <Icons.Download className="h-4 w-4" />
            </Button>
            <Button variant="default" onClick={handleXClick}>
              <Icons.X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2 mb-2">
          <Popover open={addTextPopover} onOpenChange={setAddTextPopover}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Icons.Text className="h-4 w-4 mr-2" />
                Add Text
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Enter your text. You can style it on the sidebar after you
                    added.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Input
                      value={newText}
                      placeholder="Enter text..."
                      onChange={(e) => setNewText(e.target.value)}
                      className="col-span-2 h-8"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAddLayer();
                        }
                      }}
                    />
                    <Button onClick={handleAddLayer} disabled={!newText}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/png"
            className="hidden"
            onChange={handleImageUpload}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Icons.Image className="h-4 w-4 mr-2" />
            Add Image
          </Button>
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
