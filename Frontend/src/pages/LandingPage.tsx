// src/pages/LandingPage.tsx
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UtensilsCrossed, ChefHat, Zap, QrCode, Bell, Moon, ArrowRight, Check, Menu, X } from "lucide-react"
import { useTheme } from "#hooks/useTheme"

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { dark, setDark } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"}`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <UtensilsCrossed className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight">
            Table<span className="text-primary">Flow</span>
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {dark ? <Sun /> : <Moon className="w-4 h-4" />}
          </button>
          <Link
            to="/auth"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
          >
            Log in
          </Link>
          <Link
            to="/auth?tab=signup"
            className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Start free trial
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-6 pb-6 flex flex-col gap-4">
          <a href="#features" className="text-sm text-muted-foreground py-2" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#how" className="text-sm text-muted-foreground py-2" onClick={() => setMobileOpen(false)}>How it works</a>
          <a href="#pricing" className="text-sm text-muted-foreground py-2" onClick={() => setMobileOpen(false)}>Pricing</a>
          <Link to="/auth" className="text-sm text-center py-2.5 border border-border rounded-xl text-foreground">Log in</Link>
          <Link to="/auth?tab=signup" className="text-sm text-center py-2.5 bg-primary text-primary-foreground rounded-xl font-medium">Start free trial</Link>
        </div>
      )}
    </nav>
  )
}

function Sun() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const navigate = useNavigate()
  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative">
        

        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-[1.02] mb-6"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Your restaurant,<br />
          <span className="text-primary">finally in control.</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10 font-light">
          TableFlow connects your floor, kitchen, and menu in one place.
          Stop losing orders to chaos. Start turning tables faster.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate("/auth?tab=signup")}
            className="group flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl text-base font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/25"
          >
            Start your 7-day free trial
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="flex items-center gap-2 border border-border text-foreground px-8 py-4 rounded-2xl text-base font-medium hover:bg-muted transition-colors"
          >
            Log in to your account
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-5">
          No credit card required to start · Cancel anytime · $19.99/month after trial
        </p>
      </div>

      {/* Mock UI preview */}
      <div className="max-w-5xl mx-auto mt-20 relative">
        <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
          {/* Fake browser bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-4 bg-background rounded-lg px-3 py-1 text-xs text-muted-foreground border border-border">
              app.tableflow.io/tables
            </div>
          </div>
          {/* Fake floor grid */}
          <div className="p-6 bg-background">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Floor overview</p>
                <p className="text-xl font-black text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>Tables</p>
              </div>
              <div className="flex gap-2">
                <span className="text-xs bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full font-medium">5 occupied</span>
                <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">7 free</span>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {[
                { n: 1, occ: true },  { n: 2, occ: false }, { n: 3, occ: true },
                { n: 4, occ: true },  { n: 5, occ: false }, { n: 6, occ: false },
                { n: 7, occ: true },  { n: 8, occ: false }, { n: 9, occ: false },
                { n: 10, occ: true }, { n: 11, occ: false },{ n: 12, occ: false },
              ].map(({ n, occ }) => (
                <div key={n} className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-1 relative
                  ${occ ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700" : "bg-card border-border"}`}
                >
                  {occ && <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  <span className={`text-base font-black leading-none ${occ ? "text-amber-800 dark:text-amber-300" : "text-foreground"}`}
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >{n}</span>
                  <span className={`text-[8px] font-semibold uppercase tracking-wider ${occ ? "text-amber-500" : "text-muted-foreground"}`}>
                    {occ ? "busy" : "free"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function Stats() {
  const items = [
    { num: "2 min", label: "order to kitchen, average" },
    { num: "34%", label: "more tables turned per shift" },
    { num: "0", label: "lost orders on TableFlow" },
    { num: "10 min", label: "to set up your restaurant" },
  ]
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border">
        {items.map(({ num, label }) => (
          <div key={label} className="px-8 py-10 text-center">
            <div className="text-3xl font-black text-foreground mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{num}</div>
            <div className="text-xs text-muted-foreground font-medium">{label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Features ────────────────────────────────────────────────────────────────

function Features() {
  const features = [
    {
      icon: <UtensilsCrossed className="w-5 h-5" />,
      title: "Live floor view",
      desc: "Every table at a glance — free, occupied, or waiting. Open tabs instantly with customer name and party size.",
      result: "40% less floor walking",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Instant ordering",
      desc: "Browse by category, search any item, send orders to the kitchen in seconds. No paper, no shouting, no mistakes.",
      result: "Zero lost orders",
    },
    {
      icon: <ChefHat className="w-5 h-5" />,
      title: "Kitchen display",
      desc: "Live orders appear the moment they're placed. One tap to mark items done. Flame alerts for orders waiting too long.",
      result: "28% faster ticket times",
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: "Push notifications",
      desc: "Add to homescreen and kitchen staff get alerts for new orders even with the screen off. No app store needed.",
      result: "Never miss an order",
    },
    {
      icon: <QrCode className="w-5 h-5" />,
      title: "QR public menu",
      desc: "A beautiful, mobile-optimized menu page your guests can scan. Always in sync with your live menu.",
      result: "Guests order faster",
    },
    {
      icon: <Moon className="w-5 h-5" />,
      title: "Built for night shifts",
      desc: "Dark mode that actually works. Your staff's eyes will thank you after an 8-hour dinner service.",
      result: "Less eye strain",
    },
  ]

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">What you get</p>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Everything your team needs.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto font-light">
            No bloated enterprise software. No 6-month onboarding. TableFlow works the way your restaurant actually works.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {features.map(({ icon, title, desc, result }) => (
            <div key={title} className="bg-card p-8 hover:bg-muted/30 transition-colors flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1.5">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
              <div className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-primary">
                <span>↑</span> {result}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    { n: "01", title: "Create your account", desc: "Sign up, name your restaurant, upload a logo. Two minutes, done." },
    { n: "02", title: "Build your menu", desc: "Add items by category with prices. Your QR menu goes live instantly." },
    { n: "03", title: "Map your floor", desc: "Add tables with a tap. Rearrange anytime — no IT, no downtime." },
    { n: "04", title: "Start your service", desc: "Open tabs, send orders, watch the kitchen move. You're in control." },
  ]

  return (
    <section id="how" className="py-24 px-6 bg-muted/20 border-y border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">How it works</p>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Up and running before<br />your lunch rush.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-border" />
          {steps.map(({ n, title, desc }, i) => (
            <div key={n} className="flex flex-col items-center text-center gap-4 relative">
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-black text-lg relative z-10
                ${i === 0
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-card border-border text-foreground"
                }`}
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {n}
              </div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  const testis = [
    {
      stars: 5,
      text: "We used to lose 2–3 orders every Friday night. With TableFlow, that number is ",
      highlight: "zero.",
      rest: " Our kitchen finally knows what's happening on the floor.",
      name: "Marco Reyes",
      role: "Owner, La Fogata — Panama City",
      initials: "MR",
      color: "bg-primary",
    },
    {
      stars: 5,
      text: "Set it up during prep before a Saturday dinner service. ",
      highlight: "My waiters were using it that same night.",
      rest: " I've never onboarded software this fast.",
      name: "Sofia Chen",
      role: "GM, Harbour Kitchen — Miami",
      initials: "SC",
      color: "bg-emerald-600",
    },
    {
      stars: 5,
      text: "The kitchen display is a game changer. ",
      highlight: "We've cut ticket times by almost a third.",
      rest: " My chefs see orders the second a waiter sends them.",
      name: "Diego Morales",
      role: "Head Chef, Sal y Pimienta — Bogotá",
      initials: "DM",
      color: "bg-amber-700",
    },
  ]

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Real restaurants, real results</p>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            They stopped drowning.<br />Now they're thriving.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testis.map(({ stars, text, highlight, rest, name, role, initials, color }) => (
            <div key={name} className="bg-card border border-border rounded-2xl p-7 flex flex-col gap-5 hover:-translate-y-1 transition-transform">
              <div className="text-amber-400 text-sm tracking-widest">{"★".repeat(stars)}</div>
              <p className="text-foreground text-sm leading-relaxed font-light flex-1">
                "{text}<strong className="font-semibold text-primary">{highlight}</strong>{rest}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function Pricing() {
  const navigate = useNavigate()
  const perks = [
    "Unlimited tables",
    "Full menu management",
    "Live kitchen display",
    "QR public menu",
    "Push notifications (PWA)",
    "Dark mode for night shifts",
    "Real-time floor view",
    "Priority support",
  ]

  return (
    <section id="pricing" className="py-24 px-6 bg-foreground">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Pricing</p>
        <h2 className="text-4xl md:text-5xl font-black text-background tracking-tight mb-4"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          One plan.<br />Everything included.
        </h2>
        <p className="text-muted-foreground font-light mb-12">
          No tiers, no feature gates. Every restaurant gets the full product.
        </p>

        <div className="bg-background/5 border border-background/10 rounded-2xl p-8 mb-8">
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-6xl font-black text-background" style={{ fontFamily: "'Syne', sans-serif" }}>$19</span>
            <span className="text-2xl font-black text-background" style={{ fontFamily: "'Syne', sans-serif" }}>.99</span>
            <span className="text-muted-foreground text-sm">/month</span>
          </div>
          <p className="text-muted-foreground text-sm mb-8">after your 7-day free trial</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
            {perks.map((p) => (
              <div key={p} className="flex items-center gap-2.5 text-sm text-background/80">
                <Check className="w-4 h-4 text-primary shrink-0" />
                {p}
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/auth?tab=signup")}
            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Start your 7-day free trial
          </button>
          <p className="text-muted-foreground text-xs mt-4">
            No credit card required · Cancel anytime · Billed via Stripe
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTA() {
  const navigate = useNavigate()
  return (
    <section className="py-24 px-6 bg-primary">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-black text-primary-foreground tracking-tight mb-4"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Your next service runs smoother than this one.
        </h2>
        <p className="text-primary-foreground/70 text-lg font-light mb-10">
          Join hundreds of restaurants that stopped running on chaos.
        </p>
        <button
          onClick={() => navigate("/auth?tab=signup")}
          className="bg-background text-foreground px-10 py-4 rounded-2xl text-base font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Get started free — 7 days on us
        </button>
        <p className="text-primary-foreground/50 text-xs mt-4">No credit card · No commitment · Cancel anytime</p>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary/15 flex items-center justify-center">
            <UtensilsCrossed className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-bold text-foreground">Table<span className="text-primary">Flow</span></span>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
        </div>
        <p className="text-xs text-muted-foreground/50">© 2026 TableFlow. All rights reserved.</p>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTA />
      <LandingFooter />
    </div>
  )
}