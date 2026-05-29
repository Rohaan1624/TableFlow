import { useState, useEffect, useCallback } from "react"
import { supabase } from "#lib/supabase"
import {
  Plus,
  Minus,
  X,
  Send,
  Trash2,
  PenLine,
  Check,
  ShoppingBag,
} from "lucide-react"

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
}

interface OrderLine {
  item: MenuItem
  qty: number
  note: string
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
            ? "bg-amber-50 border-amber-300 shadow-sm shadow-amber-100"
            : "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-sm"
          }
          ${editMode ? "opacity-60 cursor-default" : "cursor-pointer"}
        `}
      >
        <span
          className={`text-3xl font-black leading-none ${occupied ? "text-amber-800" : "text-zinc-700"}`}
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {table.number}
        </span>
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider ${occupied ? "text-amber-500" : "text-zinc-400"}`}
        >
          {occupied ? "occupied" : "free"}
        </span>
        {occupied && (
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-amber-400" />
        )}
      </button>

      {editMode && (
        <button
          onClick={onDelete}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md transition-transform active:scale-90"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

// ─── Order sheet ──────────────────────────────────────────────────────────────

function OrderSheet({
  table,
  restaurantId,
  onClose,
  onSent,
}: {
  table: Table
  restaurantId: string
  onClose: () => void
  onSent: (tableId: string) => void
}) {
  const [menu, setMenu]               = useState<MenuItem[]>([])
  const [menuLoading, setMenuLoading] = useState(true)
  const [lines, setLines]             = useState<OrderLine[]>([])
  const [sending, setSending]         = useState(false)
  const [sent, setSent]               = useState(false)

  // Fetch menu from Supabase
  useEffect(() => {
    if (!restaurantId) return
    supabase
      .from("menu")
      .select("id, name, price")
      .eq("restaurant_id", restaurantId)
      .eq("is_available", true)
      .order("name")
      .then(({ data, error }) => {
        if (error) console.error("Failed to fetch menu:", error)
        setMenu(data ?? [])
        setMenuLoading(false)
      })
  }, [restaurantId])

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
      // 1. Find the active reservation for this table
      const { data: reservation, error: resError } = await supabase
        .from("reservations")
        .select("id, restaurant_id")
        .eq("table_id", table.id)
        .is("closed_at", null)
        .order("seated_at", { ascending: false })
        .limit(1)
        .single()

      if (resError || !reservation) throw new Error("No active reservation for this table")

      // 2. Insert the order
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

      // 3. Insert all items
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
      setTimeout(() => { onSent(table.id); onClose() }, 900)

    } catch (err) {
      console.error("Failed to send order:", err)
      // TODO: show an error toast
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div
        className="relative z-10 w-full md:w-[460px] md:h-full bg-white md:border-l border-zinc-200 flex flex-col rounded-t-3xl md:rounded-none shadow-2xl md:shadow-none"
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag pill */}
        <div className="md:hidden pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1 rounded-full bg-zinc-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-zinc-100 shrink-0">
          <div>
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Table</p>
            <h2
              className="text-4xl font-black leading-none text-zinc-900"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {table.number}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 transition-colors">
            <X className="w-4 h-4 text-zinc-500" />
          </button>
        </div>

        {/* Menu items */}
        <div className="flex-1 overflow-y-auto px-4 pb-2">
          {menuLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-5 h-5 border-2 border-zinc-200 border-t-zinc-500 rounded-full animate-spin" />
            </div>
          ) : menu.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-sm text-zinc-400">No menu items available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 py-3">
              {menu.map((item) => {
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
                        ? "border-amber-300 bg-amber-50"
                        : "border-zinc-200 bg-zinc-50 hover:bg-white hover:border-zinc-300"
                      }
                    `}
                  >
                    <span className={`text-sm font-semibold leading-snug ${qty > 0 ? "text-amber-900" : "text-zinc-800"}`}>
                      {item.name}
                    </span>
                    <span className={`text-xs mt-0.5 ${qty > 0 ? "text-amber-600" : "text-zinc-400"}`}>
                      ${item.price}
                    </span>
                    {qty > 0 && (
                      <span
                        className="absolute top-2 right-2 w-5 h-5 rounded-full text-white text-[11px] font-bold flex items-center justify-center"
                        style={{ background: "var(--tf-accent)" }}
                      >
                        {qty}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Order summary */}
        {lines.length > 0 && (
          <div className="border-t border-zinc-100 px-4 pt-3 pb-2 shrink-0 bg-white">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Order</p>
            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
              {lines.map((line) => (
                <div key={line.item.id} className="flex items-center gap-2">
                  <span className="flex-1 text-sm text-zinc-700 truncate">{line.item.name}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => changeQty(line.item.id, -1)}
                      className="w-6 h-6 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3 text-zinc-600" />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold text-zinc-800">{line.qty}</span>
                    <button
                      onClick={() => changeQty(line.item.id, 1)}
                      className="w-6 h-6 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3 text-zinc-600" />
                    </button>
                  </div>
                  <span className="w-12 text-right text-sm font-medium text-zinc-600">
                    ${(line.item.price * line.qty).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Send button */}
        <div className="px-4 pb-6 pt-3 shrink-0">
          <button
            onClick={sendOrder}
            disabled={lines.length === 0 || sending || sent}
            className={`
              w-full h-14 rounded-2xl font-semibold text-base flex items-center justify-center gap-2
              transition-all active:scale-[0.98] disabled:opacity-40
              ${sent ? "bg-emerald-500 text-white" : "text-white"}
            `}
            style={!sent ? { background: lines.length === 0 ? "#d1d5db" : "var(--tf-accent)" } : {}}
          >
            {sent ? (
              <><Check className="w-5 h-5" /> Sent to kitchen!</>
            ) : sending ? (
              <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</>
            ) : (
              <><Send className="w-4 h-4" /> Send to kitchen · {itemCount > 0 ? `${itemCount} item${itemCount > 1 ? "s" : ""} · $${total}` : "empty"}</>
            )}
          </button>
        </div>
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
      .from("reservations").select("table_id").eq("restaurant_id", restaurant.id).eq("status", 0)

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

  const handleOrderSent = (tableId: string) => {
    setTables((prev) => prev.map((t) => t.id === tableId ? { ...t, status: "occupied" } : t))
  }

  const free     = tables.filter((t) => t.status === "free").length
  const occupied = tables.filter((t) => t.status === "occupied").length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-7 h-7 border-2 border-zinc-200 border-t-zinc-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-zinc-50">

      {/* ── Topbar ── */}
      <header className="flex items-center justify-between px-4 md:px-6 py-4 bg-white border-b border-zinc-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600">
              <ShoppingBag className="w-3 h-3" /> {free} free
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
              {occupied} occupied
            </span>
          </div>
        </div>

        <button
          onClick={() => setEditMode((v) => !v)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            editMode
              ? "bg-zinc-900 text-white"
              : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
          }`}
        >
          {editMode ? <><Check className="w-3.5 h-3.5" /> Done</> : <><PenLine className="w-3.5 h-3.5" /> Edit tables</>}
        </button>
      </header>

      {/* ── Grid ── */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
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
              className="aspect-square rounded-2xl border-2 border-dashed border-zinc-300 flex flex-col items-center justify-center gap-1 text-zinc-400 hover:border-zinc-400 hover:text-zinc-500 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="text-[10px] font-medium">Add</span>
            </button>
          )}

          {tables.length === 0 && !editMode && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-zinc-400" />
              </div>
              <p className="text-sm font-medium text-zinc-500">No tables yet</p>
              <button
                onClick={() => setEditMode(true)}
                className="text-xs font-semibold px-4 py-2 rounded-xl text-white"
                style={{ background: "var(--tf-accent)" }}
              >
                Add your first table
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Order sheet ── */}
      {activeTable && (
        <OrderSheet
          table={activeTable}
          restaurantId={restaurantId}
          onClose={() => setActiveTable(null)}
          onSent={handleOrderSent}
        />
      )}
    </div>
  )
}