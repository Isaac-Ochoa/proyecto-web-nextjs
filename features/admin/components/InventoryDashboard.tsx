"use client";

import React, { useState } from "react";
import { Product, ProductFormInput } from "../types";
import InventoryTable from "./InventoryTable";
import ProductForm from "./ProductForm";

// Productos de demostración iniciales de alta fidelidad
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "iPhone 15 Pro Max 256GB",
    sku: "PROD-9810-EL",
    description:
      "Teléfono móvil insignia con chasis de titanio, chip A17 Pro y sistema de cámara avanzado.",
    category: "electronics",
    price: 1199.99,
    compareAtPrice: 1299.99,
    stock: 24,
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=400&auto=format&fit=crop",
    weight: 0.221,
    dimensions: { width: 7.67, height: 15.99, depth: 0.83 },
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "Teclado Mecánico RGB G-Pro",
    sku: "PROD-4024-EL",
    description:
      "Teclado mecánico tenkeyless con interruptores táctiles Brown y retroiluminación RGB personalizable.",
    category: "electronics",
    price: 129.5,
    compareAtPrice: 149.99,
    stock: 8, // Stock bajo para activar alertas
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=400&auto=format&fit=crop",
    weight: 0.95,
    dimensions: { width: 36.1, height: 15.3, depth: 3.4 },
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "Silla de Oficina Ergonómica Aura",
    sku: "PROD-8890-HO",
    description:
      "Silla ergonómica de malla transpirable con soporte lumbar ajustable en 3D y reposacabezas.",
    category: "home",
    price: 349.0,
    stock: 15,
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=400&auto=format&fit=crop",
    weight: 18.5,
    dimensions: { width: 65, height: 120, depth: 60 },
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-4",
    name: "Chaqueta de Cuero Premium 'Rider'",
    sku: "PROD-2210-RO",
    description:
      "Chaqueta clásica de cuero de oveja genuino para hombre, con cremalleras metálicas y forro satinado.",
    category: "clothing",
    price: 199.0,
    compareAtPrice: 249.0,
    stock: 0, // Agotado para probar badges y estados
    status: "out_of_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400&auto=format&fit=crop",
    weight: 1.8,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-5",
    name: "Botella Térmica de Acero Inoxidable 1L",
    sku: "PROD-5520-DE",
    description:
      "Botella con doble pared de aislamiento al vacío para mantener bebidas frías hasta por 24 horas.",
    category: "sports",
    price: 24.99,
    stock: 110,
    status: "draft", // Borrador para probar estado
    imageUrl:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=400&auto=format&fit=crop",
    weight: 0.45,
    dimensions: { width: 8.5, height: 31, depth: 8.5 },
    createdAt: new Date().toISOString(),
  },
];

export default function InventoryDashboard() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  // Lista de todos los SKUs para validación de unicidad
  const existingSkus = products.map((p) => p.sku);

  // Métricas Calculadas
  const totalProducts = products.length;
  const totalStockValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock < 10).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const handleCreateProduct = (input: ProductFormInput) => {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: input.name,
      sku: input.sku,
      description: input.description,
      category: input.category,
      price: input.price,
      compareAtPrice: input.compareAtPrice,
      stock: input.stock,
      status: input.stock === 0 ? "out_of_stock" : input.status,
      imageUrl: input.imageUrl,
      weight: input.weight,
      dimensions:
        input.width || input.height || input.depth
          ? {
              width: input.width,
              height: input.height,
              depth: input.depth,
            }
          : undefined,
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (input: ProductFormInput) => {
    if (!editingProduct) return;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: input.name,
              sku: input.sku,
              description: input.description,
              category: input.category,
              price: input.price,
              compareAtPrice: input.compareAtPrice,
              stock: input.stock,
              // Si el stock pasa a ser 0, forzar el estado out_of_stock
              status: input.stock === 0 ? "out_of_stock" : input.status,
              imageUrl: input.imageUrl,
              weight: input.weight,
              dimensions:
                input.width || input.height || input.depth
                  ? {
                      width: input.width,
                      height: input.height,
                      depth: input.depth,
                    }
                  : undefined,
            }
          : p
      )
    );
    setEditingProduct(undefined);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const openNewProductForm = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const openEditProductForm = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  return (
    <div className="text-zinc-150 mx-auto min-h-screen w-full max-w-7xl bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      {/* Encabezado Dashboard */}
      <div className="mb-8 flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="bg-linear-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent text-white sm:text-4xl">
            Gestión de Inventario
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Control de catálogo de productos, existencias en almacén y precios de e-commerce.
          </p>
        </div>
        <div>
          <button
            onClick={openNewProductForm}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30 focus:ring-2 focus:ring-indigo-500/40 focus:outline-hidden active:scale-98"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Alertas Globales de Almacén */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="mb-8 flex flex-col items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 backdrop-blur-xs sm:flex-row sm:items-center">
          <div className="rounded-lg bg-rose-500/10 p-2 text-rose-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-rose-200">
              Alertas críticas de stock detectadas
            </h4>
            <p className="mt-0.5 text-xs text-rose-400">
              Tienes {outOfStockCount > 0 ? `${outOfStockCount} productos agotados` : ""}{" "}
              {outOfStockCount > 0 && lowStockCount > 0 ? "y" : ""}{" "}
              {lowStockCount > 0 ? `${lowStockCount} productos con inventario bajo (< 10 u.)` : ""}.
              Por favor, revisa y reabastece las existencias.
            </p>
          </div>
        </div>
      )}

      {/* Tarjetas de Métricas */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Productos */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-xs transition-colors hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Total Items
            </span>
            <span className="rounded-lg bg-indigo-500/10 p-1.5 text-indigo-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-white">{totalProducts}</span>
            <span className="mt-1 block text-xs text-zinc-500">Líneas de producto registradas</span>
          </div>
        </div>

        {/* Valor Total del Inventario */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-xs transition-colors hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Valor Inventario
            </span>
            <span className="rounded-lg bg-emerald-500/10 p-1.5 text-emerald-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16H3m9 0h9"
                />
              </svg>
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-white">
              $
              {totalStockValue.toLocaleString("es-MX", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="mt-1 block text-xs text-zinc-500">Capital total en existencias</span>
          </div>
        </div>

        {/* Alerta Stock Bajo */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-xs transition-colors hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Stock Bajo
            </span>
            <span className="rounded-lg bg-amber-500/10 p-1.5 text-amber-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </span>
          </div>
          <div className="mt-3">
            <span
              className={`text-3xl font-bold ${lowStockCount > 0 ? "text-amber-400" : "text-white"}`}
            >
              {lowStockCount}
            </span>
            <span className="mt-1 block text-xs text-zinc-500">Artículos con &lt; 10 unidades</span>
          </div>
        </div>

        {/* Agotados */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-xs transition-colors hover:border-zinc-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Agotados
            </span>
            <span className="rounded-lg bg-rose-500/10 p-1.5 text-rose-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
            </span>
          </div>
          <div className="mt-3">
            <span
              className={`text-3xl font-bold ${outOfStockCount > 0 ? "text-rose-500" : "text-white"}`}
            >
              {outOfStockCount}
            </span>
            <span className="mt-1 block text-xs text-zinc-500">Productos con stock en cero</span>
          </div>
        </div>
      </div>

      {/* Tabla del Inventario */}
      <InventoryTable
        products={products}
        onEdit={openEditProductForm}
        onDelete={handleDeleteProduct}
      />

      {/* Formulario Modular */}
      <ProductForm
        key={isFormOpen ? (editingProduct ? editingProduct.id : "new") : "closed"}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        initialProduct={editingProduct}
        existingSkus={existingSkus}
      />
    </div>
  );
}
