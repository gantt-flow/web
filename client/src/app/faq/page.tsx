'use client'; // <-- Importante para la interactividad del acordeón

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

/**
 * Componente reutilizable para un solo ítem del FAQ
 * Maneja su propio estado de apertura/cierre
 */
interface FaqItemProps {
  question: string;
  children: React.ReactNode; // Permite respuestas con formato (listas, etc.)
}

function FaqItem({ question, children }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-lg font-medium text-gray-800 dark:text-gray-100">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100 pb-5' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="text-gray-700 dark:text-gray-300 space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Página principal de FAQ
 */
export default function FaqPage() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      
      {/* --- 1. ENCABEZADO --- */}
      <header className="bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-8 py-16 text-center">
          <HelpCircle className="w-16 h-16 mx-auto text-green-500 dark:text-green-500 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100">
            Preguntas Frecuentes
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            ¿Tienes dudas? Tenemos respuestas. Aquí encontrarás todo lo que necesitas saber sobre GanttFlow.
          </p>
        </div>
      </header>

      {/* --- 2. LISTA DE PREGUNTAS --- */}
      <main className="container mx-auto max-w-4xl p-8 md:p-12">
        
        {/* --- Sección: Generales --- */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          Generales
        </h2>
        <div className="space-y-4 mb-12">
          
          <FaqItem question="¿Qué es GanttFlow?">
            <p>
              GanttFlow es una plataforma moderna de gestión de proyectos diseñada para ayudarte a planificar, visualizar y gestionar tus tareas de forma colaborativa. Usamos diagramas de Gantt interactivos para darte una visión clara de tus plazos y dependencias.
            </p>
          </FaqItem>

          <FaqItem question="¿Ofrecen un plan gratuito o un período de prueba?">
            <p>
              ¡Sí! Ofrecemos un plan gratuito con funciones esenciales para equipos pequeños, así como un período de prueba en nuestros planes premium para que puedas explorar todas las características avanzadas.
            </p>
          </FaqItem>

          <FaqItem question="¿Para qué tipo de equipos es ideal GanttFlow?">
            <p>
              GanttFlow es ideal para cualquier equipo que necesite gestionar proyectos con plazos definidos, como equipos de desarrollo de software, agencias de marketing, organizadores de eventos, equipos de construcción y más.
            </p>
          </FaqItem>
        </div>

        {/* --- Sección: Características --- */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          Características
        </h2>
        <div className="space-y-4 mb-12">
          
          <FaqItem question="¿Puedo colaborar con mi equipo en un mismo proyecto?">
            <p>
              ¡Absolutamente! La colaboración es el núcleo de GanttFlow. Puedes invitar a miembros a tus proyectos, asignarles tareas y gestionar sus permisos para controlar quién puede ver o editar qué partes del proyecto.
            </p>
          </FaqItem>

          <FaqItem question="¿Cómo funcionan las dependencias de tareas?">
            <p>
              Puedes crear dependencias fácilmente (ej: "Tarea B no puede empezar hasta que Tarea A termine") directamente en el gráfico. Si una tarea se retrasa, GanttFlow te mostrará automáticamente cómo afecta al resto de tu cronograma.
            </p>
          </FaqItem>

          <FaqItem question="¿Puedo asignar una tarea a múltiples usuarios?">
            <p>
              Sí, puedes asignar una o más personas a cada tarea. Esto asegura que todos los responsables estén al tanto y puedan reportar su progreso.
            </p>
          </FaqItem>

        </div>

        {/* --- Sección: Seguridad y Cuenta --- */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          Seguridad y Cuenta
        </h2>
        <div className="space-y-4">
          
          <FaqItem question="¿Mi información está segura en GanttFlow?">
            <p>
              La seguridad es nuestra máxima prioridad. Usamos encriptación robusta para tus datos y ofrecemos funciones de seguridad avanzadas como la Autenticación de Dos Factores (2FA) y Logs de Auditoría para que tengas un control total sobre tu cuenta.
            </p>
          </FaqItem>
          
          <FaqItem question="¿Qué es la Autenticación de Dos Factores (2FA)?">
            <p>
              Es una capa extra de seguridad. Además de tu contraseña, se te pedirá un segundo código (generalmente desde una app en tu teléfono) para verificar tu identidad. Recomendamos a todos los usuarios activarla desde su página de Ajustes.
            </p>
          </FaqItem>

          <FaqItem question="¿Cómo puedo cambiar mi contraseña?">
            <p>
              Puedes cambiar tu contraseña en cualquier momento. Simplemente ve a la sección de "Ajustes" en tu perfil, y encontrarás la opción en la pestaña de "Seguridad".
            </p>
          </FaqItem>

          <FaqItem question="¿Cómo personalizo mi tema (modo claro/oscuro)?">
            <p>
              En la página de "Ajustes", en la pestaña de "Apariencia", puedes elegir entre el tema claro, oscuro, o "Predeterminado del Sistema", que se adaptará automáticamente a la configuración de tu sistema operativo.
            </p>
          </FaqItem>

        </div>
      </main>
    </div>
  );
}