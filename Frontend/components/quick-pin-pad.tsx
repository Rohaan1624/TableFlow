"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Delete, LogIn, Loader2 } from "lucide-react"

export function QuickPinPad() {
  const [pin, setPin] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + num)
    }
  }

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1))
  }

  const handleClear = () => {
    setPin("")
  }

  const handleSubmit = async () => {
    if (pin.length >= 4) {
      setIsLoading(true)
      // Simulate login
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsLoading(false)
      setPin("")
    }
  }

  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"]

  return (
    <div className="space-y-6">
      {/* PIN Display */}
      <div className="flex justify-center gap-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all duration-200 ${
              i < pin.length
                ? "bg-primary scale-110"
                : "bg-muted border border-border"
            }`}
          />
        ))}
      </div>

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-3">
        {numbers.map((num) => (
          <Button
            key={num}
            type="button"
            variant={num === "C" ? "destructive" : "secondary"}
            className={`h-14 text-xl font-semibold transition-all active:scale-95 ${
              num === "⌫"
                ? "bg-secondary hover:bg-secondary/80"
                : num === "C"
                ? "bg-destructive/20 text-destructive hover:bg-destructive/30"
                : "bg-secondary hover:bg-secondary/80"
            }`}
            onClick={() => {
              if (num === "⌫") {
                handleDelete()
              } else if (num === "C") {
                handleClear()
              } else {
                handleNumberClick(num)
              }
            }}
          >
            {num === "⌫" ? <Delete className="h-5 w-5" /> : num}
          </Button>
        ))}
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
        disabled={pin.length < 4 || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Quick Clock In
          </>
        )}
      </Button>
    </div>
  )
}
