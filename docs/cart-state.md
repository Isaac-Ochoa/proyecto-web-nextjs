# Gestión de Estado Global - Carrito de Compras

Este documento explica cómo funciona el manejador de estado global para el carrito de compras dentro de la aplicación, implementado como una opción modular e independiente en la carpeta `/features/cart`.

---

## 1. Arquitectura de Estado (React Context API)

Hemos utilizado **React Context API** para administrar el estado global del carrito. Esta elección evita la introducción de dependencias externas innecesarias, manteniendo la arquitectura ligera, fácil de entender y de probar.

El estado del carrito es expuesto a través de `CartProvider` y consumido mediante el hook personalizado `useCart`.

```text
Features / Cart Flow:
[CartProvider] (Mantiene estado "items")
     │
     ├─► [useCart()] ──► Hook para consumir estado y métodos
     │
     ├─► [CartList] ───► Lista y manipula artículos en el carrito
     │
     └─► [CheckoutSummary] ──► Calcula totales, impuestos, envío y aplica cupones
```

---

## 2. Modelos de Datos (Tipado TypeScript)

Los tipos están definidos en [types.ts](file:///C:/Users/Jesus%20Fernando/Documents/ecomerce/proyecto-web-nextjs/features/cart/types.ts):

```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}
```

---

## 3. API y Métodos Disponibles

El hook `useCart` expone los siguientes valores y funciones:

### `items: CartItem[]`

Un arreglo con todos los elementos actuales del carrito. Cada elemento contiene la información del producto (`product`) y la cantidad seleccionada (`quantity`).

### `addToCart(product: Product, quantity?: number)`

Añade un producto al carrito. Si el producto ya existe en el carrito, incrementa la cantidad en el número proporcionado (por defecto `1`).

### `removeFromCart(productId: string)`

Elimina por completo el producto correspondiente del carrito.

### `updateQuantity(productId: string, quantity: number)`

Actualiza la cantidad de un artículo. Si la cantidad especificada es `<= 0`, el producto es eliminado automáticamente del carrito.

### `clearCart()`

Limpia todo el carrito (remueve todos los elementos). Se utiliza comúnmente al finalizar una compra exitosa.

### `cartTotal: number`

Un valor computado reactivo que representa la suma total de los precios de los productos multiplicados por sus respectivas cantidades.

### `cartCount: number`

Un valor computado reactivo que representa la cantidad total de artículos físicos agregados al carrito (la suma de todos los campos `quantity`).

---

## 4. Persistencia Local (LocalStorage)

El estado del carrito persiste automáticamente en el navegador del usuario a través de `localStorage` bajo la clave `"shopping-cart"`.

Para evitar errores de discrepancia en la hidratación (Hydration Mismatch) característicos de Next.js SSR (Server-Side Rendering), el estado inicial se carga en un efecto secundario (`useEffect`) de React únicamente del lado del cliente tras el montaje del componente.

---

## 5. Ejemplo de Integración

Cualquier componente que necesite consumir o alterar el estado del carrito debe ser envuelto por el proveedor y utilizar el hook:

```tsx
import { useCart } from "@/features/cart";

export default function MiComponente() {
  const { addToCart } = useCart();

  const producto = {
    id: "p1",
    name: "Demo",
    price: 150.0,
  };

  return <button onClick={() => addToCart(producto, 1)}>Agregar al Carrito</button>;
}
```
