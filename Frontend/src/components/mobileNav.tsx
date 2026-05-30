import { BookOpen, LayoutDashboard, Users, UtensilsCrossed } from "lucide-react"
import { NavLink } from "react-router-dom"

const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { to: "/menu",      icon: BookOpen,        label: "Menu"  },
    { to: "/tables",    icon: UtensilsCrossed, label: "Tables"},
    { to: "/staff",     icon: Users,           label: "Staff" },
]

export default function MobileNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border bg-card/80 backdrop-blur-sm">
            <div className="flex items-center justify-around py-2">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            }`
                        }
                    >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs font-medium">{label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    )
}