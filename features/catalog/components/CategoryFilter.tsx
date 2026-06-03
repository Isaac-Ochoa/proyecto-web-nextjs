import React from "react";
import { FilterOptions } from "../types";

interface CategoryFilterProps {
  categories: string[];
  filters: FilterOptions;
  onFilterChange: (updates: Partial<FilterOptions>) => void;
  onClearFilters: () => void;
}

export function CategoryFilter({
  categories,
  filters,
  onFilterChange,
  onClearFilters,
}: CategoryFilterProps) {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.category !== "all" ||
    filters.sortBy !== "featured" ||
    filters.minPrice > 0 ||
    filters.maxPrice < 200;

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
          <svg
            className="h-5 w-5 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filtros
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            type="button"
            className="text-xs font-semibold text-emerald-400 transition-colors hover:text-emerald-300 focus:outline-none"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="search"
          className="text-xs font-bold tracking-wider text-zinc-400 uppercase"
        >
          Buscar
        </label>
        <div className="relative">
          <input
            id="search"
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Buscar productos..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pr-4 pl-10 text-sm text-zinc-100 placeholder-zinc-500 transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <svg
              className="h-4 w-4 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Categorías</span>
        <div className="flex flex-wrap gap-2 md:flex-col">
          <button
            onClick={() => onFilterChange({ category: "all" })}
            type="button"
            className={`flex items-center justify-between rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              filters.category === "all"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                : "border-zinc-850 hover:border-zinc-750 border bg-zinc-950 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>Todos los productos</span>
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onFilterChange({ category })}
              type="button"
              className={`flex items-center justify-between rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                filters.category === category
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                  : "border-zinc-850 hover:border-zinc-750 border bg-zinc-950 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span>{category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase">
          Rango de Precio
        </span>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute top-2.5 left-3 text-xs text-zinc-500">$</span>
            <input
              type="number"
              value={filters.minPrice === 0 ? "" : filters.minPrice}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onFilterChange({ minPrice: isNaN(val) ? 0 : val });
              }}
              placeholder="Min"
              min="0"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 pr-3 pl-7 text-xs text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <span className="text-zinc-600">-</span>
          <div className="relative flex-1">
            <span className="absolute top-2.5 left-3 text-xs text-zinc-500">$</span>
            <input
              type="number"
              value={filters.maxPrice === 200 ? "" : filters.maxPrice}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onFilterChange({ maxPrice: isNaN(val) ? 200 : val });
              }}
              placeholder="Max"
              min="0"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 pr-3 pl-7 text-xs text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
        {/* Slider Indicator */}
        <div className="mt-0.5 flex justify-between px-1 text-[11px] text-zinc-500">
          <span>Actual: ${filters.minPrice}</span>
          <span>${filters.maxPrice}</span>
        </div>
      </div>

      {/* Sorting */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="sortBy"
          className="text-xs font-bold tracking-wider text-zinc-400 uppercase"
        >
          Ordenar por
        </label>
        <select
          id="sortBy"
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value })}
          className="w-full cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-300 transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        >
          <option value="featured">Destacados</option>
          <option value="price-asc">Precio: Menor a Mayor</option>
          <option value="price-desc">Precio: Mayor a Menor</option>
          <option value="rating">Mejor Calificados</option>
        </select>
      </div>
    </div>
  );
}
