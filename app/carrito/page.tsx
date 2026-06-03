"use client";

import Link from "next/link";
import { CartProvider, useCart } from "../../features/cart";
import CartList from "../../features/cart/components/CartList";
import CheckoutSummary from "../../features/cart/components/CheckoutSummary";
import EmptyCartState from "../../features/cart/components/EmptyCartState";

function CarritoContent() {
  const { items, addToCart } = useCart();

  // Mock Products to let the user add items to the cart
  const demoProducts = [
    {
      id: "prod_1",
      name: "Auriculares Inalámbricos Premium (ANC)",
      price: 899.0,
      category: "Audio",
      description:
        "Cancelación activa de ruido, audio espacial y 40 horas de batería de alta fidelidad.",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: "prod_2",
      name: "Teclado Mecánico Custom RGB",
      price: 1250.0,
      category: "Accesorios",
      description:
        "Interruptores lubricados de fábrica, teclas PBT de doble inyección y diseño compacto 75%.",
      image:
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: "prod_3",
      name: "Estación de Carga 3 en 1 MagSafe",
      price: 450.0,
      category: "Cargadores",
      description:
        "Carga rápida simultánea para tu smartphone, reloj inteligente y auriculares inalámbricos.",
      image:
        "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=500&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <nav className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-500">
            <Link href="/" className="hover:text-zinc-300">
              Inicio
            </Link>
            <span>/</span>
            <span className="text-zinc-300">Carrito de compras</span>
          </nav>
          <h1 className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent text-white sm:text-4xl">
            Mi Carrito
          </h1>
        </div>
        <Link
          href="/productos"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Seguir comprando
        </Link>
      </div>

      {/* Main Grid */}
      <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {items.length === 0 ? (
          <div className="lg:col-span-8">
            <EmptyCartState />
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:col-span-8">
            <CartList />
          </div>
        )}

        <div className="lg:col-span-4">
          <CheckoutSummary />
        </div>
      </div>

      {/* Demo Products Shelf */}
      <div className="mt-16 border-t border-zinc-800/80 pt-10">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
            Sandbox de Prueba
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white">Agregar Productos Demo</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
            Dado que la tienda principal está en construcción, utiliza estos productos mockup para
            probar el estado global del carrito (añadir, sumar, restar, recalcular totales y aplicar
            cupones de descuento).
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {demoProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-900/50"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-103"
                  />
                  <div className="absolute top-3 left-3 rounded-md border border-zinc-800 bg-zinc-900/90 px-2 py-1 text-[10px] font-semibold text-emerald-400 backdrop-blur-sm">
                    {product.category}
                  </div>
                </div>
                <div className="mt-4 flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-white transition-colors group-hover:text-emerald-300">
                    {product.name}
                  </h3>
                  <span className="shrink-0 text-sm font-bold text-white">
                    ${product.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                  {product.description}
                </p>
              </div>

              <button
                onClick={() => addToCart(product, 1)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 py-3 text-xs font-semibold text-zinc-300 transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-950/20 hover:text-emerald-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="h-3.5 w-3.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
                Añadir al Carrito
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CarritoPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 selection:bg-emerald-500 selection:text-black">
        <CarritoContent />
      </div>
    </CartProvider>
  );
}
