import { BookOpen, LayoutDashboard, Lightbulb, Users, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { to: "/menu",      icon: BookOpen,        label: "Menu"  },
    { to: "/tables",    icon: UtensilsCrossed, label: "Tables"},
    { to: "/staff",     icon: Users,           label: "Staff" },
]

export default function DesktopFooter() {
    return (
        <footer className="hidden md:block border-t border-border bg-card/50 mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/20">
                                <UtensilsCrossed className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-semibold text-foreground">TableFlow</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            The all-in-one platform to manage your restaurant operations with ease.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-medium text-foreground">Navigate</p>
                        <div className="flex flex-col gap-2">
                            {navItems.map(({ to, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick stats or tip */}
                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-medium text-foreground">Quick tip</p>
                        <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                <Lightbulb/> Keep your menu updated regularly to reflect seasonal changes and improve customer satisfaction.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-border pt-4 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} TableFlow. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Built for restaurateurs 
                    </p>
                </div>
            </div>
        </footer>
    )
}