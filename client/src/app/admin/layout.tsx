import Header from '@/components/header';
import Sidebar from "@/components/admin/sidebar";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from "@/components/theme-provider";
import { Fira_Sans } from "next/font/google";

// Configuración de la fuente (igual que en el layout principal)
const firaSans = Fira_Sans({
  weight: ["500", "800"],
  style: "normal",
  subsets: ["latin"],
});

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
    // Aplicamos la fuente y el tema al contenedor principal
    <div className={`${firaSans.className} antialiased`}>
      {/* Envolvemos con ThemeProvider igual que en el layout principal */}
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {/* Mantenemos el AuthProvider para la autenticación */}
        <AuthProvider>
          {/* Cambiamos las clases para soportar tema claro/oscuro */}
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
              <Sidebar />
              
              {/* --- CONTENEDOR PRINCIPAL CORREGIDO --- */}
              <div className="flex flex-1 flex-col overflow-hidden">
                  
                  {/* El Header ahora soportará tema oscuro automáticamente */}
                  <header className="flex-shrink-0">
                    <Header />
                  </header>

                  {/* El área principal también soporta tema oscuro */}
                  <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-800">
                      {children} 
                  </main>
              </div>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}