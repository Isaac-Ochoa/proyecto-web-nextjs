"use client";

import Link from "next/link";

export default function EmptyCartState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900/50 p-12 text-center shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-900/60">
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-800/40 text-zinc-400 after:absolute after:inset-0 after:animate-ping after:rounded-full after:border after:border-zinc-700/30 after:duration-1000">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-10 w-10 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
        Tu carrito está vacío
      </h3>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
        Parece que aún no has agregado ningún producto a tu carrito de compras. ¡Explora nuestro
        catálogo y encuentra algo para ti!
      </p>
      <div className="mt-8">
        <Link
          href="/productos"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/40 transition-all duration-300 hover:scale-[1.03] hover:from-emerald-400 hover:to-teal-500 focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
        >
          Explorar Productos
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
