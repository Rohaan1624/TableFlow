import { useEffect, useState } from "react"
import { supabase } from "#lib/supabase"

export function useRestaurant() {
  const [restaurant, setRestaurant] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("restaurants")
        .select("*")
        .single()

      setRestaurant(data)
      setLoading(false)
    }
    fetch()
  }, [])

  return { restaurant, loading }
}