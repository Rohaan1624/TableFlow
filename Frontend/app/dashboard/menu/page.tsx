"use client"

import { useState } from "react"
import { ArrowLeft, BookOpen, Clock, Wifi, Pencil, Plus, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface MenuItem {
  id: string
  name: string
  price: number
  ingredients: string
  image: string
}

const initialMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Grilled Salmon",
    price: 28.99,
    ingredients: "Fresh Atlantic salmon, lemon butter, asparagus, roasted potatoes",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    name: "Beef Tenderloin",
    price: 34.99,
    ingredients: "Prime beef tenderloin, red wine reduction, truffle mashed potatoes, seasonal vegetables",
    image: "https://images.unsplash.com/photo-1546833998-877b37c2e4c6?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    name: "Margherita Pizza",
    price: 18.99,
    ingredients: "San Marzano tomatoes, fresh mozzarella, basil, extra virgin olive oil",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    name: "Caesar Salad",
    price: 14.99,
    ingredients: "Romaine lettuce, parmesan, croutons, house-made Caesar dressing",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=300&fit=crop",
  },
  {
    id: "5",
    name: "Lobster Risotto",
    price: 38.99,
    ingredients: "Maine lobster, arborio rice, white wine, parmesan, fresh herbs",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop",
  },
  {
    id: "6",
    name: "Chocolate Lava Cake",
    price: 12.99,
    ingredients: "Dark chocolate, vanilla ice cream, raspberry coulis, mint",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop",
  },
]

export default function MenuPage() {
  const router = useRouter()
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    ingredients: "",
    image: "",
  })

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) return
    
    const item: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name,
      price: parseFloat(newItem.price),
      ingredients: newItem.ingredients,
      image: newItem.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    }
    
    setMenuItems([...menuItems, item])
    setNewItem({ name: "", price: "", ingredients: "", image: "" })
    setIsAddDialogOpen(false)
  }

  const handleDeleteItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Menu</h1>
                  <p className="text-xs text-muted-foreground">{menuItems.length} items</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={isEditMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsEditMode(!isEditMode)}
                className="gap-2"
              >
                {isEditMode ? (
                  <>
                    <X className="h-4 w-4" />
                    Done
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4" />
                    Edit Menu
                  </>
                )}
              </Button>
              <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-primary" />
                  <span>Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono">
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="container mx-auto">
          {/* Add New Item Button (Edit Mode) */}
          {isEditMode && (
            <div className="mb-6">
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add New Item
              </Button>
            </div>
          )}

          {/* Menu Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Card
                key={item.id}
                className="bg-card border-border overflow-hidden group relative"
              >
                {isEditMode && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground text-lg">{item.name}</h3>
                    <span className="text-primary font-bold text-lg">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.ingredients}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {menuItems.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">No menu items</h2>
              <p className="text-muted-foreground mb-4">
                Click &quot;Edit Menu&quot; to start adding items.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add New Menu Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Name</Label>
              <Input
                id="name"
                placeholder="e.g., Grilled Salmon"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-foreground">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="e.g., 24.99"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ingredients" className="text-foreground">Ingredients</Label>
              <Textarea
                id="ingredients"
                placeholder="List the main ingredients..."
                value={newItem.ingredients}
                onChange={(e) => setNewItem({ ...newItem, ingredients: e.target.value })}
                className="bg-input border-border text-foreground resize-none"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image" className="text-foreground">Image URL (optional)</Label>
              <Input
                id="image"
                placeholder="https://..."
                value={newItem.image}
                onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                className="bg-input border-border text-foreground"
              />
              {newItem.image && (
                <div className="mt-2 rounded-lg overflow-hidden border border-border">
                  <img
                    src={newItem.image}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem} disabled={!newItem.name || !newItem.price}>
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Bar */}
      <footer className="border-t border-border bg-card/50 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>System Online</span>
            </div>
            <span className="text-border">|</span>
            <span>Last sync: Just now</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
