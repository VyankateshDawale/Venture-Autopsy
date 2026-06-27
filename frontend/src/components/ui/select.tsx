import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, Check } from "lucide-react"

interface SelectContextType {
  value?: string
  onValueChange?: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
  items: Record<string, React.ReactNode>
  registerItem: (value: string, label: React.ReactNode) => void
}

const SelectContext = React.createContext<SelectContextType | null>(null)

export function Select({
  children,
  value,
  onValueChange,
}: {
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [items, setItems] = React.useState<Record<string, React.ReactNode>>({})
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const registerItem = React.useCallback((val: string, label: React.ReactNode) => {
    setItems((prev) => {
      if (prev[val] === label) return prev
      return { ...prev, [val]: label }
    })
  }, [])

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (open && triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener("click", handler)
    return () => window.removeEventListener("click", handler)
  }, [open])

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, triggerRef, items, registerItem }}>
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectTrigger must be used within a Select")
  
  return (
    <button
      ref={context.triggerRef}
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectValue must be used within a Select")
  
  const displayValue = context.value ? context.items[context.value] : null
  
  // Format raw value nicely if items aren't registered in context yet
  const fallbackLabel = context.value
    ? context.value
        .split(/[_-]/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : null;
  
  return <span className="truncate">{displayValue || fallbackLabel || placeholder}</span>
}

export function SelectContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectContent must be used within a Select")
  if (!context.open) return null

  return (
    <div
      className={cn(
        "absolute z-50 min-w-[8rem] w-full overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-md animate-in fade-in-80 slide-in-from-top-1 dark:border-slate-800 dark:bg-[#111114] dark:text-slate-50 mt-1",
        className
      )}
      {...props}
    >
      <div className="p-1 max-h-60 overflow-y-auto">{children}</div>
    </div>
  )
}

export function SelectItem({
  className,
  children,
  value,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectItem must be used within a Select")

  const { registerItem } = context
  React.useEffect(() => {
    registerItem(value, children)
  }, [value, children, registerItem])

  const isSelected = context.value === value

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        context.onValueChange?.(value)
        context.setOpen(false)
      }}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:hover:bg-white/10 dark:hover:text-slate-50 dark:focus:bg-white/10 dark:focus:text-slate-50 cursor-pointer",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      <span className="truncate">{children}</span>
    </div>
  )
}
