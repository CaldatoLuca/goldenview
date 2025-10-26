"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "size-4 shrink-0 rounded-[4px] border border-transparent bg-orange-300/60",
        "focus:outline-none focus:ring-1 focus:ring-offset-0 focus:border-orange-100",
        "data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-100",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-200 ease-in-out focus:ring-0 cursor-pointer",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-orange-50"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
