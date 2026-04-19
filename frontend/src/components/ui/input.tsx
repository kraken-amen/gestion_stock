import * as React from "react"

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={`flex h-12 w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-md transition-all placeholder:text-white/40 focus-visible:outline-none focus-visible:border-white/50 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    ref={ref}
    {...props}
  />
))

export { Input }