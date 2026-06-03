"use client";

import { useState } from "react";

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.email || !formData.password) {
      setError("Por favor, completa todos los campos");
      return;
    }

    // Simulamos la llamada a la API
    console.log("Iniciando sesión:", formData);
    setSuccess(true);
    
    // NOTA: Según las reglas de la Épica de Autenticación, 
    // nuestra responsabilidad termina aquí. NO hacemos redirección
    // al catálogo ni a otros módulos.
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20 text-left">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-500 border border-green-500/20 text-left">
          ¡Inicio de sesión exitoso! (Redirección deshabilitada temporalmente)
        </div>
      )}
      
      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-email" className="text-sm font-medium text-zinc-300 text-left">
          Correo electrónico
        </label>
        <input
          id="login-email"
          type="email"
          required
          className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          placeholder="correo@ejemplo.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-password" className="text-sm font-medium text-zinc-300 text-left flex justify-between">
          <span>Contraseña</span>
          <a href="#" className="text-indigo-400 hover:text-indigo-300 text-xs hover:underline mt-0.5">
            ¿Olvidaste tu contraseña?
          </a>
        </label>
        <input
          id="login-password"
          type="password"
          required
          className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-950 transition-all active:scale-[0.98]"
      >
        Iniciar sesión
      </button>
    </form>
  );
}
