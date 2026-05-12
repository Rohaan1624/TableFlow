"use client"

import { useState } from "react"
import { Settings, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const colorSchemes = [
  {
    id: "dark-green" as const,
    name: "Dark Emerald",
    description: "Dark theme with green accents",
    preview: {
      bg: "bg-[#1a1a2e]",
      primary: "bg-[#4ade80]",
      card: "bg-[#252540]",
    },
  },
  {
    id: "pastel-pink" as const,
    name: "Pastel Rose",
    description: "Soft pink pastel theme",
    preview: {
      bg: "bg-[#fdf2f4]",
      primary: "bg-[#f472b6]",
      card: "bg-[#ffffff]",
    },
  },
  {
    id: "pastel-blue" as const,
    name: "Pastel Sky",
    description: "Calming blue pastel theme",
    preview: {
      bg: "bg-[#f0f7ff]",
      primary: "bg-[#60a5fa]",
      card: "bg-[#ffffff]",
    },
  },
  {
    id: "pastel-lavender" as const,
    name: "Pastel Lavender",
    description: "Gentle lavender pastel theme",
    preview: {
      bg: "bg-[#f5f3ff]",
      primary: "bg-[#a78bfa]",
      card: "bg-[#ffffff]",
    },
  },
]

export function SettingsDialog() {
  const { colorScheme, setColorScheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize the appearance of your POS system.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h4 className="text-sm font-medium mb-3">Color Scheme</h4>
            <div className="grid grid-cols-2 gap-3">
              {colorSchemes.map((scheme) => (
                <button
                  key={scheme.id}
                  onClick={() => setColorScheme(scheme.id)}
                  className={cn(
                    "relative p-3 rounded-lg border-2 transition-all text-left",
                    colorScheme === scheme.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {colorScheme === scheme.id && (
                    <div className="absolute top-2 right-2">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className="flex gap-1.5 mb-2">
                    <div className={cn("w-6 h-6 rounded", scheme.preview.bg)} />
                    <div className={cn("w-6 h-6 rounded", scheme.preview.primary)} />
                    <div className={cn("w-6 h-6 rounded border", scheme.preview.card)} />
                  </div>
                  <p className="text-sm font-medium">{scheme.name}</p>
                  <p className="text-xs text-muted-foreground">{scheme.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
