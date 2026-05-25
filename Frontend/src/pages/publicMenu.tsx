import { supabase } from "#lib/supabase";
import { useState } from "react";
import { useParams } from "react-router-dom";


export default function RestaurantMenuTemplate() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  async function getMenu(restaurantId: string) {
    setLoading(true)
    await supabase
    .from("menus")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .limit(1)
    .maybeSingle()
    .then(({ data, error }) => {
      if (error) {
        console.error("Error fetching menu:", error);
      } else {
        console.log("Menu data:", data); // object or null, not an array
      }
      setLoading(false);
    });
  }

  const categories = [
    {
      title: "Entradas",
      items: [
        {
          name: "Bruschetta Artesanal",
          description: "Pan tostado con tomate fresco, albahaca y aceite de oliva.",
          price: "$8",
          image:
            "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?q=80&w=1200&auto=format&fit=crop",
        },
        {
          name: "Ceviche Tropical",
          description: "Pescado fresco marinado en limón con notas cítricas.",
          price: "$12",
          image:
            "https://images.unsplash.com/photo-1604908554165-eab3e12b4d4f?q=80&w=1200&auto=format&fit=crop",
        },
      ],
    },
    {
      title: "Platos Fuertes",
      items: [
        {
          name: "Ribeye Premium",
          description: "Corte premium acompañado de puré y vegetales salteados.",
          price: "$28",
          image:
            "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
        },
        {
          name: "Pasta Cremosa Trufada",
          description: "Pasta artesanal en salsa cremosa con aceite de trufa.",
          price: "$21",
          image:
            "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=1200&auto=format&fit=crop",
        },
      ],
    },
    {
      title: "Bebidas",
      items: [
        {
          name: "Limonada de Coco",
          description: "Refrescante mezcla tropical servida fría.",
          price: "$5",
          image:
            "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1200&auto=format&fit=crop",
        },
        {
          name: "Mocktail Sunset",
          description: "Bebida afrutada con un acabado elegante.",
          price: "$7",
          image:
            "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1200&auto=format&fit=crop",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf7f2] text-neutral-900">
      {/* HERO */}
      <section className="relative h-[70vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop"
          alt="Restaurant"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <div className="mb-6 rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md">
            <span className="text-sm tracking-[0.3em] uppercase">
              Fine Dining Experience
            </span>
          </div>

          <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
            Restaurant Name
          </h1>

          <p className="mt-6 max-w-2xl text-base text-white/80 md:text-lg">
            Elegant cuisine, premium ingredients, and a memorable atmosphere.
            Replace this text with your restaurant description.
          </p>

          </div>
      </section>

      {/* INFO BAR */}
      <section className="mx-auto -mt-12 max-w-6xl px-6 relative z-20">
        <div className="grid gap-4 rounded-[32px] border border-black/5 bg-white p-6 shadow-2xl shadow-black/10 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Location
            </p>
            <p className="mt-2 text-lg font-semibold">Bella Vista, Panama</p>
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

        <div className="space-y-24">
          {categories.map((category) => (
            <div key={category.title}>
              <div className="mb-10 flex items-center gap-4">
                <div className="h-px flex-1 bg-neutral-300" />
                <h3 className="text-3xl font-bold">{category.title}</h3>
                <div className="h-px flex-1 bg-neutral-300" />
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {category.items.map((item) => (
                  <div
                    key={item.name}
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
      </section>

      {/* SPECIAL SECTION */}
      {/* FOOTER */}
      <footer className="border-t border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 text-center md:flex-row md:text-left">
          <div>
            <h3 className="text-2xl font-black">Restaurant Name</h3>
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
