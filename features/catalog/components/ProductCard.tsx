import React from "react";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const currentPrice =
    product.isDiscounted && product.discountPrice ? product.discountPrice : product.price;
  const originalPrice = product.price;

  // Render stars for rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <svg key={i} className="h-4 w-4 fill-current text-amber-400" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="relative h-4 w-4">
            <svg
              className="absolute top-0 left-0 h-4 w-4 fill-current text-zinc-700"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="absolute top-0 left-0 h-full w-1/2 overflow-hidden">
              <svg className="h-4 w-4 fill-current text-amber-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        );
      } else {
        stars.push(
          <svg key={i} className="h-4 w-4 fill-current text-zinc-700" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-2xl hover:shadow-emerald-950/20">
      {/* Badges Container */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
        {product.isNew && (
          <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20 backdrop-blur-md ring-inset">
            Nuevo
          </span>
        )}
        {product.isDiscounted && (
          <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400 ring-1 ring-amber-500/20 backdrop-blur-md ring-inset">
            Oferta
          </span>
        )}
      </div>

      {/* Stock warning */}
      {product.stock <= 10 && product.stock > 0 && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-400 ring-1 ring-rose-500/25 backdrop-blur-md ring-inset">
            Solo {product.stock} disp.
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 group-hover:opacity-90"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Info Container */}
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
          {product.category}
        </span>
        <h3 className="mt-1 line-clamp-1 text-base font-bold text-zinc-100 transition-colors group-hover:text-white">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 flex-grow text-xs text-zinc-400">{product.description}</p>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-1">
          <div className="flex items-center">{renderStars(product.rating)}</div>
          <span className="ml-1 text-[11px] font-medium text-zinc-500">
            ({product.reviewsCount})
          </span>
        </div>

        {/* Price & Action */}
        <div className="mt-5 flex items-center justify-between border-t border-zinc-800/80 pt-4">
          <div className="flex flex-col">
            {product.isDiscounted && (
              <span className="text-xs text-zinc-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-lg font-extrabold tracking-tight text-white">
              ${currentPrice.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            className="flex items-center justify-center rounded-xl bg-emerald-600 p-2.5 text-white transition-all duration-200 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/30 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-950 focus:outline-none disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
            disabled={product.stock === 0}
            title={product.stock === 0 ? "Agotado" : "Añadir al carrito"}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
