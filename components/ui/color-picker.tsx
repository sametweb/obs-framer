"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PartyPopper as EyeDropper } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (newColor: string) => {
      onChange(newColor);
      setIsOpen(false);
    },
    [onChange]
  );

  const handleCustomColorClick = () => {
    colorInputRef.current?.click();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("w-[40px] h-[40px] relative", className)}
        >
          <span className="absolute inset-0 flex items-center justify-center font-semibold text-lg text-black">
            <span className="relative">
              A
              <span
                className="absolute bottom-0 left-0 w-full h-[3px]"
                style={{ backgroundColor: value }}
              />
            </span>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-3">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-md border"
                style={{ backgroundColor: value }}
              />
              <div className="space-y-1">
                <p className="text-sm font-medium">Color</p>
                <p className="text-xs text-muted-foreground">{value}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
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
              <EyeDropper className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-10 gap-1">
            {[
              "#000000",
              "#ffffff",
              "#ef4444",
              "#f97316",
              "#f59e0b",
              "#22c55e",
              "#3b82f6",
              "#6366f1",
              "#a855f7",
              "#ec4899",
              "#111111",
              "#333333",
              "#dc2626",
              "#ea580c",
              "#d97706",
              "#16a34a",
              "#2563eb",
              "#4f46e5",
              "#9333ea",
              "#db2777",
              "#444444",
              "#666666",
              "#b91c1c",
              "#c2410c",
              "#b45309",
              "#15803d",
              "#1d4ed8",
              "#4338ca",
              "#7e22ce",
              "#be185d",
              "#888888",
              "#999999",
              "#7f1d1d",
              "#9a3412",
              "#854d0e",
              "#166534",
              "#1e40af",
              "#3730a3",
              "#6b21a8",
              "#9d174d",
            ].map((color) => (
              <button
                key={color}
                className={cn(
                  "w-6 h-6 rounded-md border border-muted",
                  value === color && "ring-2 ring-primary ring-offset-2"
                )}
                style={{ backgroundColor: color }}
                onClick={() => handleChange(color)}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleCustomColorClick}
            >
              Custom Color
            </Button>
            <input
              ref={colorInputRef}
              type="color"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              className="hidden"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
