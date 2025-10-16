import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "bg-orange-300/60 py-2 px-3 rounded-md text-orange-50 focus:outline-none focus:ring-1",
        "focus:ring-offset-0 placeholder:text-orange-100 placeholder:opacity-70 disabled:cursor-not-allowed",
        "disabled:opacity-50 border border-transparent focus:border-orange-100 focus:shadow-none transition-all duration-200 ease-in-out",
        className
      )}
      {...props}
    />
  );
}

export { Input };
