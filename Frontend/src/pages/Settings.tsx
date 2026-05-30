// src/pages/Settings.tsx
import { useState, useRef, useEffect } from "react"
import { supabase } from "#lib/supabase"
import { uploadImage } from "#lib/uploadImage"
import { useTheme } from "#hooks/useTheme"
import { AppHeader } from "#components/dashboardHeader"
import { Button } from "#components/ui/button"
import { Input } from "#components/ui/input"
import { Label } from "#components/ui/label"
import { Textarea } from "#components/ui/textarea"
import {
  Building2,
  MapPin,
  ImageIcon,
  Upload,
  X,
  Check,
  Sun,
  Moon,
  LogOut,
  Trash2,
  Save,
  AlertTriangle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, description, children }: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

// ─── Field row ────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </Label>
      {children}
    </div>
  )
}

// ─── Save status ──────────────────────────────────────────────────────────────

type SaveStatus = "idle" | "saving" | "saved" | "error"

function SaveButton({ status, onClick }: { status: SaveStatus; onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      disabled={status === "saving" || status === "saved"}
      className={`transition-all ${
        status === "saved"
          ? "bg-success hover:bg-success text-white"
          : status === "error"
          ? "bg-destructive hover:bg-destructive text-white"
          : ""
      }`}
    >
      {status === "saving" ? (
        <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" /> Saving…</>
      ) : status === "saved" ? (
        <><Check className="w-4 h-4 mr-2" /> Saved</>
      ) : status === "error" ? (
        <><AlertTriangle className="w-4 h-4 mr-2" /> Failed</>
      ) : (
        <><Save className="w-4 h-4 mr-2" /> Save changes</>
      )}
    </Button>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const navigate    = useNavigate()
  const { dark, setDark } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Restaurant state
  const [restaurantId, setRestaurantId] = useState("")
  const [name, setName]               = useState("")
  const [address, setAddress]         = useState("")
  const [logoUrl, setLogoUrl]         = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile]       = useState<File | null>(null)

  const [loading, setLoading]         = useState(true)
  const [infoStatus, setInfoStatus]   = useState<SaveStatus>("idle")
  const [logoStatus, setLogoStatus]   = useState<SaveStatus>("idle")

  // ── Load restaurant ────────────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("restaurants")
        .select("id, name, address, logo_url")
        .eq("user_id", user.id)
        .maybeSingle()

      if (data) {
        setRestaurantId(data.id)
        setName(data.name ?? "")
        setAddress(data.address ?? "")
        setLogoUrl(data.logo_url ?? null)
      }
      setLoading(false)
    }
    load()
  }, [])

  // ── Logo picker ────────────────────────────────────────────────────────────

  const handleLogoPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setLogoPreview(reader.result as string)
    reader.readAsDataURL(file)
    setLogoStatus("idle")
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const saveLogo = async () => {
    if (!logoFile || !restaurantId) return
    setLogoStatus("saving")
    try {
      const url = await uploadImage(logoFile, "logos")
      await supabase
        .from("restaurants")
        .update({ logo_url: url })
        .eq("id", restaurantId)
      setLogoUrl(url)
      setLogoFile(null)
      setLogoPreview(null)
      setLogoStatus("saved")
      setTimeout(() => setLogoStatus("idle"), 2500)
    } catch (err) {
      console.error("Logo upload failed:", err)
      setLogoStatus("error")
      setTimeout(() => setLogoStatus("idle"), 2500)
    }
  }

  // ── Save restaurant info ───────────────────────────────────────────────────

  const saveInfo = async () => {
    if (!restaurantId) return
    setInfoStatus("saving")
    try {
      const { error } = await supabase
        .from("restaurants")
        .update({ name: name.trim(), address: address.trim() })
        .eq("id", restaurantId)

      if (error) throw error
      setInfoStatus("saved")
      setTimeout(() => setInfoStatus("idle"), 2500)
    } catch (err) {
      console.error("Save info failed:", err)
      setInfoStatus("error")
      setTimeout(() => setInfoStatus("idle"), 2500)
    }
  }

  // ── Logout ─────────────────────────────────────────────────────────────────

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-background">
        <AppHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-border border-t-foreground rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  const currentLogo = logoPreview ?? logoUrl

  return (
    <div className="flex flex-col h-full bg-background">
      <AppHeader />

      <div className="flex-1 overflow-y-auto pb-24 lg:pb-8">
        <div className="container mx-auto px-4 py-6 max-w-2xl flex flex-col gap-5">

          {/* ── Restaurant logo ── */}
          <Section
            title="Restaurant logo"
            description="Shown on your public menu and QR code."
          >
            <div className="flex items-center gap-4">
              {/* Preview */}
              <div
                className="w-20 h-20 rounded-2xl border-2 border-dashed border-border bg-muted flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {currentLogo ? (
                  <img
                    src={currentLogo}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-7 h-7 text-muted-foreground" />
                )}
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleLogoPick}
                />

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    {currentLogo ? "Change" : "Upload"}
                  </Button>

                  {logoPreview && (
                    <>
                      <SaveButton status={logoStatus} onClick={saveLogo} />
                      <Button variant="ghost" size="sm" onClick={removeLogo}>
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}

                  {logoUrl && !logoPreview && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={async () => {
                        await supabase
                          .from("restaurants")
                          .update({ logo_url: null })
                          .eq("id", restaurantId)
                        setLogoUrl(null)
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Remove
                    </Button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  JPG, PNG or WebP · Max 5MB
                </p>
              </div>
            </div>
          </Section>

          {/* ── Restaurant info ── */}
          <Section
            title="Restaurant details"
            description="Basic information about your restaurant."
          >
            <div className="flex flex-col gap-4">
              <Field label="Restaurant name">
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    value={name}
                    onChange={(e) => { setName(e.target.value); setInfoStatus("idle") }}
                    placeholder="e.g. La Trattoria"
                    className="pl-9"
                  />
                </div>
              </Field>

              <Field label="Address">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Textarea
                    value={address}
                    onChange={(e) => { setAddress(e.target.value); setInfoStatus("idle") }}
                    placeholder="123 Main St, City"
                    className="pl-9 resize-none"
                    rows={2}
                  />
                </div>
              </Field>

              <div className="flex justify-end">
                <SaveButton status={infoStatus} onClick={saveInfo} />
              </div>
            </div>
          </Section>

          {/* ── Appearance ── */}
          <Section
            title="Appearance"
            description="Choose how the app looks."
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDark(false)}
                className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all
                  ${!dark
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted hover:border-border/80"
                  }`}
              >
                <Sun className={`w-5 h-5 ${!dark ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-xs font-semibold ${!dark ? "text-primary" : "text-muted-foreground"}`}>
                  Light
                </span>
                {!dark && <span className="text-[10px] text-primary/70 font-medium">Active</span>}
              </button>

              <button
                onClick={() => setDark(true)}
                className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all
                  ${dark
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted hover:border-border/80"
                  }`}
              >
                <Moon className={`w-5 h-5 ${dark ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-xs font-semibold ${dark ? "text-primary" : "text-muted-foreground"}`}>
                  Dark
                </span>
                {dark && <span className="text-[10px] text-primary/70 font-medium">Active</span>}
              </button>
            </div>
          </Section>

          {/* ── Account ── */}
          <Section title="Account">
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full justify-start text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Button>
            </div>
          </Section>

        </div>
      </div>
    </div>
  )
}