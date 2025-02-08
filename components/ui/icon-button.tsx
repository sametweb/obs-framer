import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as React from "react";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-8 w-8", className)}
        ref={ref}
        {...props}
      />
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton };
