import * as React from "react"
import { cn } from "#/lib/utils"

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input">
>(({ className, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      ref={ref}
      className={cn(
        "h-4 w-4 rounded border border-gray-300 text-primary accent-[var(--primary)] cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary2)] focus:ring-offset-1",
        className
      )}
      {...props}
    />
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
