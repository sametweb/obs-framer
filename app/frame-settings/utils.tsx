import { TextEditorState, TextLayer } from "@/lib/types";
import { RefObject } from "react";
import { FrameSettings } from "./constants";

export const renderCanvas = (
  canvasRef: RefObject<HTMLCanvasElement>,
  frameSettings: FrameSettings,
  state: TextEditorState
) => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  fillGradient(frameSettings.frameGradient, ctx, canvas);
  ctx.fillRect(0, 0, frameSettings.screenWidth, frameSettings.screenHeight);
  drawFrame(
    ctx,
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

  if (!state) return;
  drawText(ctx, state.layers, state.selectedLayerId);
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
): CanvasRenderingContext2D => {
  const totalSpacing = frameSpacing * (frameCount - 1);
  const totalBorders = frameLeftWidth + frameRightWidth;
  const totalUsableFrameWidth =
    (frameWidth - totalSpacing - totalBorders) / frameCount;

  for (let i = 0; i < frameCount; i++) {
    const offsetX = i * (totalUsableFrameWidth + frameSpacing);

    ctx.save();
    ctx.translate(offsetX, 0);

    // Carve out the frame
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();

    ctx.moveTo(frameLeftWidth, frameTopWidth);
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
    ctx.fill();

    // Draw the border around the carved frame, only if frameBorderWidth > 0
    if (frameBorderWidth > 0) {
      ctx.globalCompositeOperation = "source-over"; // Reset composite operation
      ctx.lineWidth = frameBorderWidth;
      ctx.strokeStyle = frameBorderColor;
      ctx.beginPath(); // Re-use the path

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
      ctx.stroke();
    }

    ctx.restore();
  }

  return ctx;
};

export const drawText = (
  ctx: CanvasRenderingContext2D,
  layers: TextLayer[],
  selectedLayerId: string | null
) => {
  // Create a temporary canvas for text layers to avoid direct manipulation
  const textCanvas = document.createElement("canvas");
  textCanvas.width = ctx.canvas.width;
  textCanvas.height = ctx.canvas.height;
  const textCtx = textCanvas.getContext("2d", { alpha: true });

  if (!textCtx) return;

  // Clear the text canvas
  textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);

  // Render each text layer on the temporary canvas
  layers.forEach((layer) => {
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

    // Draw selection indicators
    if (layer.id === selectedLayerId) {
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

  // Composite the text onto the main canvas
  ctx.drawImage(textCanvas, 0, 0);
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
