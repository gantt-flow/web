import { FileText } from 'lucide-react';
import Link from 'next/link';

// Componente de ayuda para las secciones (para no repetir clases)
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 dark:text-white">
    {children}
  </h2>
);

// Componente de ayuda para sub-secciones (para no repetir clases)
const SectionSubTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-xl font-bold mt-6 mb-3 text-gray-800 dark:text-gray-100">
    {children}
  </h3>
);

// Componente de ayuda para los párrafos (para no repetir clases)
const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mb-4 text-gray-700 dark:text-gray-300">
    {children}
  </p>
);

export default function TerminosYCondicionesPage() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      
      {/* --- 1. ENCABEZADO --- */}
      <header className="bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-8 py-16 text-center">
          {/* Aplicando el color 'green' solicitado */}
          <FileText className="w-16 h-16 mx-auto text-green-600 dark:text-green-400 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100">
            Términos y Condiciones del Servicio
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            Última actualización: 16 de Septiembre, 2025.
          </p>
        </div>
      </header>

      {/* --- 2. CONTENIDO LEGAL --- */}
      <main className="container mx-auto max-w-3xl p-8 md:p-12">
        <P>
          Bienvenido a GanttFlow ("nosotros", "nuestro", o "el Servicio"). Estos Términos y Condiciones ("Términos") rigen tu acceso y uso de nuestra plataforma de gestión de proyectos.
        </P>
        <P>
          Al registrarte o utilizar nuestro Servicio, aceptas estar sujeto a estos Términos y a nuestra 
          <Link href="/politica-de-privacidad" passHref>
            <span className="text-green-600 dark:text-green-400 hover:underline cursor-pointer">
              {" "}Política de Privacidad
            </span>
          </Link>.
        </P>
        
        <SectionTitle>1. Aceptación y Descripción del Servicio</SectionTitle>
        <P>
          GanttFlow es una plataforma de software como servicio (SaaS) diseñada para la gestión de proyectos, planificación y colaboración en equipo.
        </P>
        <P>
          Actualmente, el Servicio se proporciona de forma gratuita como una "Beta Pública". Al aceptar estos términos, entiendes que el servicio está en desarrollo y puede contener errores o cambiar sin previo aviso.
        </P>

        <SectionTitle>2. Tu Cuenta y Responsabilidades</SectionTitle>
        <P>
          Debes ser mayor de edad para crear una cuenta. Eres responsable de mantener la seguridad de tu cuenta, incluyendo tu contraseña. Recomendamos encarecidamente activar la Autenticación de Dos Factores (2FA) disponible en tus ajustes.
        </P>
        <P>
          Eres el único responsable de todo el contenido ("Contenido de Usuario") que publiques y de toda la actividad que ocurra bajo tu cuenta.
        </P>

        <SectionTitle>3. Uso Aceptable</SectionTitle>
        <P>
          Te comprometes a no utilizar el Servicio para ningún propósito ilegal o no autorizado. Aceptas no:
        </P>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
          <li>Violar ninguna ley en tu jurisdicción.</li>
          <li>Intentar acceder sin autorización a nuestros sistemas o redes.</li>
          <li>Usar el servicio para enviar spam o mensajes no solicitados.</li>
          <li>Cargar o transmitir virus, malware o cualquier otro código malicioso.</li>
        </ul>

        <SectionTitle>4. Propiedad Intelectual</SectionTitle>
        <SectionSubTitle>Nuestra Propiedad</SectionSubTitle>
        <P>
          Nosotros somos propietarios de todo el software, gráficos, diseños y la marca "GanttFlow" (el "Servicio"). No te otorgamos ninguna licencia para usar nuestra marca registrada o propiedad intelectual más allá del uso previsto del Servicio.
        </P>
        <SectionSubTitle>Tu Propiedad</SectionSubTitle>
        <P>
          Tú retienes la propiedad intelectual y todos los derechos sobre el Contenido de Usuario que creas o cargas en GanttFlow (tus proyectos, tareas, archivos, etc.). Nos otorgas una licencia limitada para almacenar, procesar y mostrar tu Contenido de Usuario únicamente con el fin de proveerte el Servicio.
        </P>

        <SectionTitle>5. Cláusulas Críticas (Servicio Gratuito)</SectionTitle>
        
        {/* --- ESTA ES LA CLÁUSULA MÁS IMPORTANTE --- */}
        <h3 className="text-xl font-bold uppercase mt-6 mb-3 text-red-600 dark:text-red-400">
          5.1. SIN GARANTÍAS (Servicio "TAL CUAL")
        </h3>
        <P>
          El Servicio se proporciona "TAL CUAL" (AS IS) y "SEGÚN DISPONIBILIDAD", sin garantías de ningún tipo, ya sean expresas o implícitas.
        </P>
        <P>
          No garantizamos que el Servicio: (a) cumplirá con tus requisitos específicos; (b) será ininterrumpido, oportuno, seguro o libre de errores; (c) los resultados de su uso serán precisos o confiables; o (d) cualquier error en el Servicio será corregido.
        </P>

        {/* --- ESTA ES LA SEGUNDA CLÁUSULA MÁS IMPORTANTE --- */}
        <h3 className="text-xl font-bold uppercase mt-6 mb-3 text-red-600 dark:text-red-400">
          5.2. LIMITACIÓN DE RESPONSABILIDAD
        </h3>
        <P>
          En la máxima medida permitida por la ley, GanttFlow (incluyendo sus fundadores, empleados y afiliados) no será responsable de ningún daño indirecto, incidental, especial, consecuente o punitivo.
        </P>
        <P>
          Esto incluye, entre otros, la pérdida de ganancias, datos, uso, fondo de comercio u otras pérdidas intangibles, resultantes de: (a) tu acceso o incapacidad para acceder o usar el Servicio; (b) cualquier error, bug o interrupción del Servicio; (c) cualquier conducta o contenido de terceros en el Servicio.
        </P>
        
        <SectionTitle>6. Modificación y Terminación</SectionTitle>
        <P>
          Nos reservamos el derecho de modificar, suspender o descontinuar el Servicio (o cualquier parte de él) en cualquier momento, con o sin previo aviso.
        </P>
        <P>
          Nos reservamos el derecho de introducir planes de pago o cobrar por características en el futuro. Te notificaremos con antelación si algún cambio afecta tu cuenta.
        </P>
        <P>
          Podemos suspender o cancelar tu cuenta de inmediato si violas gravemente cualquiera de estos Términos.
        </P>

        <SectionTitle>7. Ley Aplicable</SectionTitle>
        <P>
          Estos Términos se regirán e interpretarán de acuerdo con las leyes de Jalisco, México, sin tener en cuenta sus disposiciones sobre conflicto de leyes.
        </P>

        <SectionTitle>8. Contacto</SectionTitle>
        <P>
          Si tienes alguna pregunta sobre estos Términos y Condiciones, puedes contactarnos a través de nuestra 
          <Link href="/contacto" passHref>
            <span className="text-green-600 dark:text-green-400 hover:underline cursor-pointer">
              {" "}página de contacto
            </span>
          </Link>
          {" "}o escribiéndonos a ganttflowteam@gmail.com.
        </P>
      </main>
    </div>
  );
}