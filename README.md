# E-Commerce Collaborative Project

Este es el repositorio base para el proyecto de E-Commerce, diseñado para el trabajo colaborativo de un equipo de **5 personas**. La arquitectura está estructurada de forma modular para mitigar los conflictos de fusión y facilitar el desarrollo independiente de funcionalidades.

---

## 🛠️ Tecnologías y Configuración

- **Next.js 15+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **ESLint**
- **Prettier** (con plugin de ordenamiento automático de clases Tailwind)

---

## 📂 Estructura del Proyecto

El desarrollo está organizado por características aisladas dentro de la carpeta `/features/` y páginas independientes en `/app/`:

- `/features/auth` ↔️ `/app/login/page.tsx`
- `/features/catalog` ↔️ `/app/productos/page.tsx`
- `/features/cart` ↔️ `/app/carrito/page.tsx`
- `/features/admin` ↔️ `/app/admin/page.tsx`

Para más detalles acerca de las decisiones de diseño y las reglas de gobernanza del repositorio, consulta la [Documentación de Arquitectura](docs/architecture.md).

---

## 🚀 Comenzando

### Prerrequisitos

- Node.js (v18.x o superior)
- npm (v9.x o superior)

### Instalación

1. Clona el repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd ecommerce-nextjs
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

### Desarrollo Local

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

---

## 📏 Estándares y Calidad del Código

Para mantener la consistencia en el formato del código de todo el equipo, se han configurado reglas estrictas de Prettier y ESLint.

### Comandos de Utilidad

- **Iniciar servidor de desarrollo**: `npm run dev`
- **Construir para producción**: `npm run build`
- **Ejecutar análisis estático (Linter)**: `npm run lint`
- **Corregir y formatear el código**: `npm run format`
- **Verificar formato del código**: `npm run format:check`

---

## 🤝 Flujo de Colaboración (Git Flow)

1. Crea tu rama desde `develop`: `git checkout -b feature/<feature-name>-<desc>`
2. Desarrolla la lógica dentro de `/features/<feature-name>` y conéctala en su respectiva `/app/<route>/page.tsx`.
3. Ejecuta `npm run format` y `npm run lint` antes de hacer commit.
4. Sube tu rama y abre un Pull Request hacia `develop`.
5. Consigue al menos la revisión de un compañero de equipo antes de integrar los cambios.
