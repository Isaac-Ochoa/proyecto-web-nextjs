import React from "react";
import { Product } from "../types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onClearFilters: () => void;
}

export function ProductGrid({ products, onClearFilters }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/10 px-6 py-16 text-center backdrop-blur-sm">
        <div className="rounded-full border border-zinc-800 bg-zinc-900/60 p-4">
          <svg
            className="h-10 w-10 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-bold tracking-tight text-white">
          No se encontraron productos
        </h3>
        <p className="mt-2 max-w-sm text-sm text-zinc-400">
          No hay artículos que coincidan con los filtros seleccionados. Intenta ajustar el término
          de búsqueda o restablecer los filtros.
        </p>
        <button
          onClick={onClearFilters}
          type="button"
          className="mt-6 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/10 transition-all hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/20 focus:outline-none active:scale-95"
        >
          Ver todos los productos
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Product count & grid header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-400">
          Mostrando <span className="text-white">{products.length}</span> producto
          {products.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid of items */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
