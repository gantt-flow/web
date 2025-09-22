// Asegúrate de tener 'lucide-react' instalado
// npm install lucide-react
import { Rocket, Users, Heart, Eye, Target } from 'lucide-react';
import Image from 'next/image'; // Importa el componente de Imagen de Next.js

export default function SobreNosotrosPage() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      
      {/* --- 1. SECCIÓN DE ENCABEZADO (HERO) --- */}
      <header className="relative w-full">
        {/* Puedes reemplazar este div con un componente Image de Next.js */}
        <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 opacity-50">
          {/* Ejemplo de cómo usar una imagen de fondo (requiere configuración):
          <Image 
            src="/images/nuestra-oficina.jpg" // Asegúrate de que esta ruta exista en /public
            alt="Nuestra oficina" 
            layout="fill" 
            objectFit="cover" 
          />
          */}
        </div>
        
        {/* Contenido superpuesto */}
        <div className="relative z-10 flex flex-col items-center justify-center h-80 text-center p-4 bg-green-500 bg-opacity-40">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Sobre Nosotros
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl">
            {/* Reemplaza con tu eslogan o frase principal */}
            Conoce la historia, el equipo y los valores que impulsan nuestro proyecto.
          </p>
        </div>
      </header>

      {/* --- 2. CONTENIDO PRINCIPAL --- */}
      <main className="container mx-auto p-8 md:p-12 space-y-16">

        {/* --- NUESTRA MISIÓN --- */}
        <section className="max-w-4xl mx-auto text-center">
          <Target className="w-16 h-16 mx-auto text-green-500 dark:text-green-500 mb-4" />
          <h2 className="text-3xl font-semibold mb-4">Nuestra Misión</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {/* Reemplaza este texto */}
            "Nuestra misión es [tu misión principal, ej: simplificar la gestión de proyectos para equipos creativos] a través de [tu método o tecnología], ofreciendo siempre [tu valor diferencial, ej: un servicio al cliente excepcional]."
          </p>
        </section>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* --- NUESTRA HISTORIA --- */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-center">Nuestra Historia</h2>
          <div className="text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              {/* Reemplaza este texto */}
              Fundada en [Año], [Nombre de tu Empresa] comenzó como una idea simple: [la idea original]. Nuestros fundadores, [Nombres de Fundadores], vieron una oportunidad en [tu industria] y decidieron construir una solución desde cero.
            </p>
            <p>
              {/* Reemplaza este texto */}
              Lo que empezó en [lugar, ej: un pequeño garaje], se ha transformado en una plataforma que hoy ayuda a [número] de usuarios. A lo largo del camino, hemos [logro importante] y [otro hito], pero nuestros valores fundamentales permanecen intactos.
            </p>
          </div>
        </section>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* --- NUESTRO EQUIPO --- */}
        <section>
          <h2 className="text-3xl font-semibold mb-8 text-center">Conoce al Equipo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            
            {/* --- Perfil de Miembro (Repetir este bloque) --- */}
            <div className="text-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Placeholder para la foto */}
              <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                {/* Ejemplo con Imagen:
                <Image 
                  src="/images/equipo/nombre.jpg" 
                  alt="Foto de [Nombre]" 
                  width={128} 
                  height={128}
                  className="object-cover"
                />
                */}
                <Users className="w-16 h-16 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold">[Nombre del Miembro]</h3>
              <p className="text-indigo-600 dark:text-indigo-400">[Cargo/Rol]</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                "Pequeña biografía o cita inspiradora sobre su trabajo."
              </p>
            </div>
            {/* --- Fin del Perfil --- */}

            {/* Agrega más perfiles copiando el bloque anterior */}
            <div className="text-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-16 h-16 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold">[Nombre del Miembro]</h3>
              <p className="text-indigo-600 dark:text-indigo-400">[Cargo/Rol]</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                "Experto en [habilidad], apasionado por [interés]."
              </p>
            </div>

            <div className="text-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-16 h-16 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold">[Nombre del Miembro]</h3>
              <p className="text-indigo-600 dark:text-indigo-400">[Cargo/Rol]</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                "Impulsando el crecimiento y la estrategia de la empresa."
              </p>
            </div>
            
          </div>
        </section>
        
        <hr className="border-gray-200 dark:border-gray-700" />

        {/* --- NUESTROS VALORES --- */}
        <section className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Valor 1 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                <Heart className="w-8 h-8 text-indigo-600 dark:text-indigo-300" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Integridad</h3>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  Actuamos con honestidad y transparencia en cada decisión.
                </p>
              </div>
            </div>
            
            {/* Valor 2 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                <Rocket className="w-8 h-8 text-indigo-600 dark:text-indigo-300" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Innovación</h3>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  Buscamos constantemente nuevas y mejores formas de hacer las cosas.
                </p>
              </div>
            </div>

            {/* Valor 3 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                <Eye className="w-8 h-8 text-indigo-600 dark:text-indigo-300" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Foco en el Cliente</h3>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  Nuestros usuarios son el centro de todo lo que construimos.
                </p>
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}