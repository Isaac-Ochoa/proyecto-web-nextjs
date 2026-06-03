"use client";

import React, { useState } from "react";
import { Product, ProductFormInput, ProductCategory, ProductStatus } from "../types";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormInput) => void;
  initialProduct?: Product;
  existingSkus: string[];
}

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "electronics", label: "Electrónica" },
  { value: "clothing", label: "Ropa y Calzado" },
  { value: "home", label: "Hogar y Decoración" },
  { value: "sports", label: "Deportes" },
  { value: "books", label: "Libros y Papelería" },
  { value: "other", label: "Otros" },
];

const STATUSES: { value: ProductStatus; label: string; colorClass: string }[] = [
  {
    value: "active",
    label: "Activo",
    colorClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    value: "draft",
    label: "Borrador",
    colorClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  {
    value: "out_of_stock",
    label: "Agotado",
    colorClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
];

export default function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  initialProduct,
  existingSkus,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormInput>(() => {
    if (initialProduct) {
      return {
        name: initialProduct.name,
        sku: initialProduct.sku,
        description: initialProduct.description,
        category: initialProduct.category,
        price: initialProduct.price,
        compareAtPrice: initialProduct.compareAtPrice,
        stock: initialProduct.stock,
        status: initialProduct.status,
        imageUrl: initialProduct.imageUrl || "",
        weight: initialProduct.weight,
        width: initialProduct.dimensions?.width,
        height: initialProduct.dimensions?.height,
        depth: initialProduct.dimensions?.depth,
      };
    }
    return {
      name: "",
      sku: "",
      description: "",
      category: "electronics",
      price: 0,
      compareAtPrice: undefined,
      stock: 0,
      status: "active",
      imageUrl: "",
      weight: undefined,
      width: undefined,
      height: undefined,
      depth: undefined,
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validaciones
  const validateField = (name: string, value: string | number | undefined): string => {
    switch (name) {
      case "name":
        if (!value || String(value).trim() === "") {
          return "El nombre del producto es requerido";
        }
        if (String(value).length < 3) {
          return "El nombre debe tener al menos 3 caracteres";
        }
        break;
      case "sku":
        if (!value || String(value).trim() === "") {
          return "El SKU es requerido";
        }
        const skuStr = String(value);
        const skuRegex = /^PROD-[A-Z0-9]{4}-[A-Z]{2}$/;
        if (!skuRegex.test(skuStr)) {
          return "El SKU debe cumplir el formato PROD-XXXX-YY (ej. PROD-1024-EL)";
        }
        // Validar si el SKU ya existe (excluyendo el del producto en edición)
        if ((!initialProduct || initialProduct.sku !== skuStr) && existingSkus.includes(skuStr)) {
          return "Este SKU ya está registrado en el inventario";
        }
        break;
      case "price":
        if (value === undefined || value === "") {
          return "El precio es requerido";
        }
        const priceNum = Number(value);
        if (isNaN(priceNum) || priceNum <= 0) {
          return "El precio debe ser un número mayor a 0";
        }
        break;
      case "compareAtPrice":
        if (value !== undefined && value !== "" && Number(value) > 0) {
          const comparePrice = Number(value);
          const currentPrice = Number(formData.price);
          if (comparePrice <= currentPrice) {
            return "El precio de comparación debe ser mayor que el precio de venta";
          }
        }
        break;
      case "stock":
        if (value === undefined || value === "") {
          return "La cantidad en stock es requerida";
        }
        const stockNum = Number(value);
        if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
          return "El stock debe ser un número entero no negativo";
        }
        break;
      case "description":
        if (!value || String(value).trim() === "") {
          return "La descripción es requerida";
        }
        break;
      case "imageUrl":
        if (value && String(value).trim() !== "") {
          try {
            new URL(String(value));
          } catch {
            return "Debe ser una URL válida (ej. https://...)";
          }
        }
        break;
      case "weight":
      case "width":
      case "height":
      case "depth":
        if (value !== undefined && value !== "") {
          const num = Number(value);
          if (isNaN(num) || num < 0) {
            return "Debe ser un valor numérico no negativo";
          }
        }
        break;
    }
    return "";
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let finalValue: string | number | undefined = value;

    if (["price", "compareAtPrice", "stock", "weight", "width", "height", "depth"].includes(name)) {
      if (value === "") {
        finalValue = undefined;
      } else {
        finalValue = Number(value);
      }
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: finalValue };
      // Validar dinámicamente dependencias de precio
      if (name === "price" && updated.compareAtPrice !== undefined) {
        const errorCompare = validateField("compareAtPrice", updated.compareAtPrice);
        setErrors((errs) => ({ ...errs, compareAtPrice: errorCompare }));
      }
      return updated;
    });

    if (touched[name]) {
      const error = validateField(name, finalValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todos los campos
    const newErrors: Record<string, string> = {};
    const allFields = Object.keys(formData);

    allFields.forEach((field) => {
      const value = formData[field as keyof ProductFormInput];
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    // Marcar todos como tocados
    const allTouched: Record<string, boolean> = {};
    allFields.forEach((field) => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      onClose();
    } else {
      // Hacer scroll al primer error
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-300">
      {/* Backdrop click closer */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-over Container */}
      <div className="animate-slide-in relative flex h-full w-full max-w-2xl flex-col border-l border-zinc-800 bg-zinc-900 shadow-2xl transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 p-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {initialProduct ? "Editar Producto" : "Registrar Nuevo Producto"}
            </h2>
            <p className="mt-1 text-xs text-zinc-400">
              {initialProduct
                ? "Modifica los detalles del producto en el inventario."
                : "Agrega un nuevo artículo con su SKU, precios y stock."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
            aria-label="Cerrar formulario"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Seccion 1: Datos Básicos */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium tracking-wide text-indigo-400 uppercase">
              Información Básica
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-300" htmlFor="name">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full rounded-lg border bg-zinc-950 px-3.5 py-2 text-sm text-white placeholder-zinc-500 transition-all focus:ring-2 focus:outline-hidden ${
                    errors.name && touched.name
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                  placeholder="Ej. Silla Ergonómica Pro"
                />
                {errors.name && touched.name && (
                  <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-300" htmlFor="sku">
                  Código SKU *
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full rounded-lg border bg-zinc-950 px-3.5 py-2 text-sm text-white placeholder-zinc-500 transition-all focus:ring-2 focus:outline-hidden ${
                    errors.sku && touched.sku
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                  placeholder="Ej. PROD-9080-EL"
                />
                <span className="mt-1 block text-[10px] text-zinc-500">
                  Formato: PROD-XXXX-YY (X=números, Y=letras)
                </span>
                {errors.sku && touched.sku && (
                  <p className="mt-1 text-xs text-rose-500">{errors.sku}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  className="mb-1.5 block text-xs font-semibold text-zinc-300"
                  htmlFor="category"
                >
                  Categoría
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value} className="bg-zinc-900 text-white">
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="mb-1.5 block text-xs font-semibold text-zinc-300"
                  htmlFor="status"
                >
                  Estado
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden"
                >
                  {STATUSES.map((stat) => (
                    <option key={stat.value} value={stat.value} className="bg-zinc-900 text-white">
                      {stat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                className="mb-1.5 block text-xs font-semibold text-zinc-300"
                htmlFor="description"
              >
                Descripción *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={3}
                className={`w-full rounded-lg border bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition-all focus:ring-2 focus:outline-hidden ${
                  errors.description && touched.description
                    ? "border-rose-500 focus:ring-rose-500/20"
                    : "border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20"
                }`}
                placeholder="Detalla las características físicas, materiales y detalles del artículo..."
              />
              {errors.description && touched.description && (
                <p className="mt-1 text-xs text-rose-500">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Seccion 2: Precios e Inventario */}
          <div className="space-y-4 border-t border-zinc-800 pt-6">
            <h3 className="text-sm font-medium tracking-wide text-indigo-400 uppercase">
              Precios e Inventario
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-300" htmlFor="price">
                  Precio de Venta ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="price"
                  name="price"
                  value={formData.price === 0 && !touched.price ? "" : formData.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full rounded-lg border bg-zinc-950 px-3.5 py-2 text-sm text-white placeholder-zinc-500 transition-all focus:ring-2 focus:outline-hidden ${
                    errors.price && touched.price
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                  placeholder="0.00"
                />
                {errors.price && touched.price && (
                  <p className="mt-1 text-xs text-rose-500">{errors.price}</p>
                )}
              </div>

              <div>
                <label
                  className="mb-1.5 block text-xs font-semibold text-zinc-300"
                  htmlFor="compareAtPrice"
                >
                  Precio de Comparación ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="compareAtPrice"
                  name="compareAtPrice"
                  value={formData.compareAtPrice === undefined ? "" : formData.compareAtPrice}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full rounded-lg border bg-zinc-950 px-3.5 py-2 text-sm text-white placeholder-zinc-500 transition-all focus:ring-2 focus:outline-hidden ${
                    errors.compareAtPrice && touched.compareAtPrice
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                  placeholder="Antes $0.00"
                />
                {errors.compareAtPrice && touched.compareAtPrice && (
                  <p className="mt-1 text-xs text-rose-500">{errors.compareAtPrice}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-300" htmlFor="stock">
                  Stock Disponible *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock === 0 && !touched.stock ? "" : formData.stock}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full rounded-lg border bg-zinc-950 px-3.5 py-2 text-sm text-white placeholder-zinc-500 transition-all focus:ring-2 focus:outline-hidden ${
                    errors.stock && touched.stock
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                  placeholder="Cantidad"
                />
                {errors.stock && touched.stock && (
                  <p className="mt-1 text-xs text-rose-500">{errors.stock}</p>
                )}
              </div>
            </div>
          </div>

          {/* Seccion 3: Envíos e Información Física (Opcionales) */}
          <div className="space-y-4 border-t border-zinc-800 pt-6">
            <h3 className="text-sm font-medium tracking-wide text-indigo-400 uppercase">
              Dimensiones y Envío (Opcional)
            </h3>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <label
                  className="mb-1.5 block text-xs font-semibold text-zinc-300"
                  htmlFor="weight"
                >
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="weight"
                  name="weight"
                  value={formData.weight === undefined ? "" : formData.weight}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-600 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-300" htmlFor="width">
                  Ancho (cm)
                </label>
                <input
                  type="number"
                  id="width"
                  name="width"
                  value={formData.width === undefined ? "" : formData.width}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-600 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden"
                  placeholder="Ancho"
                />
              </div>

              <div>
                <label
                  className="mb-1.5 block text-xs font-semibold text-zinc-300"
                  htmlFor="height"
                >
                  Alto (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height === undefined ? "" : formData.height}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-600 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden"
                  placeholder="Alto"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-300" htmlFor="depth">
                  Profundo (cm)
                </label>
                <input
                  type="number"
                  id="depth"
                  name="depth"
                  value={formData.depth === undefined ? "" : formData.depth}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-600 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden"
                  placeholder="Largo"
                />
              </div>
            </div>
          </div>

          {/* Seccion 4: Multimedia */}
          <div className="space-y-4 border-t border-zinc-800 pt-6">
            <h3 className="text-sm font-medium tracking-wide text-indigo-400 uppercase">
              Multimedia
            </h3>

            <div>
              <label
                className="mb-1.5 block text-xs font-semibold text-zinc-300"
                htmlFor="imageUrl"
              >
                URL de la Imagen
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full rounded-lg border bg-zinc-950 px-3.5 py-2 text-sm text-white placeholder-zinc-500 transition-all focus:ring-2 focus:outline-hidden ${
                  errors.imageUrl && touched.imageUrl
                    ? "border-rose-500 focus:ring-rose-500/20"
                    : "border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20"
                }`}
                placeholder="https://images.unsplash.com/photo-..."
              />
              {errors.imageUrl && touched.imageUrl && (
                <p className="mt-1 text-xs text-rose-500">{errors.imageUrl}</p>
              )}
            </div>

            {/* Image Preview Area */}
            {formData.imageUrl && !errors.imageUrl && (
              <div className="mt-2 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="mb-2 text-[10px] font-semibold text-zinc-400 uppercase">
                  Previsualización de Imagen
                </p>
                <div className="relative aspect-video max-w-xs overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.imageUrl}
                    alt="Previsualización"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                      setErrors((prev) => ({
                        ...prev,
                        imageUrl: "No se pudo cargar la imagen desde esta URL",
                      }));
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 border-t border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
          <button
            type="button"
            onClick={onClose}
            className="hover:bg-zinc-850 cursor-pointer rounded-lg border border-zinc-800 bg-transparent px-4.5 py-2 text-sm font-medium text-zinc-300 transition-all hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="active:bg-indigo-750 cursor-pointer rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 focus:ring-2 focus:ring-indigo-500/40 focus:outline-hidden"
          >
            {initialProduct ? "Guardar Cambios" : "Crear Producto"}
          </button>
        </div>
      </div>
    </div>
  );
}
