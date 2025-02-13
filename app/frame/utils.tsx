import { ImageLayer, Layer, TextEditorState, TextLayer } from "@/lib/types";
import { RefObject } from "react";
import { FrameSettings } from "./constants";

// Cache for loaded images
const imageCache = new Map<string, HTMLImageElement>();

const loadImage = (url: string): Promise<HTMLImageElement> => {
  if (imageCache.has(url)) {
    return Promise.resolve(imageCache.get(url)!);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(url, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
};

export const renderCanvas = async (
  canvasRef: RefObject<HTMLCanvasElement>,
  frameSettings: FrameSettings,
  state?: TextEditorState
) => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;

  // Clear the canvas to be fully transparent
  ctx.clearRect(0, 0, frameSettings.screenWidth, frameSettings.screenHeight);

  // Draw the frame gradient background
  fillGradient(frameSettings.frameGradient, ctx, canvas);
  ctx.fillRect(0, 0, frameSettings.screenWidth, frameSettings.screenHeight);

  // Create a temporary canvas for the frame mask
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = canvas.width;
  maskCanvas.height = canvas.height;
  const maskCtx = maskCanvas.getContext('2d');
  if (!maskCtx) return;

  // Draw the frame cutouts on the mask canvas
  drawFrame(
    maskCtx,
    frameSettings.screenWidth,
    frameSettings.screenHeight,
    frameSettings.frameLeftWidth,
    frameSettings.frameRightWidth,
    frameSettings.frameTopWidth,
    frameSettings.frameBottomWidth,
    frameSettings.frameRadius,
    frameSettings.frameSpacing,
    frameSettings.frameCount,
    frameSettings.frameInnerBorderWidth,
    frameSettings.frameInnerBorderColor
  );

  // Use the mask to cut out the frame
  ctx.globalCompositeOperation = 'destination-out';
  ctx.drawImage(maskCanvas, 0, 0);
  ctx.globalCompositeOperation = 'source-over';

  // Draw the frame borders
  if (frameSettings.frameInnerBorderWidth > 0) {
    const borderCanvas = document.createElement('canvas');
    borderCanvas.width = canvas.width;
    borderCanvas.height = canvas.height;
    const borderCtx = borderCanvas.getContext('2d');
    if (!borderCtx) return;

    drawFrameBorders(
      borderCtx,
      frameSettings.screenWidth,
      frameSettings.screenHeight,
      frameSettings.frameLeftWidth,
      frameSettings.frameRightWidth,
      frameSettings.frameTopWidth,
      frameSettings.frameBottomWidth,
      frameSettings.frameRadius,
      frameSettings.frameSpacing,
      frameSettings.frameCount,
      frameSettings.frameInnerBorderWidth,
      frameSettings.frameInnerBorderColor
    );

    ctx.drawImage(borderCanvas, 0, 0);
  }

  // Only draw layers if state is provided
  if (state) {
    ctx.save();
    // Pre-load all images before drawing
    await Promise.all(
      state.layers
        .filter((layer): layer is ImageLayer => 'url' in layer)
        .map(layer => loadImage(layer.url))
    );

    // Draw all layers
    for (const layer of state.layers) {
      if ('text' in layer) {
        drawTextLayer(ctx, layer, layer.id === state.selectedLayerId);
      } else if ('url' in layer) {
        await drawImageLayer(ctx, layer, layer.id === state.selectedLayerId);
      }
    }
    ctx.restore();
  }
};

const drawTextLayer = (
  ctx: CanvasRenderingContext2D,
  layer: TextLayer,
  isSelected: boolean
) => {
  ctx.save();
  ctx.font = `${layer.italic ? "italic " : ""}${layer.bold ? "bold " : ""}${
    layer.fontSize
  }px ${layer.fontFamily}`;
  ctx.fillStyle = layer.color;

  // Apply effects
  if (layer.effects.shadow.enabled) {
    ctx.shadowColor = layer.effects.shadow.color;
    ctx.shadowBlur = layer.effects.shadow.blur;
    ctx.shadowOffsetX = layer.effects.shadow.offsetX;
    ctx.shadowOffsetY = layer.effects.shadow.offsetY;
  }

  if (layer.effects.outline.enabled) {
    ctx.strokeStyle = layer.effects.outline.color;
    ctx.lineWidth = layer.effects.outline.width;
    ctx.strokeText(layer.text, layer.x, layer.y);
  }

  // Draw text
  ctx.fillText(layer.text, layer.x, layer.y);

  // Draw underline if enabled
  if (layer.underline) {
    const metrics = ctx.measureText(layer.text);
    const lineY = layer.y + 3;
    ctx.beginPath();
    ctx.moveTo(layer.x, lineY);
    ctx.lineTo(layer.x + metrics.width, lineY);
    ctx.strokeStyle = layer.color;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw selection indicators
  if (isSelected) {
    const metrics = ctx.measureText(layer.text);
    const height = layer.fontSize;

    ctx.strokeStyle = "#0066ff";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(
      layer.x - 4,
      layer.y - height - 4,
      metrics.width + 8,
      height + 8
    );

    ctx.fillStyle = "#0066ff";
    ctx.font = "12px Inter";
    ctx.setLineDash([]);
    ctx.fillText(
      `(${Math.round(layer.x)}, ${Math.round(layer.y)})`,
      layer.x,
      layer.y + 20
    );
  }

  ctx.restore();
};

const drawImageLayer = async (
  ctx: CanvasRenderingContext2D,
  layer: ImageLayer,
  isSelected: boolean
) => {
  ctx.save();

  // Get the cached image or load it
  const image = await loadImage(layer.url);
  
  // Use high-quality image rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  // Draw the image
  ctx.drawImage(image, layer.x, layer.y, layer.width, layer.height);

  // Draw selection box if selected
  if (isSelected) {
    ctx.strokeStyle = "#0066ff";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(layer.x - 4, layer.y - 4, layer.width + 8, layer.height + 8);

    // Draw resize handles
    const handleSize = 8;
    const handles = [
      { x: layer.x - 4, y: layer.y - 4 }, // NW
      { x: layer.x + layer.width - 4, y: layer.y - 4 }, // NE
      { x: layer.x - 4, y: layer.y + layer.height - 4 }, // SW
      { x: layer.x + layer.width - 4, y: layer.y + layer.height - 4 }, // SE
    ];

    ctx.setLineDash([]);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#0066ff";
    handles.forEach(handle => {
      ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
      ctx.strokeRect(handle.x, handle.y, handleSize, handleSize);
    });

    // Draw coordinates
    ctx.fillStyle = "#0066ff";
    ctx.font = "12px Inter";
    ctx.fillText(
      `(${Math.round(layer.x)}, ${Math.round(layer.y)})`,
      layer.x,
      layer.y + layer.height + 20
    );
  }

  ctx.restore();
};

export const drawFrame = (
  ctx: CanvasRenderingContext2D,
  frameWidth: number,
  frameHeight: number,
  frameLeftWidth: number,
  frameRightWidth: number,
  frameTopWidth: number,
  frameBottomWidth: number,
  frameRadius: number,
  frameSpacing: number,
  frameCount: number,
  frameBorderWidth: number,
  frameBorderColor: string
) => {
  const totalSpacing = frameSpacing * (frameCount - 1);
  const totalBorders = frameLeftWidth + frameRightWidth;
  const totalUsableFrameWidth =
    (frameWidth - totalSpacing - totalBorders) / frameCount;

  for (let i = 0; i < frameCount; i++) {
    const offsetX = i * (totalUsableFrameWidth + frameSpacing);

    ctx.save();
    ctx.translate(offsetX, 0);

    // Create a path for the frame cutout
    ctx.beginPath();
    ctx.moveTo(frameLeftWidth + frameRadius, frameTopWidth);
    ctx.arcTo(
      frameLeftWidth + totalUsableFrameWidth,
      frameTopWidth,
      frameLeftWidth + totalUsableFrameWidth,
      frameTopWidth + frameRadius,
      frameRadius
    );
    ctx.arcTo(
      frameLeftWidth + totalUsableFrameWidth,
      frameHeight - frameBottomWidth,
      frameLeftWidth + totalUsableFrameWidth - frameRadius,
      frameHeight - frameBottomWidth,
      frameRadius
    );
    ctx.arcTo(
      frameLeftWidth,
      frameHeight - frameBottomWidth,
      frameLeftWidth,
      frameHeight - frameBottomWidth - frameRadius,
      frameRadius
    );
    ctx.arcTo(
      frameLeftWidth,
      frameTopWidth,
      frameLeftWidth + frameRadius,
      frameTopWidth,
      frameRadius
    );
    ctx.closePath();

    // Fill the cutout with solid color
    ctx.fillStyle = '#000000';
    ctx.fill();

    ctx.restore();
  }
};

const drawFrameBorders = (
  ctx: CanvasRenderingContext2D,
  frameWidth: number,
  frameHeight: number,
  frameLeftWidth: number,
  frameRightWidth: number,
  frameTopWidth: number,
  frameBottomWidth: number,
  frameRadius: number,
  frameSpacing: number,
  frameCount: number,
  frameBorderWidth: number,
  frameBorderColor: string
) => {
  const totalSpacing = frameSpacing * (frameCount - 1);
  const totalBorders = frameLeftWidth + frameRightWidth;
  const totalUsableFrameWidth =
    (frameWidth - totalSpacing - totalBorders) / frameCount;

  for (let i = 0; i < frameCount; i++) {
    const offsetX = i * (totalUsableFrameWidth + frameSpacing);

    ctx.save();
    ctx.translate(offsetX, 0);

    // Create a path for the frame border
    ctx.beginPath();
    ctx.moveTo(frameLeftWidth + frameRadius, frameTopWidth);
    ctx.arcTo(
      frameLeftWidth + totalUsableFrameWidth,
      frameTopWidth,
      frameLeftWidth + totalUsableFrameWidth,
      frameTopWidth + frameRadius,
      frameRadius
    );
    ctx.arcTo(
      frameLeftWidth + totalUsableFrameWidth,
      frameHeight - frameBottomWidth,
      frameLeftWidth + totalUsableFrameWidth - frameRadius,
      frameHeight - frameBottomWidth,
      frameRadius
    );
    ctx.arcTo(
      frameLeftWidth,
      frameHeight - frameBottomWidth,
      frameLeftWidth,
      frameHeight - frameBottomWidth - frameRadius,
      frameRadius
    );
    ctx.arcTo(
      frameLeftWidth,
      frameTopWidth,
      frameLeftWidth + frameRadius,
      frameTopWidth,
      frameRadius
    );
    ctx.closePath();

    // Draw the border
    ctx.strokeStyle = frameBorderColor;
    ctx.lineWidth = frameBorderWidth;
    ctx.stroke();

    ctx.restore();
  }
};

export interface LinearGradientSettings {
  direction: "top-bottom" | "left-right" | "diagonal" | "diagonal-reverse";
  stops: GradientStop[];
}

export interface GradientStop {
  offset: number;
  color: string;
}

export const fillGradient = (
  settings: LinearGradientSettings,
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) => {
  const { direction, stops } = settings;
  if (stops.length === 1) {
    ctx.fillStyle = stops[0].color;
    return;
  }

  let x1, y1, x2, y2;

  switch (direction) {
    case "top-bottom":
      x1 = 0;
      y1 = 0;
      x2 = 0;
      y2 = canvas.height;
      break;
    case "left-right":
      x1 = 0;
      y1 = 0;
      x2 = canvas.width;
      y2 = 0;
      break;
    case "diagonal":
      x1 = 0;
      y1 = 0;
      x2 = canvas.width;
      y2 = canvas.height;
      break;
    case "diagonal-reverse":
      x1 = canvas.width;
      y1 = 0;
      x2 = 0;
      y2 = canvas.height;
      break;
  }

  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  stops.forEach((stop) => gradient.addColorStop(stop.offset, stop.color));
  ctx.fillStyle = gradient;
};

export const getGradientStyle = (frameGradient: LinearGradientSettings) => {
  if (frameGradient.stops.length === 1) {
    return frameGradient.stops[0].color;
  }

  const sortedStops = [...frameGradient.stops].sort(
    (a, b) => a.offset - b.offset
  );
  const gradientStops = sortedStops
    .map((stop) => `${stop.color} ${stop.offset * 100}%`)
    .join(", ");

  switch (frameGradient.direction) {
    case "top-bottom":
      return `linear-gradient(to bottom, ${gradientStops})`;
    case "left-right":
      return `linear-gradient(to right, ${gradientStops})`;
    case "diagonal":
      return `linear-gradient(135deg, ${gradientStops})`;
    case "diagonal-reverse":
      return `linear-gradient(-135deg, ${gradientStops})`;
  }
};

export const isPointInResizeHandle = (
  x: number,
  y: number,
  layer: ImageLayer,
  handle: 'nw' | 'ne' | 'sw' | 'se'
): boolean => {
  const handleSize = 8;
  const handles = {
    nw: { x: layer.x - 4, y: layer.y - 4 },
    ne: { x: layer.x + layer.width - 4, y: layer.y - 4 },
    sw: { x: layer.x - 4, y: layer.y + layer.height - 4 },
    se: { x: layer.x + layer.width - 4, y: layer.y + layer.height - 4 },
  };

  const handlePos = handles[handle];
  return (
    x >= handlePos.x &&
    x <= handlePos.x + handleSize &&
    y >= handlePos.y &&
    y <= handlePos.y + handleSize
  );
};

export const isPointInLayer = (x: number, y: number, layer: Layer): boolean => {
  if ('text' in layer) {
    // Text layer bounds check
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    ctx.font = `${layer.italic ? "italic " : ""}${layer.bold ? "bold " : ""}${
      layer.fontSize
    }px ${layer.fontFamily}`;
    const metrics = ctx.measureText(layer.text);
    const height = layer.fontSize;

    return (
      x >= layer.x &&
      x <= layer.x + metrics.width &&
      y >= layer.y - height &&
      y <= layer.y
    );
  } else if ('url' in layer) {
    // Image layer bounds check
    return (
      x >= layer.x &&
      x <= layer.x + layer.width &&
      y >= layer.y &&
      y <= layer.y + layer.height
    );
  }
  return false;
};