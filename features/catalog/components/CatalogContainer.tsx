"use client";

import React, { useState, useMemo } from "react";
import { FilterOptions, Product } from "../types";
import { CategoryFilter } from "./CategoryFilter";
import { ProductGrid } from "./ProductGrid";
import rawProducts from "../data/products.json";

// Cast JSON to Product[] type
const productsData = rawProducts as Product[];

const DEFAULT_FILTERS: FilterOptions = {
  search: "",
  category: "all",
  sortBy: "featured",
  minPrice: 0,
  maxPrice: 200,
};

export function CatalogContainer() {
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);

  // Extract categories dynamically
  const categories = useMemo(() => {
    return Array.from(new Set(productsData.map((p) => p.category))).sort();
  }, []);

  // Update filters state
  const handleFilterChange = (updates: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  // Reset filters state to defaults
  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...productsData];

    // Search filter (text search)
    if (filters.search.trim() !== "") {
      const searchLower = filters.search.toLowerCase();
      list = list.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (filters.category !== "all") {
      list = list.filter((product) => product.category === filters.category);
    }

    // Price range filter
    list = list.filter((product) => {
      const price =
        product.isDiscounted && product.discountPrice ? product.discountPrice : product.price;
      return price >= filters.minPrice && price <= filters.maxPrice;
    });

    // Sorting
    if (filters.sortBy === "price-asc") {
      list.sort((a, b) => {
        const priceA = a.isDiscounted && a.discountPrice ? a.discountPrice : a.price;
        const priceB = b.isDiscounted && b.discountPrice ? b.discountPrice : b.price;
        return priceA - priceB;
      });
    } else if (filters.sortBy === "price-desc") {
      list.sort((a, b) => {
        const priceA = a.isDiscounted && a.discountPrice ? a.discountPrice : a.price;
        const priceB = b.isDiscounted && b.discountPrice ? b.discountPrice : b.price;
        return priceB - priceA;
      });
    } else if (filters.sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [filters]);

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Decorative Glow Elements */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-indigo-500/5 blur-[120px]" />

      {/* Main Layout Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Page Header (Hero Section) */}
        <header className="mb-12 border-b border-zinc-900 pb-8 text-center md:flex md:items-end md:justify-between md:text-left">
          <div>
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20 ring-inset">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Catálogo de Productos
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Nuestra Colección
            </h1>
            <p className="mt-2 max-w-xl text-base text-zinc-400">
              Explora nuestra cuidada selección de dispositivos electrónicos de última generación,
              ropa de alta calidad y accesorios premium.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-zinc-900 bg-zinc-900/40 px-3 py-1.5 text-xs font-semibold text-zinc-500 md:mt-0">
            <span>Next.js Modular Feature App</span>
            <span className="text-zinc-700">•</span>
            <span className="text-emerald-500/80">Features/Catalog</span>
          </div>
        </header>

        {/* Content Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar / Filters Column */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6">
              <CategoryFilter
                categories={categories}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Grid Column */}
          <main className="lg:col-span-3">
            <ProductGrid products={filteredProducts} onClearFilters={handleClearFilters} />
          </main>
        </div>
      </div>
    </div>
  );
}
