import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full p-5 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Columna 1: Logo y Redes Sociales */}
        <div className="flex flex-col">
          <img
            className="dark:invert mb-4"
            src="/logo.svg"
            alt="GanttFlow Logo"
            width={150}
            height={32}
            style={{ height: '32px' }} // Se agrega estilo en línea para mantener la altura
          />
          <p className="text-gray-600 dark:text-gray-400 mb-4">Planifica mejor. Trabaja más inteligente.</p>
          <div className="flex flex-row gap-4">
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 flex items-center"
              aria-label="X (Twitter) Profile"
            >
                <img src="/xLogo.svg" alt="X (Twitter)" width={24} height={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg flex items-center"
              aria-label="Instagram Profile"
            >
                <img src="/instagramLogo.svg" alt="Instagram" width={24} height={24} />
            </a>
            <a
              href="https://github.com/gantt-flow"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg flex items-center"
              aria-label="GitHub Profile"
            >
                <img src="/githubLogo.svg" alt="GitHub" width={24} height={24} />
            </a>
            </div>
        </div>

        {/* Columna 2: Links de Navegación */}
        <div>
          <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Navegación</h4>
          <div className="flex flex-col space-y-2">
            <Link className="text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400" href="/sobre-nosotros">Sobre nosotros</Link>
            <Link className="text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400" href="/faq">FAQ</Link>
            <Link className="text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400" href="/costos">Costos</Link>
          </div>
        </div>
        
        {/* Columna 3: Links Legales */}
        <div>
          <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Legal</h4>
          <div className="flex flex-col space-y-2">
            <Link className="text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400" href="/terminos-y-condiciones">Términos y Condiciones</Link>
            <Link className="text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400" href="/politica-de-privacidad">Política de privacidad</Link>
          </div>
        </div>

      </div>
      <div className="text-center text-gray-500 dark:text-gray-400 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p>© {new Date().getFullYear()} GanttFlow. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}