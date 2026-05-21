import { useRestaurant } from "#hooks/useRestaurant"
import { Navigate } from "react-router-dom"
import { Loading } from "./loading"

export default function RequireRestaurant({ children }: { children: React.ReactNode }) {
  const { restaurant, loading } = useRestaurant()

  if (loading) return <Loading />
  if (!restaurant) return <Navigate to="/onboarding" replace />
  
  return <>{children}</>
}