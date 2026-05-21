import { DashboardHeader } from "#components/dashboardHeader";
import { BookOpen, Users, UtensilsCrossed, LayoutDashboard, UtensilsCrossed as Logo, Lightbulb } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NavLink, Link } from "react-router-dom";

export default function Dashboard() {
    return (
        <div className="flex flex-col min-h-svh">
            <DashboardHeader />
            <main className="container mx-auto px-4 py-8 flex-1 pb-24 md:pb-8">
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold">Welcome Back</h2>
                    <p className="text-muted-foreground">Manage your restaurant operations from one place.</p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard icon={BookOpen} title="Menu" description="Manage dishes, categories, and pricing" />
                    <FeatureCard icon={UtensilsCrossed} title="Tables" description="Track table availability and reservations" />
                    <FeatureCard icon={Users} title="Staff" description="Manage your team and their schedules" />
                </section>
            </main>

            <DesktopFooter />
            <MobileNav />
        </div>
    )
}

interface FeatureCardProps {
    icon: LucideIcon
    title: string
    description: string
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
    return (
        <div className="border border-border rounded-lg p-6 flex flex-col items-center text-center gap-3">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10">
                <Icon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    )
}

const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { to: "/menu",      icon: BookOpen,        label: "Menu"  },
    { to: "/tables",    icon: UtensilsCrossed, label: "Tables"},
    { to: "/staff",     icon: Users,           label: "Staff" },
]

function DesktopFooter() {
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

function MobileNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-card/80 backdrop-blur-sm">
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