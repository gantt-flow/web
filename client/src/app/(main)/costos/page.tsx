import { Gift, CheckCircle, Rocket } from 'lucide-react';
import Link from 'next/link';

export default function PreciosPage() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">

      {/* --- 1. ENCABEZADO --- */}
      <header className="bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-8 py-16 text-center">
          {/* Aplicando el color 'green' solicitado */}
          <Gift className="w-16 h-16 mx-auto text-green-600 dark:text-green-400 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100">
            Acceso Gratuito a la Beta
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            GanttFlow es un proyecto en desarrollo activo. Queremos que lo pruebes y nos ayudes a mejorarlo. Por eso, durante toda nuestra fase Beta, el acceso es 100% gratuito.
          </p>
        </div>
      </header>

      {/* --- 2. TARJETA DE "PLAN BETA" --- */}
      <main className="container mx-auto max-w-4xl p-8 md:p-12">

        {/* --- 3. SECCIÓN DE EXPECTATIVAS --- */}
        <section className="mt-16 text-center max-w-3xl mx-auto">
          <Rocket className="w-12 h-12 mx-auto text-green-600 dark:text-green-400 mb-4" />
          <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-white">
            El Futuro de GanttFlow
          </h2>
          <div className="text-gray-700 dark:text-gray-300 space-y-4 text-lg">
            <p>
              Nuestro objetivo es construir la mejor herramienta de gestión de proyectos posible. Mientras estemos en Beta, nos centraremos en escuchar tus comentarios y perfeccionar la plataforma.
            </p>
            <p>
              En el futuro, planeamos introducir planes de pago para equipos grandes y con necesidades empresariales. Sin embargo, nos comprometemos a que nuestros usuarios Beta fundadores siempre tendrán un lugar especial, ya sea con un plan gratuito generoso o un gran descuento de por vida.
            </p>
            <p className="font-semibold text-gray-800 dark:text-white">
              ¡Tu opinión ahora es nuestra mayor inversión!
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}

// Componente de ayuda para la lista de características
const FeatureListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-center space-x-3">
    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
    <span className="text-gray-700 dark:text-gray-300">{children}</span>
  </li>
);