import { useState, useEffect, useRef } from "react"
import { Button } from "#components/ui/button"
import { Input } from "#components/ui/input"
import { Label } from "#components/ui/label"
import { Textarea } from "#components/ui/textarea"
import { Switch } from "#components/ui/switch"
import { Badge } from "#components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "#components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "#components/ui/alert-dialog"
import {
  Plus,
  Pencil,
  Trash2,
  ImagePlus,
  X,
  UtensilsCrossed,
  FolderPlus,
} from "lucide-react"
import { supabase } from "#lib/supabase"
import { uploadImage } from "#lib/uploadImage"
import { AppHeader } from "#components/dashboardHeader"
import { Loading } from "#components/loading"

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Category {
  id: string
  name: string
  sort_order: number
}

interface MenuItem {
  id: string
  name: string
  description: string | null
  ingredients: string | null
  price: number
  img_url: string | null
  is_available: boolean
  category_id: string | null
}

// ─── Menu Item Card ────────────────────────────────────────────────────────────

interface MenuCardProps {
  item: MenuItem
  category?: Category
  onEdit: (item: MenuItem) => void
  onDelete: (item: MenuItem) => void
  onToggle: (item: MenuItem) => void
}

function MenuCard({ item, category, onEdit, onDelete, onToggle }: MenuCardProps) {
  return (
    <div
      className={`group relative rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 active:scale-[0.98] ${
        !item.is_available ? "opacity-55" : ""
      }`}
    >
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {item.img_url ? (
          <img
            src={item.img_url}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <UtensilsCrossed className="h-10 w-10 text-muted-foreground/20" />
          </div>
        )}

        {category && (
          <div className="absolute top-2.5 left-2.5">
            <Badge variant="secondary" className="text-[11px] px-2 py-0.5 bg-background/85 backdrop-blur-sm border-0 font-medium">
              {category.name}
            </Badge>
          </div>
        )}

        <div className="absolute top-2.5 right-2.5 flex gap-1.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(item)}
            className="w-8 h-8 rounded-lg bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background active:scale-95 transition-all shadow-sm"
            aria-label="Edit item"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="w-8 h-8 rounded-lg bg-background/90 backdrop-blur-sm flex items-center justify-center text-destructive hover:bg-background active:scale-95 transition-all shadow-sm"
            aria-label="Delete item"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {!item.is_available && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-background/80 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-1 rounded-full border border-border">
              Unavailable
            </span>
          </div>
        )}
      </div>

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-foreground leading-snug text-sm">{item.name}</h3>
          <span className="text-primary font-bold text-sm whitespace-nowrap tabular-nums">
            ${item.price.toFixed(2)}
          </span>
        </div>
        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {item.description}
          </p>
        )}
        <div className="flex items-center justify-between pt-2.5 border-t border-border/60">
          <span className="text-xs text-muted-foreground">
            {item.is_available ? "Available" : "Off menu"}
          </span>
          <Switch
            checked={item.is_available}
            onCheckedChange={() => onToggle(item)}
            className="scale-90"
          />
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function MenuPage() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  const [itemDialogOpen, setItemDialogOpen] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null)

  const [form, setForm] = useState({
    name: "", description: "", ingredients: "", price: "", category_id: "", is_available: true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [newCategoryName, setNewCategoryName] = useState("")
  const [isSavingCategory, setIsSavingCategory] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: restaurant } = await supabase
        .from("restaurants").select("id").eq("user_id", user.id).maybeSingle()

      if (!restaurant) return
      setRestaurantId(restaurant.id)

      const [{ data: cats }, { data: menuItems }] = await Promise.all([
        supabase.from("categories").select("*").eq("restaurant_id", restaurant.id).order("sort_order"),
        supabase.from("menu").select("*").eq("restaurant_id", restaurant.id).order("created_at"),
      ])

      setCategories(cats ?? [])
      setItems(menuItems ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filteredItems = activeCategory === "all"
    ? items
    : items.filter((i) => i.category_id === activeCategory)

  function openAdd() {
    setEditingItem(null)
    setForm({ name: "", description: "", ingredients: "", price: "", category_id: categories[0]?.id ?? "", is_available: true })
    setImageFile(null)
    setImagePreview(null)
    setItemDialogOpen(true)
  }

  function openEdit(item: MenuItem) {
    setEditingItem(item)
    setForm({
      name: item.name,
      description: item.description ?? "",
      ingredients: item.ingredients ?? "",
      price: item.price.toString(),
      category_id: item.category_id ?? "",
      is_available: item.is_available,
    })
    setImageFile(null)
    setImagePreview(item.img_url)
    setItemDialogOpen(true)
  }

  async function handleSaveItem() {
    if (!restaurantId) return
    setIsSaving(true)
    try {
      let img_url = editingItem?.img_url ?? null
      if (imageFile) img_url = await uploadImage(imageFile, "menu-items")

      const payload = {
        restaurant_id: restaurantId,
        name: form.name,
        description: form.description || null,
        ingredients: form.ingredients || null,
        price: parseFloat(form.price),
        category_id: form.category_id || null,
        is_available: form.is_available,
        img_url,
      }

      if (editingItem) {
        const { data } = await supabase.from("menu").update(payload).eq("id", editingItem.id).select().single()
        setItems((prev) => prev.map((i) => (i.id === editingItem.id ? data : i)))
      } else {
        const { data } = await supabase.from("menu").insert(payload).select().single()
        setItems((prev) => [...prev, data])
      }
      setItemDialogOpen(false)
    } catch (err) {
      console.error("Save failed:", err)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!deletingItem) return
    await supabase.from("menu").delete().eq("id", deletingItem.id)
    setItems((prev) => prev.filter((i) => i.id !== deletingItem.id))
    setDeleteDialogOpen(false)
    setDeletingItem(null)
  }

  async function toggleAvailability(item: MenuItem) {
    const { data } = await supabase
      .from("menu").update({ is_available: !item.is_available }).eq("id", item.id).select().single()
    setItems((prev) => prev.map((i) => (i.id === item.id ? data : i)))
  }

  async function handleSaveCategory() {
    if (!restaurantId || !newCategoryName.trim()) return
    setIsSavingCategory(true)
    try {
      const { data } = await supabase
        .from("categories")
        .insert({ restaurant_id: restaurantId, name: newCategoryName.trim(), sort_order: categories.length })
        .select().single()
      setCategories((prev) => [...prev, data])
      setNewCategoryName("")
      setCategoryDialogOpen(false)
    } catch (err) {
      console.error("Category save failed:", err)
    } finally {
      setIsSavingCategory(false)
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const headerActions = (
    <>
      <Button variant="outline" size="sm" onClick={() => setCategoryDialogOpen(true)} className="hidden sm:flex">
        <FolderPlus className="h-4 w-4 mr-1.5" />
        Category
      </Button>
      <Button size="sm" onClick={openAdd} className="hidden sm:flex">
        <Plus className="h-4 w-4 mr-1.5" />
        Add Item
      </Button>
      <button
        onClick={() => setCategoryDialogOpen(true)}
        className="sm:hidden w-10 h-10 rounded-xl border border-border bg-background flex items-center justify-center text-muted-foreground active:bg-muted transition-colors"
        aria-label="Add category"
      >
        <FolderPlus className="h-5 w-5" />
      </button>
      <button
        onClick={openAdd}
        className="sm:hidden w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground active:opacity-80 transition-opacity"
        aria-label="Add item"
      >
        <Plus className="h-5 w-5" />
      </button>
    </>
  )

  if (loading) return <Loading message="Loading menu…" />

  return (
    <div className="flex flex-col min-h-svh bg-background">
      <AppHeader actions={headerActions} />

      

      <main className="flex-1 container mx-auto px-4 py-4 pb-28 md:pb-8">
        {/* Category pills — sticky just below AppHeader */}
      <div className="top-[57px] z-30 mb-4 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex gap-2 px-4 py-2.5 overflow-x-auto scrollbar-none">
          {[
            { id: "all", name: "All", count: items.length },
            ...categories.map((c) => ({
              id: c.id, name: c.name,
              count: items.filter((i) => i.category_id === c.id).length,
            })),
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border active:scale-95 ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "border-border text-muted-foreground bg-background hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {cat.name} <span className="opacity-60">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-5">
              <UtensilsCrossed className="h-9 w-9 text-muted-foreground/40" />
            </div>
            <p className="text-foreground font-semibold text-lg mb-1">No items here</p>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              {activeCategory === "all" ? "Add your first menu item to get started" : "No items in this category yet"}
            </p>
            <Button onClick={openAdd} size="lg" className="rounded-xl px-6">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {filteredItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                category={categories.find((c) => c.id === item.category_id)}
                onEdit={openEdit}
                onDelete={(item) => { setDeletingItem(item); setDeleteDialogOpen(true) }}
                onToggle={toggleAvailability}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Add/Edit Item Dialog ───────────────────────────────────────────── */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent className="w-full max-w-lg mx-auto max-h-[92dvh] overflow-y-auto rounded-2xl p-0">
          <DialogHeader className="px-5 pt-5 pb-0">
            <DialogTitle className="text-lg">{editingItem ? "Edit Item" : "Add Menu Item"}</DialogTitle>
          </DialogHeader>

          <div className="px-5 py-4 space-y-4">
            <div>
              <Label className="mb-2 block text-sm">Photo</Label>
              {imagePreview ? (
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-border">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null) }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center active:scale-90 transition-transform"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-[16/9] rounded-xl border-2 border-dashed border-border bg-muted/20 flex flex-col items-center justify-center gap-2 active:bg-muted/40 transition-colors"
                >
                  <ImagePlus className="h-7 w-7 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Tap to upload photo</span>
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="item-name" className="text-sm">Name</Label>
                <Input id="item-name" placeholder="Grilled Salmon" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="item-price" className="text-sm">Price</Label>
                <Input id="item-price" type="number" step="0.01" inputMode="decimal" placeholder="0.00" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="h-11" />
              </div>
            </div>

            {categories.length > 0 && (
              <div className="space-y-1.5">
                <Label htmlFor="item-category" className="text-sm">Category</Label>
                <select
                  id="item-category"
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">No category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="item-description" className="text-sm">Description</Label>
              <Textarea id="item-description" placeholder="Short description..." className="resize-none" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="item-ingredients" className="text-sm">Ingredients</Label>
              <Textarea id="item-ingredients" placeholder="salmon, lemon butter, asparagus..." className="resize-none" rows={2} value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border p-3.5 bg-muted/20">
              <div>
                <p className="text-sm font-medium text-foreground">Available</p>
                <p className="text-xs text-muted-foreground">Visible on public menu</p>
              </div>
              <Switch checked={form.is_available} onCheckedChange={(v) => setForm({ ...form, is_available: v })} />
            </div>
          </div>

          <DialogFooter className="px-5 pb-5 pt-2 flex flex-row gap-2 border-t border-border">
            <Button variant="outline" onClick={() => setItemDialogOpen(false)} className="flex-1 h-11 rounded-xl">Cancel</Button>
            <Button onClick={handleSaveItem} disabled={isSaving || !form.name || !form.price} className="flex-1 h-11 rounded-xl">
              {isSaving ? "Saving…" : editingItem ? "Save Changes" : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Add Category Dialog ────────────────────────────────────────────── */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5 py-2">
            <Label htmlFor="cat-name" className="text-sm">Category name</Label>
            <Input
              id="cat-name"
              placeholder="e.g. Starters, Mains, Desserts"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveCategory()}
              className="h-11"
              autoFocus
            />
          </div>
          <DialogFooter className="flex flex-row gap-2">
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)} className="flex-1 h-11 rounded-xl">Cancel</Button>
            <Button onClick={handleSaveCategory} disabled={isSavingCategory || !newCategoryName.trim()} className="flex-1 h-11 rounded-xl">
              {isSavingCategory ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ────────────────────────────────────────────── */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deletingItem?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this item from your menu and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-2">
            <AlertDialogCancel className="flex-1 h-11 rounded-xl m-0">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="flex-1 h-11 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}