"use client";

import { useCart } from "../context/CartContext";

export default function CartList() {
  const { items, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <h2 className="text-lg font-semibold tracking-tight text-white">
          Artículos en tu Carrito ({items.reduce((total, i) => total + i.quantity, 0)})
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="group relative flex flex-col gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-900/60 sm:flex-row sm:items-center sm:justify-between"
          >
            {/* Product info section */}
            <div className="flex items-center gap-4">
              {/* Product Image Placeholder / Thumbnail */}
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 transition-colors group-hover:border-zinc-700">
                {item.product.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-8 w-8 text-zinc-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                )}
              </div>

              {/* Title & Details */}
              <div className="flex flex-col">
                <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                  {item.product.category || "General"}
                </span>
                <h3 className="font-semibold text-white transition-colors group-hover:text-emerald-300">
                  {item.product.name}
                </h3>
                <p className="mt-1 line-clamp-1 text-xs text-zinc-400">
                  {item.product.description || "Sin descripción disponible."}
                </p>
                <span className="mt-2 text-sm font-medium text-zinc-300 sm:hidden">
                  ${item.product.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                  c/u
                </span>
              </div>
            </div>

            {/* Controls and Price */}
            <div className="flex items-center justify-between gap-6 border-t border-zinc-800/60 pt-3 sm:border-0 sm:pt-0">
              {/* Quantity Selector */}
              <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-1">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                  aria-label="Disminuir cantidad"
                  disabled={item.quantity <= 1}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    className="h-3.5 w-3.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                  </svg>
                </button>

                <span className="w-8 text-center text-sm font-medium text-white select-none">
                  {item.quantity}
                </span>

                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white"
                  aria-label="Aumentar cantidad"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    className="h-3.5 w-3.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>

              {/* Price display */}
              <div className="hidden flex-col items-end sm:flex">
                <span className="text-xs text-zinc-400">Total</span>
                <span className="font-semibold text-white">
                  $
                  {(item.product.price * item.quantity).toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  MXN
                </span>
                <span className="text-[10px] text-zinc-500">
                  ${item.product.price.toLocaleString("es-MX")} c/u
                </span>
              </div>

              <div className="flex items-center gap-4 sm:hidden">
                <span className="font-semibold text-white">
                  $
                  {(item.product.price * item.quantity).toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  MXN
                </span>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800/80 bg-zinc-900/40 text-zinc-400 transition-all hover:border-red-900/30 hover:bg-red-950/20 hover:text-red-400"
                aria-label="Eliminar producto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0M4.5 18v-.008H4.51V18H4.5Zm0 0"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
