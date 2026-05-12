"use client"

import { ArrowLeft, Grid3X3, Clock, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function TablesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard")}
                className="text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px] active:scale-95 transition-transform"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
                  <Grid3X3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Tables</h1>
                  <p className="text-xs text-muted-foreground">Manage table assignments</p>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-primary" />
                <span>Online</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-mono">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-full bg-muted mx-auto flex items-center justify-center">
            <Grid3X3 className="h-12 w-12 sm:h-10 sm:w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl sm:text-xl font-bold text-foreground">Table Management</h2>
          <p className="text-base sm:text-sm text-muted-foreground max-w-md px-4">
            This is where you will view and manage table layouts and assignments.
          </p>
        </div>
      </main>

      {/* Status Bar */}
      <footer className="border-t border-border bg-card/50 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>System Online</span>
            </div>
            <span className="text-border">|</span>
            <span>Last sync: Just now</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
