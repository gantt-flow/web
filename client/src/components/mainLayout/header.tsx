import Link from "next/link";
import Button from "@/components/ui/button";

export default function Header() {
  return (
    <header className="flex flex-row items-center p-5 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <Link href="/">
        <img
          className="dark:invert"
          src="/logo.svg"
          alt="GanttFlow Logo"
          width={180}
          height={37}
          style={{ height: '37px' }}
        />
      </Link>

      <nav className="flex items-center flex-1 ml-10 space-x-8">
        <Link className="text-lg text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400" href="/sobre-nosotros">
          Sobre nosotros
        </Link>
        <Link className="text-lg text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400" href="/por-que-ganttflow">
          ¿Por qué GanttFlow?
        </Link>
      </nav>

      <div className="flex flex-row items-center ml-auto gap-4">
        <Button 
          text="Iniciar Sesión" 
          type="button" 
          className="px-4 py-2 rounded-lg text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-green-500 dark:hover:text-green-400" 
          redirectTo="/auth/login"
        />
        <Button 
          text="Registrarse" 
          type="button" 
          className="px-4 py-2 rounded-lg bg-green-500 text-white border border-green-500 hover:bg-green-600 dark:bg-green-600 dark:border-green-600 dark:hover:bg-green-700" 
          redirectTo="/auth/signUp"
        />
      </div>
    </header>
  );
}
