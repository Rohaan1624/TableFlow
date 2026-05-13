import { useTheme } from "#hooks/useTheme"
import { Button } from "./ui/button"

export function ThemeToggle() {
  const { dark, setDark } = useTheme()

  return (
    <Button onClick={() => setDark(!dark)}>
      {dark ? "Light mode" : "Dark mode"}
    </Button>
  )
}