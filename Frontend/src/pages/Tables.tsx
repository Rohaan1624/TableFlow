import { useState, useEffect, useCallback } from "react"
import { supabase } from "#lib/supabase"
import {
  Plus,
  Minus,
  X,
  Send,
  Trash2,
  Check,
  Edit,
  Users,
  UserRound,
  ChevronRight,
  Receipt,
  ShoppingBag,
  Search,
} from "lucide-react"
import { Loading } from "#components/loading"
import { AppHeader } from "#components/dashboardHeader"
import { Button } from "#components/ui/button"

// ─── Types ────────────────────────────────────────────────────────────────────

type TableStatus = "free" | "occupied"

interface Table {
  id: string
  number: number
  status: TableStatus
}

interface MenuItem {
  id: string
  name: string
  price: number
  category_id: string | null
  category_name: string | null
  category_sort: number
}

interface OrderLine {
  item: MenuItem
  qty: number
  note: string
}

interface Reservation {
  id: string
  restaurant_id: string
  customer_name: string | null
  party_size: number | null
}

interface ConsumedItem {
  name: string
  qty: number
  unit_price: number
  total: number
}

// ─── Table card ───────────────────────────────────────────────────────────────

function TableCard({
  table,
  editMode,
  onTap,
  onDelete,
}: {
  table: Table
  editMode: boolean
  onTap: () => void
  onDelete: () => void
}) {
  const occupied = table.status === "occupied"

  return (
    <div className="relative">
      <button
        onClick={editMode ? undefined : onTap}
        className={`
          w-full aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-1
          transition-all duration-150 active:scale-95 select-none
          ${occupied
            ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 shadow-sm"
            : "bg-card border-border hover:border-primary/40 hover:shadow-sm"
          }
          ${editMode ? "opacity-60 cursor-default" : "cursor-pointer"}
        `}
      >
        <span
          className={`text-3xl font-black leading-none ${occupied ? "text-amber-800 dark:text-amber-300" : "text-foreground"}`}
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {table.number}
        </span>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${occupied ? "text-amber-500 dark:text-amber-400" : "text-muted-foreground"}`}>
          {occupied ? "occupied" : "free"}
        </span>
        {occupied && (
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-amber-400" />
        )}
      </button>

      {editMode && (
        <button
          onClick={onDelete}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center shadow-md transition-transform active:scale-90"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

// ─── Step 1: Open Tab (free table) ───────────────────────────────────────────

function OpenTabStep({
  table,
  restaurantId,
  onTabOpened,
  onClose,
}: {
  table: Table
  restaurantId: string
  onTabOpened: (reservation: Reservation) => void
  onClose: () => void
}) {
  const [customerName, setCustomerName] = useState("")
  const [partySize, setPartySize]       = useState(1)
  const [loading, setLoading]           = useState(false)

  const openTab = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("reservations")
        .insert({
          restaurant_id: restaurantId,
          table_id:      table.id,
          status:        0,
          customer_name: customerName.trim() || null,
          party_size:    partySize,
        })
        .select("id, restaurant_id, customer_name, party_size")
        .single()

      if (error || !data) throw error
      onTabOpened(data)
    } catch (err) {
      console.error("Failed to open tab:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-border shrink-0">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Open tab · Table</p>
          <h2 className="text-4xl font-black leading-none text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>
            {table.number}
          </h2>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form */}
      <div className="px-5 py-6 flex flex-col gap-5">
        {/* Customer name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <UserRound className="w-3.5 h-3.5" /> Customer name
            <span className="font-normal normal-case tracking-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Johnson"
            className="w-full px-4 py-3 rounded-xl border border-input bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:bg-background transition-colors"
          />
        </div>

        {/* Party size */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Number of guests
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPartySize((p) => Math.max(1, p - 1))}
              className="w-10 h-10 rounded-xl border border-input bg-muted hover:bg-accent flex items-center justify-center transition-colors text-foreground"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-3xl font-black text-foreground w-10 text-center" style={{ fontFamily: "'Syne', sans-serif" }}>
              {partySize}
            </span>
            <button
              onClick={() => setPartySize((p) => p + 1)}
              className="w-10 h-10 rounded-xl border border-input bg-muted hover:bg-accent flex items-center justify-center transition-colors text-foreground"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-auto px-5 pb-6 pt-3 shrink-0">
        <button
          onClick={openTab}
          disabled={loading}
          className="w-full h-14 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 bg-primary text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50 hover:opacity-90"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>Open tab <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </>
  )
}

// ─── Step 2: Add items to tab ─────────────────────────────────────────────────

function AddOrderStep({
  table,
  reservation,
  restaurantId,
  onSent,
  onClose,
}: {
  table: Table
  reservation: Reservation
  restaurantId: string
  onSent: (tableId: string) => void
  onClose: () => void
}) {
  const [menu, setMenu]               = useState<MenuItem[]>([])
  const [menuLoading, setMenuLoading] = useState(true)
  const [lines, setLines]             = useState<OrderLine[]>([])
  const [sending, setSending]         = useState(false)
  const [sent, setSent]               = useState(false)
  const [search, setSearch]           = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    if (!restaurantId) return
    supabase
      .from("menu")
      .select("id, name, price, category_id, categories(name, sort_order)")
      .eq("restaurant_id", restaurantId)
      .eq("is_available", true)
      .order("name")
      .then(({ data, error }) => {
        if (error) console.error("Failed to fetch menu:", error)
        const mapped = (data ?? []).map((item: any) => ({
          id:            item.id,
          name:          item.name,
          price:         item.price,
          category_id:   item.category_id ?? null,
          category_name: item.categories?.name ?? null,
          category_sort: item.categories?.sort_order ?? 999,
        }))
        setMenu(mapped)
        setMenuLoading(false)
      })
  }, [restaurantId])

  // Derive sorted unique categories
  const categories = Array.from(
    new Map(
      menu
        .filter((i) => i.category_id)
        .map((i) => [i.category_id, { id: i.category_id!, name: i.category_name!, sort: i.category_sort }])
    ).values()
  ).sort((a, b) => a.sort - b.sort)

  // Filter by search + active category
  const filteredMenu = menu.filter((item) => {
    const matchesSearch   = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === null || item.category_id === activeCategory
    return matchesSearch && matchesCategory
  })

  // Group by category for display (only when not searching)
  const grouped: { label: string | null; items: MenuItem[] }[] = search
    ? [{ label: null, items: filteredMenu }]
    : categories.length === 0
    ? [{ label: null, items: filteredMenu }]
    : (() => {
        const map = new Map<string | null, MenuItem[]>()
        for (const item of filteredMenu) {
          const key = item.category_id
          if (!map.has(key)) map.set(key, [])
          map.get(key)!.push(item)
        }
        const result: { label: string | null; items: MenuItem[] }[] = []
        for (const cat of categories) {
          if (activeCategory !== null && cat.id !== activeCategory) continue
          const items = map.get(cat.id) ?? []
          if (items.length > 0) result.push({ label: cat.name, items })
        }
        const uncategorised = map.get(null) ?? []
        if (uncategorised.length > 0 && activeCategory === null) {
          result.push({ label: "Other", items: uncategorised })
        }
        return result
      })()

  const addItem = (item: MenuItem) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.item.id === item.id)
      if (existing) return prev.map((l) => l.item.id === item.id ? { ...l, qty: l.qty + 1 } : l)
      return [...prev, { item, qty: 1, note: "" }]
    })
  }

  const changeQty = (itemId: string, delta: number) => {
    setLines((prev) =>
      prev
        .map((l) => l.item.id === itemId ? { ...l, qty: l.qty + delta } : l)
        .filter((l) => l.qty > 0)
    )
  }

  const total     = lines.reduce((s, l) => s + l.item.price * l.qty, 0)
  const itemCount = lines.reduce((s, l) => s + l.qty, 0)

  const sendOrder = async () => {
    if (lines.length === 0) return
    setSending(true)
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          restaurant_id:  reservation.restaurant_id,
          reservation_id: reservation.id,
          status:         0,
          total:          +total.toFixed(2),
        })
        .select("id")
        .single()

      if (orderError || !order) throw orderError

      const { error: itemsError } = await supabase
        .from("items")
        .insert(
          lines.map((l) => ({
            order_id:   order.id,
            menu_id:    l.item.id,
            qty:        l.qty,
            unit_price: l.item.price,
            total:      +(l.item.price * l.qty).toFixed(2),
            notes:      l.note ?? null,
            status:     0,
          }))
        )

      if (itemsError) throw itemsError

      setSent(true)
      onSent(table.id)
    } catch (err) {
      console.error("Failed to send order:", err)
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-border shrink-0">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Table {table.number} · {reservation.customer_name ?? "Guest"} · {reservation.party_size} pax
          </p>
          <h2 className="text-2xl font-black leading-tight text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>
            Add to order
          </h2>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search bar */}
      <div className="px-4 pt-3 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-input bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:bg-background transition-colors"
          />
        </div>
      </div>

      {/* Category pills */}
      {!search && categories.length > 0 && (
        <div className="flex gap-2 px-4 pt-2 pb-1 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-colors
              ${activeCategory === null
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-colors
                ${activeCategory === cat.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Menu items */}
      <div className="flex-1 overflow-y-auto px-4 pb-2">
        {menuLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-5 h-5 border-2 border-border border-t-foreground rounded-full animate-spin" />
          </div>
        ) : filteredMenu.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-muted-foreground">
              {search ? `No items matching "${search}"` : "No menu items available"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-3">
            {grouped.map(({ label, items }) => (
              <div key={label ?? "__all__"}>
                {label && (
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-0.5">
                    {label}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {items.map((item) => {
                    const line = lines.find((l) => l.item.id === item.id)
                    const qty  = line?.qty ?? 0
                    return (
                      <button
                        key={item.id}
                        onClick={() => addItem(item)}
                        className={`
                          relative flex flex-col items-start p-3.5 rounded-xl border text-left
                          transition-all active:scale-95
                          ${qty > 0
                            ? "border-primary/50 bg-primary/10"
                            : "border-border bg-muted hover:bg-accent hover:border-border"
                          }
                        `}
                      >
                        <span className={`text-sm font-semibold leading-snug ${qty > 0 ? "text-primary" : "text-foreground"}`}>
                          {item.name}
                        </span>
                        <span className={`text-xs mt-0.5 ${qty > 0 ? "text-primary/70" : "text-muted-foreground"}`}>
                          ${item.price}
                        </span>
                        {qty > 0 && (
                          <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
                            {qty}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order summary */}
      {lines.length > 0 && (
        <div className="border-t border-border px-4 pt-3 pb-2 shrink-0 bg-card">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Order</p>
          <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
            {lines.map((line) => (
              <div key={line.item.id} className="flex items-center gap-2">
                <span className="flex-1 text-sm text-foreground truncate">{line.item.name}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => changeQty(line.item.id, -1)}
                    className="w-6 h-6 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3 h-3 text-foreground" />
                  </button>
                  <span className="w-5 text-center text-sm font-semibold text-foreground">{line.qty}</span>
                  <button
                    onClick={() => changeQty(line.item.id, 1)}
                    className="w-6 h-6 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3 h-3 text-foreground" />
                  </button>
                </div>
                <span className="w-12 text-right text-sm font-medium text-muted-foreground">
                  ${(line.item.price * line.qty).toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Send */}
      <div className="px-4 pb-6 pt-3 shrink-0">
        <button
          onClick={sendOrder}
          disabled={lines.length === 0 || sending || sent}
          className={`
            w-full h-14 rounded-2xl font-semibold text-base flex items-center justify-center gap-2
            transition-all active:scale-[0.98] disabled:opacity-40
            ${sent
              ? "bg-success text-white"
              : lines.length === 0
              ? "bg-muted text-muted-foreground"
              : "bg-primary text-primary-foreground hover:opacity-90"
            }
          `}
        >
          {sent ? (
            <><Check className="w-5 h-5" /> Sent to kitchen! · Tap X to close</>
          ) : sending ? (
            <><div className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" /> Sending…</>
          ) : (
            <><Send className="w-4 h-4" /> Send · {itemCount > 0 ? `${itemCount} item${itemCount > 1 ? "s" : ""} · $${total.toFixed(2)}` : "empty"}</>
          )}
        </button>
      </div>
    </>
  )
}

// ─── Occupied tab view ────────────────────────────────────────────────────────

type OccupiedView = "menu" | "bill"

function OccupiedTabSheet({
  table,
  restaurantId,
  onClose,
  onTabClosed,
}: {
  table: Table
  restaurantId: string
  onClose: () => void
  onTabClosed: (tableId: string) => void
}) {
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading]         = useState(true)
  const [view, setView]               = useState<OccupiedView>("menu")
  const [consumed, setConsumed]       = useState<ConsumedItem[]>([])
  const [grandTotal, setGrandTotal]   = useState(0)
  const [closing, setClosing]         = useState(false)
  const [closed, setClosed]           = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: res } = await supabase
        .from("reservations")
        .select("id, restaurant_id, customer_name, party_size")
        .eq("table_id", table.id)
        .is("closed_at", null)
        .order("seated_at", { ascending: false })
        .limit(1)
        .single()

      if (!res) { setLoading(false); return }
      setReservation(res)

      const { data: orders } = await supabase
        .from("orders")
        .select("id, total")
        .eq("reservation_id", res.id)

      if (orders && orders.length > 0) {
        const orderIds = orders.map((o) => o.id)
        const { data: items } = await supabase
          .from("items")
          .select("qty, unit_price, total, notes, menu:menu_id(name)")
          .in("order_id", orderIds)

        const aggregated: Record<string, ConsumedItem> = {}
        for (const item of items ?? []) {
          const name = (item.menu as any)?.name ?? "Unknown"
          if (aggregated[name]) {
            aggregated[name].qty   += item.qty
            aggregated[name].total += item.total
          } else {
            aggregated[name] = { name, qty: item.qty, unit_price: item.unit_price, total: item.total }
          }
        }
        setConsumed(Object.values(aggregated))
        setGrandTotal(orders.reduce((s, o) => s + (o.total ?? 0), 0))
      }

      setLoading(false)
    }
    load()
  }, [table.id])

  const closeTab = async () => {
    if (!reservation) return
    setClosing(true)
    try {
      await supabase
        .from("reservations")
        .update({ closed_at: new Date().toISOString(), status: 1 })
        .eq("id", reservation.id)

      setClosed(true)
      onTabClosed(table.id)
    } catch (err) {
      console.error("Failed to close tab:", err)
    } finally {
      setClosing(false)
    }
  }

  if (loading) return <Loading />

  if (!reservation) {
    return (
      <div className="flex-1 flex items-center justify-center px-5">
        <p className="text-sm text-muted-foreground">Could not load tab.</p>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-3 pb-3 border-b border-border shrink-0">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Table {table.number} · {reservation.party_size} pax
          </p>
          <h2 className="text-2xl font-black leading-tight text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>
            {reservation.customer_name ?? "Open tab"}
          </h2>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tab switcher */}
      <div className="flex px-4 pt-3 gap-2 shrink-0">
        <button
          onClick={() => setView("menu")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-colors
            ${view === "menu"
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" /> Add items
        </button>
        <button
          onClick={() => setView("bill")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-colors
            ${view === "bill"
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
        >
          <Receipt className="w-3.5 h-3.5" /> Bill
        </button>
      </div>

      {/* Content */}
      {view === "menu" ? (
        <AddOrderStep
          table={table}
          reservation={reservation}
          restaurantId={restaurantId}
          onSent={() => {}}
          onClose={onClose}
        />
      ) : (
        <>
          {/* Bill */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {consumed.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center mt-10">No items ordered yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {consumed.map((c) => (
                  <div key={c.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground w-5 text-center">{c.qty}×</span>
                      <span className="text-sm text-foreground">{c.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">${c.total.toFixed(2)}</span>
                  </div>
                ))}

                <div className="border-t border-border mt-3 pt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">Total</span>
                  <span className="text-xl font-black text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Close tab */}
          <div className="px-5 pb-6 pt-3 shrink-0">
            <button
              onClick={closeTab}
              disabled={closing || closed}
              className={`
                w-full h-14 rounded-2xl font-semibold text-base flex items-center justify-center gap-2
                transition-all active:scale-[0.98] disabled:opacity-50
                ${closed
                  ? "bg-success text-white"
                  : "bg-destructive text-white hover:opacity-90"
                }
              `}
            >
              {closed ? (
                <><Check className="w-5 h-5" /> Tab closed! · Tap X to close</>
              ) : closing ? (
                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Closing…</>
              ) : (
                <>Close tab · ${grandTotal.toFixed(2)}</>
              )}
            </button>
          </div>
        </>
      )}
    </>
  )
}

// ─── Master OrderSheet dispatcher ─────────────────────────────────────────────

type SheetStep = "open-tab" | "add-order"

function OrderSheet({
  table,
  restaurantId,
  onClose,
  onSent,
  onTabClosed,
}: {
  table: Table
  restaurantId: string
  onClose: () => void
  onSent: (tableId: string) => void
  onTabClosed: (tableId: string) => void
}) {
  const [step, setStep]               = useState<SheetStep>("open-tab")
  const [reservation, setReservation] = useState<Reservation | null>(null)

  const handleTabOpened = (res: Reservation) => {
    setReservation(res)
    setStep("add-order")
    onSent(table.id)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet — on mobile, sits above the fixed nav bar (≈64px); on lg+ it's a full-height side panel */}
      <div
        className="relative z-10 w-full md:w-[460px] md:h-full bg-card md:border-l border-border flex flex-col rounded-t-3xl md:rounded-none shadow-2xl md:shadow-none mb-16 lg:mb-0 max-h-[calc(92vh-4rem)] lg:max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag pill (mobile only) */}
        <div className="md:hidden pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
        </div>

        {table.status === "free" ? (
          step === "open-tab" ? (
            <OpenTabStep
              table={table}
              restaurantId={restaurantId}
              onTabOpened={handleTabOpened}
              onClose={onClose}
            />
          ) : (
            reservation && (
              <AddOrderStep
                table={table}
                reservation={reservation}
                restaurantId={restaurantId}
                onSent={onSent}
                onClose={onClose}
              />
            )
          )
        ) : (
          <OccupiedTabSheet
            table={table}
            restaurantId={restaurantId}
            onClose={onClose}
            onTabClosed={onTabClosed}
          />
        )}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function FloorView() {
  const [tables, setTables]             = useState<Table[]>([])
  const [restaurantId, setRestaurantId] = useState("")
  const [loading, setLoading]           = useState(true)
  const [editMode, setEditMode]         = useState(false)
  const [activeTable, setActiveTable]   = useState<Table | null>(null)

  const fetchTables = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: restaurant } = await supabase
      .from("restaurants").select("id, name").eq("user_id", user.id).maybeSingle()
    if (!restaurant) { setLoading(false); return }

    setRestaurantId(restaurant.id)

    const { data: dbTables } = await supabase
      .from("tables").select("id, number").eq("restaurant_id", restaurant.id).order("number")

    const { data: reservations } = await supabase
      .from("reservations").select("table_id").eq("restaurant_id", restaurant.id).is("closed_at", null)

    const occupiedIds = new Set((reservations ?? []).map((r) => r.table_id))

    setTables(
      (dbTables ?? []).map((t) => ({
        id:     t.id,
        number: t.number,
        status: occupiedIds.has(t.id) ? "occupied" : "free",
      }))
    )
    setLoading(false)
  }, [])

  useEffect(() => { fetchTables() }, [fetchTables])

  const addTable = async () => {
    if (!restaurantId) return
    const nextNumber = Math.max(...tables.map((t) => t.number), 0) + 1
    const { data } = await supabase
      .from("tables")
      .insert({ restaurant_id: restaurantId, number: nextNumber, capacity: 4, shape: "rect" })
      .select("id, number").single()
    if (data) setTables((prev) => [...prev, { id: data.id, number: data.number, status: "free" }])
  }

  const deleteTable = async (id: string) => {
    await supabase.from("tables").delete().eq("id", id)
    setTables((prev) => prev.filter((t) => t.id !== id))
  }

  const handleTableOccupied = (tableId: string) => {
    setTables((prev) => prev.map((t) => t.id === tableId ? { ...t, status: "occupied" } : t))
  }

  const handleTabClosed = (tableId: string) => {
    setTables((prev) => prev.map((t) => t.id === tableId ? { ...t, status: "free" } : t))
  }

  if (loading) return <Loading />

  return (
    <div className="flex flex-col h-full bg-background">
      <AppHeader actions={
        editMode
          ? <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" onClick={() => setEditMode(false)}>
              <Check className="w-4 h-4" />
            </Button>
          : <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" onClick={() => setEditMode(true)}>
              <Edit className="w-4 h-4" />
            </Button>
      } />

      <div className="container mx-auto px-4 py-8 flex-1 pb-24 lg:pb-8">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">

          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              editMode={editMode}
              onTap={() => setActiveTable(table)}
              onDelete={() => deleteTable(table.id)}
            />
          ))}

          {editMode && (
            <button
              onClick={addTable}
              className="aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="text-[10px] font-medium">Add</span>
            </button>
          )}

          {tables.length === 0 && !editMode && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No tables yet</p>
              <button
                onClick={() => setEditMode(true)}
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Add your first table
              </button>
            </div>
          )}
        </div>
      </div>

      {activeTable && (
        <OrderSheet
          table={activeTable}
          restaurantId={restaurantId}
          onClose={() => setActiveTable(null)}
          onSent={handleTableOccupied}
          onTabClosed={handleTabClosed}
        />
      )}
    </div>
  )
}