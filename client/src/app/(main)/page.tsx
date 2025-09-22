import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto px-5">

        <div className="flex flex-col">
          <h1 className="text-[110px] text-center">Planifica mejor.<br></br>Trabaja más inteligente.</h1>
          <h2 className="text-[23px] text-center">La mejor forma de organizar tu equipo, tiempo y tareas. Gantt es la solución para tu proyecto.</h2>
        </div>

        <div className="flex flex-col m-auto mb-10">
          <Image
          className="dark:invert"
          src="/diagramaEjemplo.svg"
          alt="Diagrama de Gantt Ejemplo"
          width={1000}
          height={550}
          />

          <Button 
            text="Registrate" 
            type="button" 
            className="p-2 w-1/6 self-center rounded-lg bg-green-500 hover:bg-gray-100 hover:text-green-500"
            redirectTo="/auth/signUp"
          />
          <p className="mt-5 text-[18px] self-center">Mantente organizado, cumple con los plazos y colabora sin complicaciones con tu equipo.</p>

        </div>
        
    </div>
  );
}
