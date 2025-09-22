import { ShieldCheck } from 'lucide-react';
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

export default function PoliticaPrivacidadPage() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      
      {/* --- 1. ENCABEZADO --- */}
      <header className="bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-8 py-16 text-center">
          {/* Aplicando el color 'green' solicitado */}
          <ShieldCheck className="w-16 h-16 mx-auto text-green-600 dark:text-green-400 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100">
            Política de Privacidad
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            Última actualización: 16 de Septiembre, 2025.
          </p>
        </div>
      </header>

      {/* --- 2. CONTENIDO LEGAL --- */}
      <main className="container mx-auto max-w-3xl p-8 md:p-12">
        <SectionTitle>1. Introducción</SectionTitle>
        <p>
          Bienvenido a GanttFlow ("nosotros", "nuestro", o "el Servicio"). Nos tomamos tu privacidad muy en serio. Esta Política de Privacidad explica qué información personal recopilamos, cómo la usamos, cómo la protegemos y qué derechos tienes sobre ella.
        </p>
        <p>
          Esta política forma parte de nuestros 
          <Link href="/terminos-y-condiciones" passHref>
            <span className="text-green-600 dark:text-green-400 hover:underline cursor-pointer">
              {" "}Términos y Condiciones
            </span>
          </Link>.
        </p>
        
        <SectionTitle>2. Qué Información Recopilamos</SectionTitle>
        
        <SectionSubTitle>Información que nos proporcionas</SectionSubTitle>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
          <li>
            <strong>Datos de la Cuenta:</strong> Al registrarte, recopilamos tu nombre, dirección de correo electrónico y una contraseña (que almacenamos de forma segura usando un hash criptográfico).
          </li>
          <li>
            <strong>Datos del Proyecto (Tu Contenido):</strong> Recopilamos y almacenamos los datos que creas activamente en la plataforma, como nombres de proyectos, tareas, plazos, comentarios y archivos adjuntos.
          </li>
          <li>
            <strong>Comunicaciones:</strong> Si nos contactas por correo electrónico o a través de nuestro formulario de contacto, guardaremos un registro de esa comunicación.
          </li>
        </ul>

        <SectionSubTitle>Información que recopilamos automáticamente</SectionSubTitle>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
          <li>
            <strong>Cookies y Sesiones:</strong> Usamos cookies (pequeños archivos en tu navegador) para mantener tu sesión iniciada (autenticación) y recordar tus preferencias (como el tema claro/oscuro).
          </li>
          <li>
            <strong>Datos de Uso y Logs:</strong> Recopilamos información sobre cómo interactúas con el Servicio, como las páginas que visitas, las funciones que usas y las acciones que realizas. Esto nos ayuda a mejorar el producto y a monitorear la seguridad (Logs de Auditoría).
          </li>
        </ul>

        <SectionTitle>3. Cómo Usamos tu Información</SectionTitle>
        <P>Usamos tu información para los siguientes propósitos:</P>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
          <li><strong>Para proveer y mantener el Servicio:</strong> Autenticar tu cuenta, mostrar tus proyectos y tareas, y permitir la colaboración.</li>
          <li><strong>Para mejorar el Servicio:</strong> Analizar cómo se usa la plataforma para identificar errores y desarrollar nuevas características.</li>
          <li><strong>Para proteger el Servicio:</strong> Monitorear actividades sospechosas, prevenir el fraude y hacer cumplir nuestros Términos y Condiciones.</li>
          <li><strong>Para comunicarnos contigo:</strong> Enviarte notificaciones importantes del servicio, responder a tus solicitudes de soporte y (si lo permites) enviarte noticias sobre el producto.</li>
        </ul>
        <p className="font-bold text-gray-800 dark:text-white">
          Nunca venderemos tu información personal a terceros. No tenemos interés en monetizar tus datos personales.
        </p>
        
        <SectionTitle>4. Cómo Protegemos tu Información</SectionTitle>
        <p>
          La seguridad de tus datos es una prioridad fundamental para nosotros. Implementamos las siguientes medidas:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
          <li><strong>Encriptación en Tránsito:</strong> Todo el tráfico entre tu navegador y nuestros servidores está encriptado usando SSL (HTTPS).</li>
          <li><strong>Hasheo de Contraseñas:</strong> Nunca almacenamos tu contraseña en texto plano. Usamos algoritmos de hasheo robustos y unidireccionales.</li>
          <li><strong>Autenticación de Dos Factores (2FA):</strong> Ofrecemos 2FA como una capa adicional de seguridad para tu cuenta y te recomendamos encarecidamente que la actives.</li>
          <li><strong>Control de Acceso:</strong> Nuestro personal tiene un acceso estrictamente limitado a tus datos, y solo para fines de soporte o mantenimiento.</li>
        </ul>
        <p>
          Aunque ninguna medida de seguridad es perfecta, nos esforzamos por utilizar las mejores prácticas de la industria para proteger tus datos.
        </p>

        <SectionTitle>5. Tus Derechos y Opciones</SectionTitle>
        <p>
          Tienes control sobre tu información personal:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
          <li><strong>Acceso y Modificación:</strong> Puedes revisar y actualizar la información de tu perfil en cualquier momento desde la página de "Ajustes".</li>
          <li><strong>Eliminación de Cuenta:</strong> Puedes solicitar la eliminación de tu cuenta y de todos tus datos asociados contactándonos. Procesaremos tu solicitud en un plazo de tiempo razonable.</li>
          <li><strong>Cookies:</strong> Puedes configurar tu navegador para que rechace las cookies, aunque esto puede hacer que algunas partes del Servicio no funcionen correctamente (como mantenerte conectado).</li>
        </ul>

        <SectionTitle>6. Privacidad de Menores</SectionTitle>
        <p>
          Nuestro Servicio no está dirigido a personas menores de 13 años (o la edad mínima legal en tu jurisdicción). No recopilamos intencionadamente información de menores. Si descubrimos que lo hemos hecho, tomaremos medidas para eliminar esa información.
        </p>

        <SectionTitle>7. Cambios a esta Política</SectionTitle>
        <p>
          Podemos actualizar esta Política de Privacidad de vez en cuando. Si realizamos cambios significativos, te lo notificaremos por correo electrónico o mediante un aviso destacado dentro de la aplicación antes de que los cambios entren en vigor.
        </p>

        <SectionTitle>8. Contacto</SectionTitle>
        <p>
          Si tienes alguna pregunta sobre esta Política de Privacidad, puedes contactarnos a través de nuestra 
          <Link href="/contacto" passHref>
            <span className="text-green-600 dark:text-green-400 hover:underline cursor-pointer">
              {" "}página de contacto
            </span>
          </Link>
          {" "}o escribiéndonos a ganttflowteam@gmail.com.
        </p>
      </main>
    </div>
  );
}