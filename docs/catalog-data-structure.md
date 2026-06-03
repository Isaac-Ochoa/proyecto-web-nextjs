# Estructura de Datos del Catálogo (E-Commerce)

Esta sección documenta la estructura de datos de productos utilizada en la Épica del Catálogo (`/features/catalog`). Para el desarrollo inicial y pruebas locales, los datos se almacenan en un archivo JSON local.

---

## 1. Esquema del Producto (TypeScript)

El tipo principal de datos de productos está definido en [`/features/catalog/types.ts`](../features/catalog/types.ts):

```typescript
export interface Product {
  id: string; // Identificador único del producto (e.g., 'prod_01')
  name: string; // Nombre comercial del producto
  description: string; // Descripción detallada de características y beneficios
  price: number; // Precio base/original del producto en USD
  rating: number; // Calificación promedio (0.0 a 5.0)
  reviewsCount: number; // Cantidad de reseñas/opiniones de clientes
  category: string; // Categoría principal para filtrado (e.g., 'Electrónica')
  imageUrl: string; // URL de la imagen del producto
  stock: number; // Inventario actual disponible
  tags: string[]; // Etiquetas secundarias para búsqueda y SEO (e.g., ['audio', 'bluetooth'])
  isNew: boolean; // Indicador si el producto es de lanzamiento reciente
  isDiscounted: boolean; // Indicador si el producto tiene un precio promocional activo
  discountPrice?: number; // Precio con descuento (opcional, requerido si isDiscounted es verdadero)
}
```

---

## 2. Archivo de Datos Local (Mock Data)

Los productos de prueba se encuentran en [`/features/catalog/data/products.json`](../features/catalog/data/products.json).

### Ejemplo de Estructura JSON:

```json
{
  "id": "prod_01",
  "name": "Auriculares Inalámbricos Pro",
  "description": "Auriculares con cancelación de ruido activa, sonido de alta fidelidad y hasta 40 horas de batería recargable con estuche inteligente.",
  "price": 129.99,
  "rating": 4.8,
  "reviewsCount": 128,
  "category": "Electrónica",
  "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
  "stock": 15,
  "tags": ["audio", "bluetooth", "premium"],
  "isNew": true,
  "isDiscounted": true,
  "discountPrice": 99.99
}
```

---

## 3. Lógica de Filtrado y Ordenación

El componente [`CatalogContainer`](../features/catalog/components/CatalogContainer.tsx) implementa filtros puramente reactivos basados en el estado del cliente:

1. **Búsqueda por Texto**: Compara de forma insensible a mayúsculas/minúsculas el nombre del producto, descripción, categoría y etiquetas (`tags`).
2. **Categoría**: Filtro estricto que muestra todos los productos (`all`) o filtra por la propiedad `category`. Las categorías del filtro se generan dinámicamente extrayendo los valores únicos de los productos disponibles.
3. **Precios**: Filtra productos cuyo precio activo (tomando el `discountPrice` si tiene descuento, o de lo contrario el `price` base) esté dentro de un rango específico de mínimo y máximo.
4. **Ordenación**:
   - `featured` (Destacados): Respeta el orden de inserción inicial.
   - `price-asc` (Precio Ascendente): Ordena de menor a mayor precio activo.
   - `price-desc` (Precio Descendente): Ordena de mayor a menor precio activo.
   - `rating` (Mejor Calificados): Ordena descendente por puntuación del producto (`rating`).
