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
