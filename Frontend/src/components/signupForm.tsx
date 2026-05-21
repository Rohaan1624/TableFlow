import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle, User } from "lucide-react"
import { useState } from "react"
import { Label } from "./ui/label"
import { supabase } from "#lib/supabase"

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" })
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState<String>("")


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccess("")

    if (formData.password !== formData.confirmPassword) {
      setErrors({ password: "Passwords do not match" })
      return
    }

    setIsLoading(true)
      try {
        // Replace with your actual auth call
        const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName, // ← stored in auth.users raw_user_meta_data
          },
        },
      })
      
      
      if (error) {
        setErrors({ general: error.message })
      } else {
        setSuccess("Signup successful! Please check your email to confirm your account.")
      }
    } catch {
      setErrors({ general: "Something went wrong. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const hasFieldError = (field: keyof FormErrors) => !!errors[field]

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      
      {/* General / banner error */}
      {errors.general && (
        <div className="flex items-start gap-2.5 rounded-md border border-destructive/40 bg-destructive/10 px-3.5 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2.5 rounded-md border border-success/40 bg-success/10 px-3.5 py-3 text-sm text-success">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-1.5">
        <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
          Full Name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className={`pl-10 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary `}
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          Email address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`pl-10 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary ${
              hasFieldError("email") ? "border-destructive focus:border-destructive focus:ring-destructive" : ""
            }`}
          />
        </div>
        {errors.email && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={`pl-10 pr-10 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary ${
              hasFieldError("password") ? "border-destructive focus:border-destructive focus:ring-destructive" : ""
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {errors.password}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
          Confirm Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className={`pl-10 pr-10 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {errors.password}
          </p>
        )}
      </div>


      {/* Submit */}
      <Button
        type="submit"
        className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account…
          </>
        ) : (
          "Create account"
        )}
      </Button>

    </form>
  )
}