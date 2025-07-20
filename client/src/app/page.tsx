import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <header className="flex flex-row m-5">
        <Image
        className="dark:invert"
        src="/logo.svg"
        alt="Gantt Logo"
        width={180}
        height={37}
        priority
        />

        <div className="flex items-center flex-1">
          <Link className="ml-10 text-[18px]" href="">Inicio</Link>
          <Link className="ml-10 text-[18px]" href="">¿Por qué GanttFlow?</Link>
        </div>
        

        <div className="flex flex-row ml-auto gap-5">
          <Button text="Iniciar Sesión" type="button" className="p-2 rounded-lg  #FFFFFF border border-gray-200 hover:bg-gray-100 hover:text-green-500" redirectTo="/auth/login"/>
          <Button text="Registrarse" type="button" className="p-2 rounded-lg bg-green-500 border border-gray-200 hover:bg-gray-100 hover:text-green-500" redirectTo="/auth/signUp"/>
        </div>
        
      </header>

      <main className="flex flex-col m-5">

        <div className="flex flex-col m-auto">
          <h1 className="text-[110px] text-center">Planifica mejor.<br></br>Trabaja más inteligente.</h1>
          <h2 className="text-[23px] text-center">La mejor forma de organizar tu equipo, tiempo y tareas. Gantt es la solución para tu proyecto.</h2>
        </div>

        <div className="flex flex-col m-auto mt-10 mb-10">
          <Image
          className="dark:invert"
          src="/diagramaEjemplo.svg"
          alt="Diagrama de Gantt Ejemplo"
          width={1000}
          height={550}
          />

          <Button text="Registrate" type="button" className="p-2 w-1/6 self-center rounded-lg bg-green-500 hover:bg-gray-100 hover:text-green-500"></Button>
          <p className="mt-5 text-[18px] self-center">Mantente organizado, cumple con los plazos y colabora sin complicaciones con tu equipo.</p>

        </div>
        
      </main>

      <footer className="flex flex-row m-5">

          <div className="flex flex-col basis-1/3 mt-10">
            <Image
              className="dark:invert"
              src="/logo.svg"
              alt="Gantt Logo"
              width={180}
              height={80}
              priority
            />

            <div className="flex flex-row gap-4 mt-4 mb-10">
              <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 flex items-center"
                  aria-label="X (Twitter) Profile"
              >
                <Image src="/xLogo.svg" alt="X (Twitter)" width={24} height={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg flex items-center"
                aria-label="Instagram Profile"
              >
                <Image src="/instagramLogo.svg" alt="Instagram" width={24} height={24} />
              </a>
              <a
                href="https://github.com/gantt-flow"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg flex items-center"
                aria-label="GitHub Profile"
              >
                <Image src="/githubLogo.png" alt="GitHub" width={24} height={24} />
              </a>
            </div>

            <p className="mb-2">© 2025 Gantt Flow Team.</p>
            <p>Todos los derechos reservados.</p>

          </div>

          <div className="flex flex-col mt-10">
            <h4 className="font-bold">Equipo</h4>
            <p className="font-ligth mt-4">Sobre nosotros</p>
            <p className="font-ligth">FAQ</p>
            <p className="font-ligth">Desarrolladores</p>
          </div>
      </footer>
    </div>
  );
}
