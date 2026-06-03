export default function AdminPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-zinc-100">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
        <h1 className="text-2xl font-bold tracking-tight text-white">Panel de Administración</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Ruta aislada para administración (/features/admin)
        </p>
      </div>
    </div>
  );
}
