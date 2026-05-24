import { AppHeader } from "#components/dashboardHeader";
import DesktopFooter from "#components/desktopFooter";
import MobileNav from "#components/mobileNav";
import { BookOpen, Users, UtensilsCrossed, LayoutDashboard, UtensilsCrossed as Logo, Lightbulb } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NavLink, Link } from "react-router-dom";

export default function Dashboard() {
    return (
        <>
        <AppHeader />
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
        </>
            
            
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
