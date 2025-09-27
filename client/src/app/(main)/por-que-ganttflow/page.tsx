// Importa los iconos que usaremos
import { BarChartHorizontal, CheckCircle, Users, ShieldCheck, Settings, Rocket, ArrowRight } from 'lucide-react';
import Link from 'next/link'; // Para el Call-to-Action

export default function PorQueGanttFlowPage() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">

      {/* --- 1. SECCIÓN DE ENCABEZADO (HERO) --- */}
      <header className="bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-8 py-20 text-center">
          <Rocket className="w-16 h-16 mx-auto text-green-500 dark:text-green-500 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Deja el Caos. Domina tus Proyectos.
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            GanttFlow no es solo un diagrama de Gantt. Es tu centro de mando unificado para planificar, colaborar y entregar proyectos a tiempo, con la seguridad que tu equipo necesita.
          </p>
          <div className="mt-10">
            <Link href="/registro" passHref>
              <span className="px-8 py-3 rounded-md bg-green-500 text-white font-semibold hover:bg-green-500 cursor-pointer text-lg">
                Empieza Gratis
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* --- 2. SECCIÓN DE "EL PROBLEMA" --- */}
      <section className="container mx-auto p-8 md:p-12 text-center max-w-4xl">
        <h2 className="text-3xl font-semibold mb-4">¿Tu gestión de proyectos es así?</h2>
        <ul className="text-lg text-gray-700 dark:text-gray-300 list-none space-y-2">
          <li>❌ Hojas de cálculo interminables y desactualizadas.</li>
          <li>❌ Cadenas de emails confusas para asignar tareas.</li>
          <li>❌ Cero visibilidad sobre quién hace qué y cuándo.</li>
          <li>❌ Preocupación por la seguridad de los datos sensibles del proyecto.</li>
        </ul>
        <p className="text-2xl font-semibold mt-8">
          Es hora de una solución moderna.
        </p>
      </section>

      <hr className="border-gray-200 dark:border-gray-700 w-1/2 mx-auto" />

      {/* --- 3. SECCIÓN DE CARACTERÍSTICAS (BENEFICIOS) --- */}
      <section className="container mx-auto p-8 md:p-12">
        <h2 className="text-3xl font-semibold mb-10 text-center">Por qué GanttFlow es Diferente</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Beneficio 1: Visualización */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <BarChartHorizontal className="w-10 h-10 text-green-500 dark:text-green-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Visualización Intuitiva</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Nuestros diagramas de Gantt interactivos te dan claridad instantánea. Ve dependencias, hitos y el progreso del proyecto de un solo vistazo.
            </p>
          </div>

          {/* Beneficio 2: Colaboración */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Users className="w-10 h-10 text-green-500 dark:text-green-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Colaboración Definida</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Asigna tareas, gestiona proyectos compartidos y define roles. Con nuestro sistema de permisos, todos saben exactamente qué deben hacer.
            </p>
          </div>

          {/* Beneficio 3: Seguridad Enterprise */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <ShieldCheck className="w-10 h-10 text-green-500 dark:text-green-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Seguridad de Nivel Empresarial</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Protege tu trabajo. Ofrecemos autenticación de dos factores (2FA) y logs de auditoría para un control y una seguridad incomparables.
            </p>
          </div>

          {/* Beneficio 4: Gestión Centralizada */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <CheckCircle className="w-10 h-10 text-green-500 dark:text-green-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Gestión Integral de Tareas</h3>
            <p className="text-gray-700 dark:text-gray-300">
              No solo es un gráfico. Es un sistema completo de gestión de tareas. Crea, asigna, actualiza y da seguimiento a cada componente de tu proyecto.
            </p>
          </div>

          {/* Beneficio 5: Personalización */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Settings className="w-10 h-10 text-green-500 dark:text-green-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Una Experiencia a tu Medida</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Adapta GanttFlow a tu forma de trabajar con temas (claro/oscuro), ajustes de notificaciones y una interfaz limpia y moderna.
            </p>
          </div>

          {/* Beneficio 6: Rendimiento */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Rocket className="w-10 h-10 text-green-500 dark:text-green-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Rápido y Moderno</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Construido con tecnología de punta (Next.js y React), GanttFlow es increíblemente rápido y responsivo, sin recargas de página innecesarias.
            </p>
          </div>

        </div>
      </section>

      {/* --- 4. CALL TO ACTION (CTA) FINAL --- */}
      <section className="container mx-auto p-8 md:py-20 text-center">
        <h2 className="text-3xl font-semibold mb-4">¿Listo para transformar tu gestión?</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Únete a los equipos que ya están planificando de forma más inteligente con GanttFlow.
        </p>
        <Link href="/auth/signUp" passHref>
          <span className="px-10 py-4 rounded-md bg-green-500 text-white font-semibold hover:bg-green-700 cursor-pointer text-xl inline-flex items-center">
            Empieza ahora
            <ArrowRight className="w-5 h-5 ml-2" />
          </span>
        </Link>
      </section>

    </div>
  );
}