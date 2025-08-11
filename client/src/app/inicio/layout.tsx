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
    <section className='h-screen flex flex-col'>
      <header className='h-16'>
        <Header/>
      </header>
      <main className="flex flex-row flex-1">
        <Sidebar />
        {children}
      </main>
    </section>
  );
}