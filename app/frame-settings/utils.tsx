import { RefObject } from "react";
import { FrameSettings } from "./constants";

export const renderCanvas = (
  canvasRef: RefObject<HTMLCanvasElement>,
  frameSettings: FrameSettings
) => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
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
  const totalFrameWidth = frameWidth - frameSpacing * (frameCount - 1);
  const frameInnerWidth =
    (totalFrameWidth - (frameLeftWidth + frameRightWidth)) / frameCount;

  for (let i = 0; i < frameCount; i++) {
    const offsetX = i * (frameInnerWidth + frameSpacing);

    ctx.save();
    ctx.translate(offsetX, 0);

    // Carve out the frame
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();

    ctx.moveTo(frameLeftWidth, frameTopWidth);
    ctx.arcTo(
      frameLeftWidth + frameInnerWidth,
      frameTopWidth,
      frameLeftWidth + frameInnerWidth,
      frameTopWidth + frameRadius,
      frameRadius
    );
    ctx.arcTo(
      frameLeftWidth + frameInnerWidth,
      frameHeight - frameBottomWidth,
      frameLeftWidth + frameInnerWidth - frameRadius,
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
        frameLeftWidth + frameInnerWidth,
        frameTopWidth,
        frameLeftWidth + frameInnerWidth,
        frameTopWidth + frameRadius,
        frameRadius
      );
      ctx.arcTo(
        frameLeftWidth + frameInnerWidth,
        frameHeight - frameBottomWidth,
        frameLeftWidth + frameInnerWidth - frameRadius,
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
