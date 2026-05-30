import { LogOut, Settings, UtensilsCrossed, ArrowLeft, QrCode } from "lucide-react"
import { ThemeToggle } from "./themeToggle"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { supabase } from "#lib/supabase"

const handleLogout = () => {
  supabase.auth.signOut().then(() => {
    window.location.href = "/"
  })
}

// ─── Page config ──────────────────────────────────────────────────────────────
// Add new pages here — title, whether to show back button, subtitle

const PAGE_CONFIG: Record<string, { title: string; subtitle: string; showBack?: boolean }> = {
  "/dashboard": { title: "TableFlow",  subtitle: "Dashboard" },
  "/menu":      { title: "Menu",       subtitle: "Manage your items", showBack: true },
  "/tables":    { title: "Tables",     subtitle: "Floor overview",    showBack: true },
  "/qr-code":   { title: "QR Code",  subtitle: "Your public menu QR code", showBack: true },
  "/kitchen":   { title: "Kitchen",      subtitle: "Your kitchen view",         showBack: true },
  "/settings":  { title: "Settings",   subtitle: "Preferences",       showBack: true },
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface AppHeaderProps {
  // Optional action buttons rendered on the right (e.g. Add Item, Add Category)
  actions?: React.ReactNode
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AppHeader({ actions }: AppHeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const config = PAGE_CONFIG[location.pathname] ?? { title: "TableFlow", subtitle: "" }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">

          {/* Left — back button or logo */}
          <div className="flex items-center gap-3">
            {config.showBack ? (
              <button
                onClick={() => navigate(-1)}
                className="w-9 h-9 rounded-xl border border-border bg-background/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/15">
                <UtensilsCrossed className="h-4.5 w-4.5 text-primary" />
              </div>
            )}

            <div className="leading-tight">
              <h1 className="text-base font-semibold text-foreground leading-none">
                {config.title}
              </h1>
              {config.subtitle && (
                <p className="text-[11px] text-muted-foreground mt-0.5">{config.subtitle}</p>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1.5">
            {/* Page-specific actions (e.g. Add Item button on Menu page) */}
            {actions && <div className="flex items-center gap-1.5">{actions}</div>}

            {/* Always-present desktop controls */}
            <div className="hidden md:flex items-center gap-1 ml-1 pl-2 border-l border-border">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-primary/10 hover:text-primary"
              >
                <Link to="/qr-code">
                  <QrCode className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-primary/10 hover:text-primary"
              >
                <Link to="/settings">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}