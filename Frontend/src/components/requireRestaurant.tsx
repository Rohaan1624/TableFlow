import { useRestaurant } from "#hooks/useRestaurant"
import { Navigate } from "react-router-dom"

export default function RequireRestaurant({ children }: { children: React.ReactNode }) {
  const { restaurant, loading } = useRestaurant()

  if (loading) return <div>Loading...</div>
  if (!restaurant) return <Navigate to="/onboarding" replace />

  return <>{children}</>
}