"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PartyPopper as EyeDropper } from "lucide-react";
import { useCallback } from "react";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const handleChange = useCallback(
    (newColor: string) => {
      onChange(newColor);
    },
    [onChange]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("justify-start text-left font-normal", className)}
        >
          <div className="w-full flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-sm border"
              style={{ backgroundColor: value }}
            />
            <span className="relative inline-block" style={{ color: "black" }}>
              A
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: value }}
              />
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid gap-4">
          <div className="grid grid-cols-8 gap-1">
            {[
              "#000000", // Black
              "#FFFFFF", // White
              "#FF0000", // Red
              "#008000", // Green
              "#0000FF", // Blue
              "#FFFF00", // Yellow
              "#FFA500", // Orange
              "#800080", // Purple
              "#FFC0CB", // Pink
              "#808080", // Gray
              "#A52A2A", // Brown
              "#00FFFF", // Cyan
              "#FF00FF", // Magenta
              "#00FF00", // Lime
              "#008080", // Teal
              "#800000", // Maroon
              "#808000", // Olive
              "#000080", // Navy
              "#C0C0C0", // Silver
              "#FFD700", // Gold
              "#ADD8E6", // Light Blue
              "#90EE90", // Light Green
              "#FFB6C1", // Light Pink
              "#FFA07A", // Light Salmon
            ].map((color) => (
              <button
                key={color}
                className={cn(
                  "h-6 w-6 rounded-md border border-muted",
                  value === color && "ring-2 ring-primary ring-offset-2"
                )}
                style={{ backgroundColor: color }}
                onClick={() => handleChange(color)}
              />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="color"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                className="w-full h-8 cursor-pointer"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8"
                onClick={async () => {
                  try {
                    // @ts-ignore - EyeDropper API is not yet in TypeScript
                    const dropper = new EyeDropper();
                    const result = await dropper.open();
                    handleChange(result.sRGBHex);
                  } catch (e) {
                    console.log("Eye dropper not supported or cancelled");
                  }
                }}
              >
                <EyeDropper className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
