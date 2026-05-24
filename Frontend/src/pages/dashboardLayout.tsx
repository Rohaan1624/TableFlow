// src/components/dashboardLayout.tsx
import { Outlet } from "react-router-dom"
import MobileNav from "#components/mobileNav"
import DesktopFooter from "#components/desktopFooter"
import { AppHeader } from "#components/dashboardHeader"

export function DashboardLayout() {
  return (
    <div className="flex flex-col min-h-svh">
      <main className="flex-1 pb-24 md:pb-8">
        <Outlet /> {/* ← each page renders here */}
      </main>
      <DesktopFooter />
      <MobileNav />
    </div>
  )
}