"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  UtensilsCrossed, 
  Building2, 
  MapPin, 
  Upload, 
  ArrowRight, 
  Check,
  ImageIcon,
  X
} from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  
  // Form state
  const [restaurantName, setRestaurantName] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogo(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogo(null)
    setLogoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate saving - in production, save to database
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    router.push("/dashboard")
  }

  const isStep1Valid = restaurantName.trim().length > 0
  const isStep2Valid = address.trim().length > 0 && city.trim().length > 0

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">TableFlow</h1>
              <p className="text-xs text-muted-foreground">Restaurant POS System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-lg">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      currentStep > step
                        ? "bg-primary text-primary-foreground"
                        : currentStep === step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step ? <Check className="h-4 w-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-12 h-0.5 mx-2 transition-colors ${
                        currentStep > step ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Step {currentStep} of 3
            </p>
          </div>

          <Card className="border-border bg-card shadow-2xl shadow-black/20">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold text-foreground">
                {currentStep === 1 && "Set Up Your Restaurant"}
                {currentStep === 2 && "Add Your Location"}
                {currentStep === 3 && "Add Your Logo"}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {currentStep === 1 && "Let's get your restaurant configured"}
                {currentStep === 2 && "Where is your restaurant located?"}
                {currentStep === 3 && "Give your POS a personal touch (optional)"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Restaurant Name */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="restaurant-name" className="text-foreground">
                        Restaurant Name
                      </Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="restaurant-name"
                          type="text"
                          placeholder="The Golden Fork"
                          className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                          value={restaurantName}
                          onChange={(e) => setRestaurantName(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={!isStep1Valid}
                      onClick={() => setCurrentStep(2)}
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Step 2: Address */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-foreground">
                        Street Address
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          id="address"
                          placeholder="123 Main Street, Suite 100"
                          className="pl-10 min-h-[80px] bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-foreground">
                          City
                        </Label>
                        <Input
                          id="city"
                          type="text"
                          placeholder="San Francisco"
                          className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipcode" className="text-foreground">
                          ZIP Code
                        </Label>
                        <Input
                          id="zipcode"
                          type="text"
                          placeholder="94102"
                          className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 border-border text-foreground hover:bg-muted"
                        onClick={() => setCurrentStep(1)}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={!isStep2Valid}
                        onClick={() => setCurrentStep(3)}
                      >
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Logo Upload */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Restaurant Logo</Label>
                      <p className="text-sm text-muted-foreground">
                        Upload your logo to personalize your POS system
                      </p>
                    </div>
                    
                    {logoPreview ? (
                      <div className="relative w-full aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden border border-border">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="max-w-full max-h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full aspect-video bg-muted/50 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/70 hover:border-primary/50 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-foreground font-medium">
                          Click to upload
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    )}
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 border-border text-foreground hover:bg-muted"
                        onClick={() => setCurrentStep(2)}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          "Setting up..."
                        ) : (
                          <>
                            {logo ? "Complete Setup" : "Skip & Finish"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground/60">
              You can update these details later in settings
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
