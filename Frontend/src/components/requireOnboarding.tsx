// src/components/RequireOnboarding.tsx
import { useRestaurant } from "#hooks/useRestaurant"
import { Navigate} from "react-router-dom"

export default function RequireOnboarding({ children }: { children: React.ReactNode })  {
  const { restaurant, loading } = useRestaurant()

  if (loading) return <div>Loading...</div>
  if (restaurant) return <Navigate to="/dashboard" replace />  // ← already onboarded

  return <>{children}</>
}