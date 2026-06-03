# Módulo de Autenticación (Épica Auth)

## Descripción General
Este módulo contiene los componentes de interfaz de usuario y la lógica de estado local para el registro y el inicio de sesión de los usuarios en la plataforma de E-Commerce.

## Restricciones Arquitectónicas
Cumpliendo con las directrices del Sprint y el aislamiento funcional, este módulo:
- Está estrictamente contenido en `/features/auth` y `/app/login`.
- No modifica la configuración base ni el layout principal (`layout.tsx`).
- Finaliza su responsabilidad en el momento en que el usuario inicia sesión. No realiza redirecciones al catálogo ni maneja perfiles de historial de compra, delegando esto a otras épicas.

## Componentes Desarrollados

### 1. `RegisterForm` (`/features/auth/components/RegisterForm.tsx`)
Formulario modular de registro que recopila:
- Nombre completo
- Correo electrónico
- Contraseña
- Confirmación de contraseña

**Características Técnicas:**
- Validación básica de contraseñas (longitud mínima de 6 caracteres y coincidencia exacta).
- Manejo de estados de error y éxito mediante `useState`.
- Diseño responsivo y moderno utilizando Tailwind CSS con una paleta basada en `zinc` e `indigo`.

### 2. `LoginForm` (`/features/auth/components/LoginForm.tsx`)
Formulario modular de inicio de sesión que requiere:
- Correo electrónico
- Contraseña

**Características Técnicas:**
- Validación estricta de campos requeridos.
- Integración preparada (mock) para futura conexión con un manejador de estado global o API de autenticación real.

### 3. Contenedor de Ruta (`/app/login/page.tsx`)
Ruta aislada que actúa como orquestador para los componentes de autenticación.
- Utiliza estado local (`isLogin`) para alternar dinámicamente entre `LoginForm` y `RegisterForm` sin necesidad de recargar la página.
- Implementa una interfaz de tarjeta centrada con efectos de "glassmorphism" (`backdrop-blur`) para un diseño visualmente atractivo y premium.

## Historias de Usuario Completadas
- **[US-01]** As a user I want to register to create an account.
- **[US-02]** As a user I want to log in to access my account.
