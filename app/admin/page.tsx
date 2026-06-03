import { Metadata } from "next";
import { InventoryDashboard } from "@/features/admin";

export const metadata: Metadata = {
  title: "Administración de Inventario - E-Commerce",
  description:
    "Panel de administración para la gestión del catálogo de productos, control de stock, precios y SKU en tiempo real.",
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100" id="admin-inventory-page">
      <InventoryDashboard />
    </main>
  );
}
