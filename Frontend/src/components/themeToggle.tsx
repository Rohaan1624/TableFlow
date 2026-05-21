import { useTheme } from "#hooks/useTheme"
import { Moon, Sun } from "lucide-react"
import { Button } from "./ui/button"

export function ThemeToggle() {
  const { dark, setDark } = useTheme()

  return (
    <Button className="hover:!bg-primary hover:text-primary-foreground" variant="ghost" size="icon" onClick={() => setDark(!dark)}>
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}