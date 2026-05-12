"use client"

import { UtensilsCrossed, Clock, Wifi, LogOut, BookOpen, Grid3X3, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SettingsDialog } from "@/components/settings-dialog"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
                <UtensilsCrossed className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">TableFlow</h1>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
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
              <SettingsDialog />
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground">
              Manage your restaurant operations from one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card 
              className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group"
              onClick={() => router.push("/dashboard/menu")}
            >
              <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">Menu</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage dishes, categories, and pricing
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group"
              onClick={() => router.push("/dashboard/tables")}
            >
              <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Grid3X3 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">Tables</h3>
                  <p className="text-sm text-muted-foreground">
                    View and manage table assignments
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group"
              onClick={() => router.push("/dashboard/orders")}
            >
              <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <ClipboardList className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">Orders</h3>
                  <p className="text-sm text-muted-foreground">
                    Track and process customer orders
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
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
            <span className="text-border">|</span>
            <span>
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
