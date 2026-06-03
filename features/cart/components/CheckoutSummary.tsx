"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function CheckoutSummary() {
  const { cartTotal, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [checkoutStep, setCheckoutStep] = useState<"idle" | "loading" | "success">("idle");

  // Shipping Rules
  const FREE_SHIPPING_THRESHOLD = 1000;
  const SHIPPING_COST = 99;
  const shipping = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  // Free shipping progress calculations
  const progressPercent = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - cartTotal;

  // Coupon Logic
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const code = promoCode.trim().toUpperCase();

    if (code === "DESCUENTO10") {
      setDiscountPercent(10);
      setPromoApplied(true);
    } else if (code === "ENVIOFREE") {
      setDiscountPercent(0);
      // Wait, we could implement free shipping with this coupon code too, but let's just make it simple: 10% discount
      setDiscountPercent(15); // Let's give 15% off for ENVIOFREE code for fun!
      setPromoApplied(true);
    } else {
      setPromoError("Código de cupón inválido. Intenta con DESCUENTO10");
      setPromoApplied(false);
      setDiscountPercent(0);
    }
  };

  const discountAmount = (cartTotal * discountPercent) / 100;
  const total = cartTotal - discountAmount + shipping;
  const iva = total * (16 / 116); // 16% IVA included

  const handleCheckout = () => {
    setCheckoutStep("loading");
    setTimeout(() => {
      setCheckoutStep("success");
      clearCart();
    }, 2000);
  };

  if (checkoutStep === "success") {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center rounded-3xl border border-emerald-500/20 bg-emerald-950/10 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white">¡Compra Exitosa!</h3>
        <p className="mt-2 text-sm text-zinc-400">
          Tu orden ha sido procesada correctamente. Hemos enviado un correo con los detalles de tu
          compra y número de rastreo.
        </p>
        <button
          onClick={() => setCheckoutStep("idle")}
          className="mt-6 w-full rounded-xl bg-zinc-800 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
        >
          Volver a Empezar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-2xl backdrop-blur-xl">
      <h2 className="text-lg font-semibold tracking-tight text-white">Resumen de Compra</h2>

      {/* Free Shipping Alert & Progress Bar */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-4">
        <div className="flex items-center justify-between text-xs font-medium">
          {shipping === 0 ? (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              ¡Tienes envío gratis gratis!
            </span>
          ) : (
            <span className="text-zinc-300">
              Faltan{" "}
              <strong className="text-emerald-400">
                ${remainingForFreeShipping.toFixed(2)} MXN
              </strong>{" "}
              para envío gratis.
            </span>
          )}
          <span className="font-mono text-zinc-500">{progressPercent.toFixed(0)}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Pricing Details */}
      <div className="flex flex-col gap-3 border-b border-zinc-800 pb-4 text-sm">
        <div className="flex justify-between text-zinc-400">
          <span>Subtotal</span>
          <span className="font-medium text-white">
            ${cartTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
          </span>
        </div>

        {promoApplied && (
          <div className="flex justify-between text-emerald-400">
            <span className="flex items-center gap-1">
              Descuento ({discountPercent}%)
              <button
                onClick={() => {
                  setPromoApplied(false);
                  setDiscountPercent(0);
                  setPromoCode("");
                }}
                className="text-[10px] text-zinc-500 hover:text-red-400"
              >
                (Quitar)
              </button>
            </span>
            <span>
              -${discountAmount.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
            </span>
          </div>
        )}

        <div className="flex justify-between text-zinc-400">
          <span>Costo de Envío</span>
          {shipping === 0 ? (
            <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              Gratis
            </span>
          ) : (
            <span className="font-medium text-white">${shipping.toFixed(2)} MXN</span>
          )}
        </div>
      </div>

      {/* Promocode Form */}
      {!promoApplied ? (
        <form onSubmit={handleApplyPromo} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Código de descuento"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 focus:outline-none"
            />
            <span className="absolute top-2.5 right-3 font-mono text-[9px] text-zinc-600">
              e.g. DESCUENTO10
            </span>
          </div>
          <button
            type="submit"
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-800 hover:text-white"
          >
            Aplicar
          </button>
        </form>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-950/10 px-4 py-3 text-xs font-medium text-emerald-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="h-4 w-4 shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.44 1.44 0 0 0 2.037 0l4.318-4.317a1.44 1.44 0 0 0 0-2.037L10.09 3.659A2.25 2.25 0 0 0 9.568 3Z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h.008v.008H6V7.5Z" />
          </svg>
          Cupón aplicado:{" "}
          <strong className="font-mono text-white uppercase">{promoCode || "DESCUENTO10"}</strong> (
          {discountPercent}% de descuento)
        </div>
      )}

      {promoError && <p className="text-[11px] font-medium text-red-400">{promoError}</p>}

      {/* Grand Total */}
      <div className="flex flex-col gap-1 border-t border-zinc-800 pt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-base font-semibold text-white">Total</span>
          <div className="text-right">
            <span className="text-xl font-bold text-white sm:text-2xl">
              ${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}{" "}
            </span>
            <span className="text-xs font-semibold text-zinc-400">MXN</span>
          </div>
        </div>
        <span className="text-right text-[10px] font-medium text-zinc-500">
          *IVA del 16% incluido (${iva.toLocaleString("es-MX", { maximumFractionDigits: 2 })} MXN)
        </span>
      </div>

      {/* Checkout CTA Button */}
      <button
        onClick={handleCheckout}
        disabled={cartTotal === 0 || checkoutStep === "loading"}
        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-950/40 transition-all duration-300 hover:scale-[1.01] hover:from-emerald-400 hover:to-teal-500 focus:ring-2 focus:ring-emerald-500/50 focus:outline-none disabled:pointer-events-none disabled:opacity-30"
      >
        {checkoutStep === "loading" ? (
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Procesando...
          </div>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
            Proceder al Pago Seguro
          </>
        )}
      </button>

      {/* Extra Trust Badges */}
      <div className="flex items-center justify-center gap-4 text-[10px] font-medium text-zinc-500">
        <span className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="h-3 w-3 text-zinc-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
            />
          </svg>
          Pago Encriptado SSL
        </span>
        <span className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="h-3 w-3 text-zinc-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Devoluciones de 30 Días
        </span>
      </div>
    </div>
  );
}
