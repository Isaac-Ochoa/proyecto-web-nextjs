"use client";

import React, { useState, useMemo } from "react";
import { Product, ProductCategory, ProductStatus } from "../types";

interface InventoryTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const CATEGORY_MAP: Record<ProductCategory, string> = {
  electronics: "Electrónica",
  clothing: "Ropa y Calzado",
  home: "Hogar y Decoración",
  sports: "Deportes",
  books: "Libros y Papelería",
  other: "Otros",
};

const STATUS_MAP: Record<
  ProductStatus,
  { label: string; bgClass: string; textClass: string; dotClass: string }
> = {
  active: {
    label: "Activo",
    bgClass: "bg-emerald-500/10 border-emerald-500/20",
    textClass: "text-emerald-400",
    dotClass: "bg-emerald-500 shadow-xs shadow-emerald-500/50 animate-pulse",
  },
  draft: {
    label: "Borrador",
    bgClass: "bg-amber-500/10 border-amber-500/20",
    textClass: "text-amber-400",
    dotClass: "bg-amber-500 shadow-xs shadow-amber-500/50",
  },
  out_of_stock: {
    label: "Agotado",
    bgClass: "bg-rose-500/10 border-rose-500/20",
    textClass: "text-rose-400",
    dotClass: "bg-rose-500 shadow-xs shadow-rose-500/50",
  },
};

type SortKey = "name" | "price" | "stock" | "sku";
type SortOrder = "asc" | "desc";

export default function InventoryTable({ products, onEdit, onDelete }: InventoryTableProps) {
  // Estados de Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Estado de Ordenación
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Estado de Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // ID del producto que está en proceso de eliminación para confirmación
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Manejar cambio de orden
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  // Filtrado de productos
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;

      const matchesStatus = selectedStatus === "all" || product.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  // Ordenación de productos
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    sorted.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (typeof valA === "string" && typeof valB === "string") {
        const strA = valA.toLowerCase();
        const strB = valB.toLowerCase();
        return sortOrder === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
      }

      const numA = Number(valA) || 0;
      const numB = Number(valB) || 0;

      if (numA < numB) return sortOrder === "asc" ? -1 : 1;
      if (numA > numB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredProducts, sortKey, sortOrder]);

  // Paginación
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage, itemsPerPage]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setCurrentPage(1);
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <div className="space-y-1">
          <span className="text-xs font-semibold text-rose-400">Sin stock</span>
          <div className="h-1.5 w-24 rounded-full bg-zinc-800">
            <div className="h-full rounded-full bg-rose-500" style={{ width: "0%" }} />
          </div>
        </div>
      );
    }
    if (stock < 10) {
      return (
        <div className="space-y-1">
          <span className="text-xs font-semibold text-amber-400">{stock} unidades (Bajo)</span>
          <div className="h-1.5 w-24 rounded-full bg-zinc-800">
            <div
              className="h-full animate-pulse rounded-full bg-amber-500"
              style={{ width: `${(stock / 10) * 100}%` }}
            />
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-1">
        <span className="text-xs font-semibold text-zinc-300">{stock} unidades</span>
        <div className="h-1.5 w-24 rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${Math.min((stock / 100) * 100, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  const startRange = (currentPage - 1) * itemsPerPage + 1;
  const endRange = Math.min(currentPage * itemsPerPage, sortedProducts.length);

  return (
    <div className="space-y-6">
      {/* Controles: Buscador, Categoría, Estado y Reseteo */}
      <div className="flex flex-col gap-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 backdrop-blur-xs lg:flex-row lg:items-center lg:justify-between">
        {/* Campo de búsqueda */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 py-2.5 pr-4 pl-10 text-sm text-zinc-200 placeholder-zinc-500 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-hidden"
          />
        </div>

        {/* Filtros Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-medium text-zinc-400">Categoría:</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-200 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-hidden"
            >
              <option value="all">Todas</option>
              {Object.entries(CATEGORY_MAP).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-xs font-medium text-zinc-400">Estado:</label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-200 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-hidden"
            >
              <option value="all">Todos</option>
              {Object.entries(STATUS_MAP).map(([val, info]) => (
                <option key={val} value={val}>
                  {info.label}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || selectedCategory !== "all" || selectedStatus !== "all") && (
            <button
              onClick={resetFilters}
              className="bg-zinc-850 flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-300 transition-all hover:border-zinc-700 hover:text-white"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 15H18"
                />
              </svg>
              Limpiar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabla Principal */}
      <div className="overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/40 text-xs font-semibold tracking-wider text-zinc-400">
                <th
                  className="cursor-pointer p-4.5 transition-colors select-none hover:text-white"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Producto
                    {sortKey === "name" && (
                      <span className="text-indigo-400">{sortOrder === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer p-4.5 transition-colors select-none hover:text-white"
                  onClick={() => handleSort("sku")}
                >
                  <div className="flex items-center gap-1">
                    SKU
                    {sortKey === "sku" && (
                      <span className="text-indigo-400">{sortOrder === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer p-4.5 transition-colors select-none hover:text-white"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center gap-1">
                    Precio
                    {sortKey === "price" && (
                      <span className="text-indigo-400">{sortOrder === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer p-4.5 transition-colors select-none hover:text-white"
                  onClick={() => handleSort("stock")}
                >
                  <div className="flex items-center gap-1">
                    Inventario / Stock
                    {sortKey === "stock" && (
                      <span className="text-indigo-400">{sortOrder === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </th>
                <th className="p-4.5">Estado</th>
                <th className="p-4.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-sm text-zinc-300">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => {
                  const statusInfo = STATUS_MAP[product.status] || STATUS_MAP.draft;
                  return (
                    <tr key={product.id} className="group transition-colors hover:bg-zinc-800/20">
                      {/* Producto & Categoria */}
                      <td className="p-4.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                            {product.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <svg
                                className="text-zinc-650 h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-white transition-colors group-hover:text-indigo-300">
                              {product.name}
                            </div>
                            <div className="text-[10px] font-medium text-zinc-500">
                              {CATEGORY_MAP[product.category]}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="p-4.5">
                        <span className="rounded-sm bg-zinc-800/40 px-2 py-0.5 font-mono text-xs font-semibold text-zinc-400">
                          {product.sku}
                        </span>
                      </td>

                      {/* Precio */}
                      <td className="p-4.5">
                        <div>
                          <span className="font-semibold text-zinc-200">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span className="ml-1.5 text-xs text-zinc-500 line-through">
                              ${product.compareAtPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock / Nivel */}
                      <td className="p-4.5">{getStockBadge(product.stock)}</td>

                      {/* Estado */}
                      <td className="p-4.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusInfo.bgClass} ${statusInfo.textClass}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dotClass}`} />
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="p-4.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {confirmDeleteId === product.id ? (
                            <div className="flex items-center gap-1 rounded-lg border border-rose-500/20 bg-rose-500/10 px-2 py-1">
                              <span className="mr-1.5 text-[10px] font-semibold text-rose-400">
                                ¿Eliminar?
                              </span>
                              <button
                                onClick={() => {
                                  onDelete(product.id);
                                  setConfirmDeleteId(null);
                                }}
                                className="cursor-pointer rounded-md bg-rose-600 px-2 py-1 text-xs font-bold text-white hover:bg-rose-500"
                              >
                                Sí
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="bg-zinc-850 hover:bg-zinc-850 cursor-pointer rounded-md px-2 py-1 text-xs font-semibold text-zinc-300 hover:text-white"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => onEdit(product)}
                                className="cursor-pointer rounded-lg p-2 text-zinc-400 transition-all hover:bg-indigo-600/10 hover:text-indigo-400"
                                title="Editar producto"
                              >
                                <svg
                                  className="h-4.5 w-4.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(product.id)}
                                className="hover:bg-rose-650/10 cursor-pointer rounded-lg p-2 text-zinc-400 transition-all hover:text-rose-400"
                                title="Eliminar producto"
                              >
                                <svg
                                  className="h-4.5 w-4.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <svg
                        className="h-10 w-10 text-zinc-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <span>No se encontraron productos en el inventario.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación Controles */}
        {sortedProducts.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-zinc-800 bg-zinc-950/20 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-zinc-400">
              Mostrando <span className="font-semibold text-zinc-200">{startRange}</span> a{" "}
              <span className="font-semibold text-zinc-200">{endRange}</span> de{" "}
              <span className="font-semibold text-zinc-200">{sortedProducts.length}</span> productos
            </div>

            <div className="flex items-center gap-3">
              {/* Selector de cantidad por página */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-500">Filas por página:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-1 text-[11px] text-zinc-300 focus:outline-hidden"
                >
                  {[5, 10, 20, 50].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botones de navegación */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400 transition-all hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-zinc-400"
                >
                  Anterior
                </button>
                <span className="px-2 text-xs text-zinc-400">
                  Pág. <span className="font-medium text-zinc-200">{currentPage}</span> de{" "}
                  {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400 transition-all hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-zinc-400"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
