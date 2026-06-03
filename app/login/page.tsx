"use client";

import { useState } from "react";
import { RegisterForm } from "../../features/auth/components/RegisterForm";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-zinc-100 selection:bg-indigo-500/30">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800/50 bg-zinc-900/50 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            {isLogin ? "Bienvenido de nuevo" : "Crear una cuenta"}
          </h1>
          <p className="text-sm text-zinc-400">
            {isLogin 
              ? "Ingresa tus credenciales para continuar" 
              : "Únete a nuestra plataforma de e-commerce"}
          </p>
        </div>

        {isLogin ? (
          <div className="py-8 text-zinc-500">Formulario de Login en desarrollo...</div>
        ) : (
          <RegisterForm />
        )}

        <div className="mt-6 text-sm text-zinc-400">
          {isLogin ? "¿No tienes una cuenta? " : "¿Ya tienes una cuenta? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline transition-colors focus:outline-none"
          >
            {isLogin ? "Regístrate aquí" : "Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}
