import { UtensilsCrossed } from "lucide-react";
import { ThemeToggle } from "./themeToggle";

export function Header(){
    return(
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">TableFlow</h1>
              <p className="text-xs text-muted-foreground">Restaurant POS System</p>
            </div>
          </div>
        </div>
      </header>
    )
}
