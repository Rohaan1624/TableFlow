import { CheckCircle2, UtensilsCrossed, ArrowRight } from "lucide-react"
import { Button } from "#components/ui/button"
import { Card, CardContent } from "#components/ui/card"
import { useNavigate } from "react-router-dom"
import { Header } from "#components/header"

export default function AccountConfirmedPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-border">
          <CardContent className="p-8 flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Email Confirmed
              </h1>
              <p className="text-muted-foreground">
                Your account has been verified successfully. You can now set up your restaurant and start using TableFlow POS.
              </p>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => navigate("/onboarding")}
            >
              Continue to Setup
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          TableFlow POS - Restaurant Management System
        </div>
      </footer>
    </div>
  )
}
