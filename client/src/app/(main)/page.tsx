import Button from "@/components/ui/button";

export default function Home() {
  return (
    <main className="container mx-auto px-5">
      <div className="flex flex-col my-16 text-center">
        <h1 className="text-[110px] font-bold text-gray-800 dark:text-gray-100">Planifica mejor.<br/>Trabaja más inteligente.</h1>
        <h2 className="text-[23px] text-gray-700 dark:text-gray-300 mt-4">La mejor forma de organizar tu equipo, tiempo y tareas. Gantt es la solución para tu proyecto.</h2>
      </div>

      <div className="flex flex-col m-auto mb-10 items-center">
        <img
          src="/diagramaEjemplo.svg"
          alt="Diagrama de Gantt Ejemplo"
          width={1000}
          height={550}
          className="rounded-lg shadow-lg"
        />

        <Button 
          text="Regístrate" 
          type="button" 
          className="mt-12 px-8 py-3 w-auto self-center rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition-colors"
          redirectTo="/auth/signUp"
        />
        <p className="mt-5 text-[18px] self-center text-gray-700 dark:text-gray-300">Mantente organizado, cumple con los plazos y colabora sin complicaciones con tu equipo.</p>
      </div>
    </main>
  );
}
