import Header from '@/components/header';
import Sidebar from "@/components/sidebar";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// La función DEBE ser 'async' para poder usar await
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Usamos 'await' como señal para Next.js de que esta es una ruta dinámica
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  // 2. Comprobar si el token existe.
  if (!token) {
    redirect('/auth/login');
  }

  // 3. El resto del código es correcto.
  return (
    // El contenedor raíz sigue igual: flex y altura completa.
    <div className="flex h-screen bg-gray-50 text-gray-800">
        <Sidebar />
        
        {/* --- CONTENEDOR PRINCIPAL CORREGIDO --- */}
        {/*
          CAMBIO 1: `flex-1` le dice a este div que crezca y ocupe todo el espacio
          horizontal disponible que no está usando el Sidebar.
          
          CAMBIO 2: `overflow-hidden` previene cualquier desbordamiento accidental
          de este contenedor, asegurando que el único scroll sea el del <main>.
        */}
        <div className="flex flex-1 flex-col overflow-hidden">
            
            {/* El Header no necesita cambios, pero es buena práctica añadir
                flex-shrink-0 para asegurar que nunca se encoja si el contenido es muy grande. */}
            <header className="flex-shrink-0">
              <Header />
            </header>

            {/* El área de <main> sigue siendo la única con scroll.
                Ahora funcionará correctamente porque su padre (`div` de arriba)
                tiene una altura y anchura bien definidas. */}
            <main className="flex-1 overflow-y-auto">
                {children} 
            </main>
        </div>
    </div>
  );
}
