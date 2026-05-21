import { LogOut, Settings, UtensilsCrossed } from "lucide-react";
import { ThemeToggle } from "./themeToggle";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { supabase } from "#lib/supabase";

const handleLogout = () => {
  // Implement your logout logic here, e.g., clearing tokens, redirecting, etc.
  supabase.auth.signOut().then(() => {
    // Redirect to login page or show a message
    window.location.href = "/";
  });
}

export function DashboardHeader(){
    return(
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            
            {/* Left — logo + title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 ">
                <UtensilsCrossed className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">TableFlow</h1>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </div>

            {/* Right — desktop only */}
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle  />
              <Button variant="ghost" size="icon" asChild>
                <Link to="/settings" className="hover:!bg-primary hover:text-primary-foreground ">
                  <Settings className="h-4 w-4 "/>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="hover:!bg-primary hover:text-primary-foreground" onClick={handleLogout}>
                <LogOut className="h-4 w-4 hover:!bg-primary" />
              </Button>
            </div>

          </div>
        </div>
      </header>
    )
}
