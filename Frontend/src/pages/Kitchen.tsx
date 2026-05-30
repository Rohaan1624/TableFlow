// src/pages/KitchenView.tsx
import { useState, useEffect, useRef, useCallback } from "react"
import { supabase } from "#lib/supabase"
import { AppHeader } from "#components/dashboardHeader"
import { Loading } from "#components/loading"
import { Bell, BellOff, CheckCheck, ChefHat, Clock, Flame } from "lucide-react"
import { registerServiceWorker, requestPushPermission, sendLocalNotification } from "#hooks/usePushNotifications"

// ─── Types ────────────────────────────────────────────────────────────────────

interface KitchenItem {
  id: string
  menu_name: string
  qty: number
  notes: string | null
  status: number  // 0 = pending, 1 = done
}

interface KitchenOrder {
  id: string
  table_number: number
  customer_name: string | null
  time_placed: string
  items: KitchenItem[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60)  return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

function isUrgent(iso: string) {
  return (Date.now() - new Date(iso).getTime()) > 10 * 60 * 1000 // > 10 min
}

// ─── Item row ─────────────────────────────────────────────────────────────────

function ItemRow({
  item,
  onToggle,
}: {
  item: KitchenItem
  onToggle: (id: string, current: number) => void
}) {
  const done = item.status === 1

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 transition-all duration-200
        ${done ? "opacity-40" : "opacity-100"}`}
    >
      {/* Done toggle */}
      <button
        onClick={() => onToggle(item.id, item.status)}
        className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all active:scale-90
          ${done
            ? "bg-success border-success text-white"
            : "border-border bg-background hover:border-primary hover:bg-primary/5"
          }`}
      >
        {done && <CheckCheck className="w-3.5 h-3.5" />}
      </button>

      {/* Name + notes */}
      <div className="flex-1 min-w-0">
        <span className={`text-sm font-semibold ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
          {item.qty > 1 && (
            <span className="mr-1.5 text-primary font-black">{item.qty}×</span>
          )}
          {item.menu_name}
        </span>
        {item.notes && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 truncate">
            ✎ {item.notes}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Order card ───────────────────────────────────────────────────────────────

function OrderCard({
  order,
  onToggleItem,
}: {
  order: KitchenOrder
  onToggleItem: (itemId: string, current: number) => void
}) {
  const pending   = order.items.filter((i) => i.status === 0)
  const done      = order.items.filter((i) => i.status === 1)
  const allDone   = pending.length === 0
  const urgent    = isUrgent(order.time_placed) && !allDone

  return (
    <div
      className={`rounded-2xl border flex flex-col overflow-hidden transition-all duration-300
        ${allDone
          ? "border-border bg-muted opacity-60"
          : urgent
          ? "border-amber-400 dark:border-amber-600 bg-card shadow-md shadow-amber-100 dark:shadow-amber-950/40"
          : "border-border bg-card shadow-sm"
        }`}
    >
      {/* Card header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b border-border
        ${urgent && !allDone ? "bg-amber-50 dark:bg-amber-950/30" : ""}`}
      >
        <div className="flex items-center gap-2.5">
          {urgent && !allDone && (
            <Flame className="w-4 h-4 text-amber-500 shrink-0" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>
                Table {order.table_number}
              </span>
              {order.customer_name && (
                <span className="text-xs text-muted-foreground font-medium">· {order.customer_name}</span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className={`text-xs font-medium ${urgent && !allDone ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>
                {timeAgo(order.time_placed)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress pill */}
        <div className={`px-2.5 py-1 rounded-full text-xs font-bold
          ${allDone
            ? "bg-success/15 text-success"
            : "bg-primary/10 text-primary"
          }`}
        >
          {allDone ? "All done" : `${done.length}/${order.items.length}`}
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-border">
        {/* Pending first */}
        {pending.map((item) => (
          <ItemRow key={item.id} item={item} onToggle={onToggleItem} />
        ))}
        {/* Done items below */}
        {done.map((item) => (
          <ItemRow key={item.id} item={item} onToggle={onToggleItem} />
        ))}
      </div>
    </div>
  )
}

// ─── Notification permission banner ───────────────────────────────────────────

function NotificationBanner({
  permission,
  onRequest,
}: {
  permission: NotificationPermission | null
  onRequest: () => void
}) {
  if (permission === "granted" || permission === null) return null

  if (permission === "denied") {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 bg-muted border-b border-border text-xs text-muted-foreground">
        <BellOff className="w-3.5 h-3.5 shrink-0" />
        Notifications blocked — enable them in browser settings to get alerts for new orders.
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800">
      <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
        <Bell className="w-3.5 h-3.5 shrink-0" />
        Enable notifications to get alerts for new orders even when the screen is off.
      </div>
      <button
        onClick={onRequest}
        className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
      >
        Enable
      </button>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function KitchenView() {
  const [orders, setOrders]           = useState<KitchenOrder[]>([])
  const [restaurantId, setRestaurantId] = useState("")
  const [loading, setLoading]         = useState(true)
  const [permission, setPermission]   = useState<NotificationPermission | null>(null)
  const [showDone, setShowDone]       = useState(false)
  const knownOrderIds                 = useRef<Set<string>>(new Set())
  const knownItemIds                  = useRef<Set<string>>(new Set())

  // ── Fetch all active orders ──────────────────────────────────────────────

  const fetchOrders = useCallback(async (restId: string) => {
    try {
    // Get all open reservations (no embedded join — fetch tables separately)
    const { data: reservations } = await supabase
      .from("reservations")
      .select("id, table_id, customer_name")
      .eq("restaurant_id", restId)
      .is("closed_at", null)

    if (!reservations?.length) { setOrders([]); setLoading(false); return }

    // Fetch table numbers separately to avoid FK join issues
    const tableIds = [...new Set(reservations.map((r) => r.table_id))]
    const { data: tables } = await supabase
      .from("tables")
      .select("id, number")
      .in("id", tableIds)

    const tableMap = new Map((tables ?? []).map((t) => [t.id, t.number]))

    const reservationIds = reservations.map((r) => r.id)

    // Get all orders for those reservations that aren't fully served
    const { data: rawOrders } = await supabase
      .from("orders")
      .select("id, reservation_id, time_placed")
      .in("reservation_id", reservationIds)
      .order("time_placed", { ascending: true })

    if (!rawOrders?.length) { setOrders([]); setLoading(false); return }

    const orderIds = rawOrders.map((o) => o.id)

    // Get all items
    const { data: rawItems } = await supabase
      .from("items")
      .select("id, order_id, qty, notes, status, menu:menu_id(name)")
      .in("order_id", orderIds)

    // Build KitchenOrder[]
    const resMap = new Map(reservations.map((r) => [r.id, r]))

    const built: KitchenOrder[] = rawOrders.map((order) => {
      const res   = resMap.get(order.reservation_id)
      const items = (rawItems ?? [])
        .filter((i) => i.order_id === order.id)
        .map((i) => ({
          id:        i.id,
          menu_name: (i.menu as any)?.name ?? "Unknown",
          qty:       i.qty,
          notes:     i.notes,
          status:    i.status,
        }))

      return {
        id:            order.id,
        table_number:  tableMap.get(res?.table_id ?? "") ?? "?",
        customer_name: res?.customer_name ?? null,
        time_placed:   order.time_placed,
        items,
      }
    }).filter((o) => o.items.length > 0)

    // Track known IDs for realtime diffing
    built.forEach((o) => {
      knownOrderIds.current.add(o.id)
      o.items.forEach((i) => knownItemIds.current.add(i.id))
    })

    setOrders(built)
    } catch (err) {
      console.error("fetchOrders error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Bootstrap ────────────────────────────────────────────────────────────

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle()

      if (!restaurant) { setLoading(false); return }
      setRestaurantId(restaurant.id)
      await fetchOrders(restaurant.id)

      // Init service worker
      await registerServiceWorker()
      if ("Notification" in window) {
        setPermission(Notification.permission)
      }
    }
    init()
  }, [fetchOrders])

  // ── Realtime subscription ─────────────────────────────────────────────────

  useEffect(() => {
    if (!restaurantId) return

    const channel = supabase
      .channel("kitchen-realtime")
      // New order inserted
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders", filter: `restaurant_id=eq.${restaurantId}` },
        async (payload) => {
          const orderId = payload.new.id
          if (knownOrderIds.current.has(orderId)) return
          knownOrderIds.current.add(orderId)

          // Notify
          if (Notification.permission === "granted") {
            sendLocalNotification(
              "🍽 New order!",
              `Order placed — tap to view`,
              `order-${orderId}`
            )
          }

          await fetchOrders(restaurantId)
        }
      )
      // New item inserted (added to existing order/tab)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "items" },
        async (payload) => {
          const itemId = payload.new.id
          if (knownItemIds.current.has(itemId)) return
          knownItemIds.current.add(itemId)

          // Only notify if this item belongs to one of our orders
          const orderId = payload.new.order_id
          if (!knownOrderIds.current.has(orderId)) return

          if (Notification.permission === "granted") {
            sendLocalNotification(
              "➕ Item added",
              `New item added to an existing order`,
              `item-${itemId}`
            )
          }

          await fetchOrders(restaurantId)
        }
      )
      // Item status updated (e.g. marked done from another device)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "items" },
        () => { fetchOrders(restaurantId) }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [restaurantId, fetchOrders])

  // ── Tick every 30s to refresh time labels ─────────────────────────────────

  useEffect(() => {
    const interval = setInterval(() => setOrders((prev) => [...prev]), 30_000)
    return () => clearInterval(interval)
  }, [])

  // ── Toggle item done/pending ──────────────────────────────────────────────

  const toggleItem = async (itemId: string, current: number) => {
    const next = current === 0 ? 1 : 0

    // Optimistic update
    setOrders((prev) =>
      prev.map((order) => ({
        ...order,
        items: order.items.map((i) =>
          i.id === itemId ? { ...i, status: next } : i
        ),
      }))
    )

    await supabase
      .from("items")
      .update({ status: next })
      .eq("id", itemId)
  }

  // ── Request notifications ─────────────────────────────────────────────────

  const requestNotifications = async () => {
    const perm = await requestPushPermission()
    setPermission(perm)
  }

  // ── Derived display lists ─────────────────────────────────────────────────

  const activeOrders = orders.filter((o) => o.items.some((i) => i.status === 0))
  const doneOrders   = orders.filter((o) => o.items.every((i) => i.status === 1))

  const pendingCount = orders.reduce(
    (sum, o) => sum + o.items.filter((i) => i.status === 0).length,
    0
  )

  if (loading) return <Loading />

  return (
    <div className="flex flex-col h-full bg-background">
      <AppHeader
        actions={
          <div className="flex items-center gap-1.5">
            {/* Pending badge */}
            {pendingCount > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                <Flame className="w-3 h-3" />
                {pendingCount} pending
              </span>
            )}
          </div>
        }
      />

      {/* Notification banner */}
      <NotificationBanner permission={permission} onRequest={requestNotifications} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24 lg:pb-6">

        {orders.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full gap-4 py-24 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <ChefHat className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">All quiet in the kitchen</p>
              <p className="text-sm text-muted-foreground mt-1">New orders will appear here in real time.</p>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-5 flex flex-col gap-3">

            {/* Active orders */}
            {activeOrders.length > 0 && (
              <>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-0.5">
                  Active · {activeOrders.length}
                </p>
                {activeOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onToggleItem={toggleItem}
                  />
                ))}
              </>
            )}

            {/* Completed orders (collapsible) */}
            {doneOrders.length > 0 && (
              <div className="mt-2">
                <button
                  onClick={() => setShowDone((p) => !p)}
                  className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-0.5 mb-2 hover:text-foreground transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Completed · {doneOrders.length}
                  <span className="text-[10px] normal-case tracking-normal font-normal">
                    {showDone ? "· hide" : "· show"}
                  </span>
                </button>

                {showDone && (
                  <div className="flex flex-col gap-3">
                    {doneOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onToggleItem={toggleItem}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}