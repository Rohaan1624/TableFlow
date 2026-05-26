import { supabase } from "#lib/supabase";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

interface MenuItem {
  name: string;
  description: string;
  price: string;
  image: string;
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
}

interface RestaurantInfo {
  name: string;
  address: string;
}

interface PublicMenuRow {
  item_name: string;
  item_description: string | null;
  item_price: number | string | null;
  item_url: string | null;
  restaurant_id: string;
  restaurant_name: string;
  restaurant_address: string | null;
  restaurant_logo: string | null;
  category_id: string | null;
  category_name: string | null;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop";

function formatPrice(value: number | string | null | undefined) {
  const numeric = typeof value === "number" ? value : Number(value ?? 0);

  if (!Number.isFinite(numeric)) {
    return "$0.00";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numeric);
}

function buildMenuCategories(rows: PublicMenuRow[]) {
  const categories = new Map<string, MenuCategory>();

  rows.forEach((row) => {
    const title = row.category_name?.trim() || "Uncategorized";

    if (!categories.has(title)) {
      categories.set(title, { title, items: [] });
    }

    categories.get(title)?.items.push({
      name: row.item_name,
      description: row.item_description || "",
      price: formatPrice(row.item_price),
      image: row.item_url || DEFAULT_IMAGE,
    });
  });

  return Array.from(categories.values()).sort((a, b) =>
    a.title.localeCompare(b.title),
  );
}

export default function RestaurantMenuTemplate() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: "Restaurant Name",
    address: "Bella Vista, Panama",
  });

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2] text-neutral-900">
        <p className="text-xl font-semibold">No restaurant ID provided.</p>
      </div>
    );
  }

  const hasMenuItems = useMemo(() => menu.some((category) => category.items.length > 0), [menu]);

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchMenu = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("public_menu")
        .select(
          "item_name,item_description,item_price,item_url,restaurant_id,restaurant_name,restaurant_address,restaurant_logo,category_id,category_name",
        )
        .eq("restaurant_id", id)
        .order("category_name", { ascending: true })
        .order("item_name", { ascending: true });

      if (error) {
        console.error("Error fetching menu:", error);
        setMenu([]);
        setLoading(false);
        return;
      }

      const rows = (data ?? []) as PublicMenuRow[];
      const firstRow = rows[0];

      setRestaurantInfo({
        name: firstRow?.restaurant_name || "Restaurant Name",
        address: firstRow?.restaurant_address || "Bella Vista, Panama",
      });
      setMenu(buildMenuCategories(rows));
      setLoading(false);
    };

    fetchMenu();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#faf7f2] text-neutral-900">
      {/* HERO */}
      <section className="relative h-[70vh] overflow-hidden">
        <img
          src={DEFAULT_IMAGE}
          alt="Restaurant"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
          {/* Tagline of the restaurant */}
          {/* <div className="mb-6 rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md">
            <span className="text-sm tracking-[0.3em] uppercase">
              Fine Dining Experience
            </span>
          </div> */}

          <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
            {restaurantInfo.name}
          </h1>
            
            {/* Restaurant Motto */}
          {/* <p className="mt-6 max-w-2xl text-base text-white/80 md:text-lg">
            Elegant cuisine, premium ingredients, and a memorable atmosphere.
            {restaurantInfo.address ? ` Explore the menu at ${restaurantInfo.address}.` : ""}
          </p> */}
        </div>
      </section>

      {/* INFO BAR */}
      <section className="mx-auto -mt-12 max-w-6xl px-6 relative z-20">
        <div className="grid gap-4 rounded-[32px] border border-black/5 bg-white p-6 shadow-2xl shadow-black/10 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Location
            </p>
            <p className="mt-2 text-lg font-semibold">{restaurantInfo.address}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Opening Hours
            </p>
            <p className="mt-2 text-lg font-semibold">12:00 PM - 11:00 PM</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Contact
            </p>
            <p className="mt-2 text-lg font-semibold">+507 6000-0000</p>
          </div>
        </div>
      </section>

      {/* MENU SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-neutral-500">
            Our Menu
          </p>

          <h2 className="mt-4 text-4xl font-black md:text-5xl">
            Crafted With Passion
          </h2>
        </div>

        {loading ? (
          <div className="text-center text-neutral-600">Loading menu...</div>
        ) : hasMenuItems ? (
          <div className="space-y-24">
            {menu.map((category) => (
              <div key={category.title}>
                <div className="mb-10 flex items-center gap-4">
                  <div className="h-px flex-1 bg-neutral-300" />
                  <h3 className="text-3xl font-bold">{category.title}</h3>
                  <div className="h-px flex-1 bg-neutral-300" />
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {category.items.map((item, index) => (
                    <div
                      key={`${category.title}-${item.name}-${index}`}
                      className="group overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-lg shadow-black/5 transition hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <div className="overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="p-7">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-2xl font-bold">{item.name}</h4>
                            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                              {item.description}
                            </p>
                          </div>

                          <div className="rounded-full bg-black px-4 py-2 text-sm font-bold text-white">
                            {item.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-black/10 bg-white px-6 py-12 text-center text-neutral-600">
            No menu items are available right now.
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 text-center md:flex-row md:text-left">
          <div>
            <h3 className="text-2xl font-black">{restaurantInfo.name}</h3>
            <p className="mt-2 text-sm text-neutral-500">
              Beautiful food. Elegant atmosphere. Memorable experiences.
            </p>
          </div>

          <div className="flex gap-4 text-sm font-medium text-neutral-600">
            <a href="#" className="transition hover:text-black">
              Instagram
            </a>
            <a href="#" className="transition hover:text-black">
              Facebook
            </a>
            <a href="#" className="transition hover:text-black">
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
