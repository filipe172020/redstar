import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "fblock w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-none placeholder:text-gray-400 border focus:ring-2 focus:ring-red-500 sm:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
