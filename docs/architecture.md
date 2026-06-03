# Arquitectura y Gobernanza del Proyecto

Este documento detalla la estructura, las directrices de colaboración y la gobernanza del proyecto de E-Commerce para garantizar que el equipo de **5 desarrolladores** trabaje de manera coordinada, evitando conflictos de fusión (merge conflicts) y manteniendo un código limpio.

---

## 1. Estructura de Carpetas (Modularidad Estricta)

El proyecto está diseñado bajo un enfoque de **arquitectura orientada a características** (feature-oriented architecture). Todo el código de negocio se agrupa en la carpeta raíz `/features` para evitar modularizar por tipo de archivo técnico (lo cual causaría que todos los desarrolladores editen las mismas carpetas).

```text
/
├── app/                  # Sistema de enrutamiento Next.js (Rutas Aisladas)
├── features/             # Lógica modular e independiente de la aplicación
│   ├── auth/             # Autenticación, registro y recuperación de contraseñas
│   ├── catalog/          # Lista de productos, detalles, filtros y buscador
│   ├── cart/             # Gestión de artículos, cálculo de totales y checkout
│   └── admin/            # Inventario, estadísticas y gestión de usuarios
├── docs/                 # Documentación técnica y contexto del proyecto
└── public/               # Recursos estáticos (imágenes, fuentes, iconos)
```

### Reglas de Features:

- **Encapsulación**: Cada carpeta dentro de `/features` debe ser autocontenida. Debe incluir sus propios componentes, hooks, servicios API, tipos y estados.
- **Exportación controlada**: Las características deben exponer su funcionalidad pública a través de un archivo `index.ts` o `index.tsx` (patrón Barril) en la raíz de cada feature. Evita importar archivos internos profundos desde otra feature.

---

## 2. Rutas Aisladas (Next.js App Router)

Para evitar colisiones y conflictos de fusión en el archivo `layout.tsx` central o en rutas compartidas, hemos definido puntos de entrada minimalistas en la carpeta `/app/`:

- `/app/login/page.tsx` -> Conecta con `/features/auth`
- `/app/productos/page.tsx` -> Conecta con `/features/catalog`
- `/app/carrito/page.tsx` -> Conecta con `/features/cart`
- `/app/admin/page.tsx` -> Conecta con `/features/admin`

### Flujo de Desarrollo:

1. El programador encargado de **Autenticación** trabajará casi exclusivamente dentro de `/features/auth` y conectará su UI final en `/app/login/page.tsx`.
2. El programador encargado del **Catálogo** trabajará dentro de `/features/catalog` y la conectará en `/app/productos/page.tsx`.
3. Esto mantiene `/app/layout.tsx` limpio de imports y lógica específica de cada característica.

---

## 3. Estándares de Código y Formato

El equipo debe seguir las mismas reglas de formateo para asegurar un historial de Git limpio (sin commits de "formateo de código" o "cambio de tabulaciones"):

- **Prettier**: Configurado para usar comillas dobles, punto y coma al final, y tabulación de 2 espacios. Además, cuenta con el plugin de ordenamiento automático de clases de Tailwind CSS.
- **ESLint**: Integrado con Next.js y configurado para respetar el formato de Prettier sin provocar conflictos.

### Comandos de Calidad:

- **Verificar formato**: `npm run format:check`
- **Aplicar formato automáticamente**: `npm run format`
- **Ejecutar Linter**: `npm run lint`

---

## 4. Gobernanza y Flujo de Git

Para el trabajo de las 5 personas, se propone el siguiente flujo de Git basado en **Git Flow simplificado**:

1. **Ramas Principales**:
   - `main`: Código de producción (estable).
   - `develop`: Integración de características listas.

2. **Ramas de Características (Feature Branches)**:
   - Crear ramas desde `develop` con la nomenclatura: `feature/[auth|catalog|cart|admin]-[descripcion-corta]`.
   - Ejemplo: `feature/auth-login-form` o `feature/cart-add-to-cart`.

3. **Integración**:
   - Nunca hacer push directo a `main` o `develop`.
   - Crear un **Pull Request (PR)** hacia `develop`.
   - Requiere la revisión y aprobación de al menos **1 compañero de equipo** (Peer Review).
   - El PR debe pasar con éxito los comandos de construcción (`npm run build`) y formateo (`npm run format:check` y `npm run lint`).

---

## 5. Módulo de Administración (Inventario)

El módulo `/features/admin` maneja la visualización del inventario y la creación/edición de productos.

### Campos del Formulario de Inventario y Reglas de Validación:

| Campo                                        | Tipo        | Requerido | Validación / Regla                                                             |
| :------------------------------------------- | :---------- | :-------- | :----------------------------------------------------------------------------- |
| **Nombre** (`name`)                          | Texto       | Sí        | Mínimo 3 caracteres.                                                           |
| **SKU** (`sku`)                              | Texto       | Sí        | Debe coincidir con el formato `PROD-XXXX-YY` (ej. `PROD-1024-EL`) y ser único. |
| **Descripción** (`description`)              | Texto largo | Sí        | No vacío.                                                                      |
| **Categoría** (`category`)                   | Selección   | Sí        | Una de: `electronics`, `clothing`, `home`, `sports`, `books`, `other`.         |
| **Precio de Venta** (`price`)                | Número      | Sí        | Mayor a `0`.                                                                   |
| **Precio de Comparación** (`compareAtPrice`) | Número      | No        | Opcional. Si se define, debe ser mayor que el Precio de Venta.                 |
| **Stock** (`stock`)                          | Entero      | Sí        | Número entero no negativo (mayor o igual a `0`).                               |
| **Estado** (`status`)                        | Selección   | Sí        | Uno de: `active`, `draft`, `out_of_stock`.                                     |
| **URL de Imagen** (`imageUrl`)               | Texto (URL) | No        | Debe ser una URL válida si se proporciona.                                     |
| **Peso** (`weight`)                          | Número      | No        | Peso físico en kilogramos. No negativo.                                        |
| **Dimensiones** (`width`, `height`, `depth`) | Números     | No        | Ancho, alto y largo físico en centímetros. No negativos.                       |

### Flujo de Datos y Componentes del Módulo:

1. `types.ts`: Define las interfaces `Product`, `ProductDimensions` y `ProductFormInput`.
2. `ProductForm.tsx`: Componente modular para el registro y edición. Implementa validaciones detalladas y vista previa de imagen.
3. `InventoryTable.tsx`: Tabla de datos interactiva con soporte para ordenación dinámica, búsquedas por nombre/SKU, filtrado por categorías/estado, paginación dinámica y alertas de nivel de stock.
4. `InventoryDashboard.tsx`: Orquestador que mantiene el estado local del inventario y calcula las estadísticas y alertas críticas mostradas en las tarjetas superiores.
