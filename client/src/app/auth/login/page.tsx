import Image from "next/image";

export default function Login() {
    return (
        <div className="flex flex-row h-screen">

            <div className="flex flex-col basis-1/2">

                <div className="flex flex-col w-2/3 self-center mt-30">
                    <h1 className="text-[36px]">Inicia sesión</h1>

                    <form className="flex flex-col mt-6">
                        <label>Correo</label>
                        <input type="email" className="border border-gray-300 rounded-lg p-3 mb-4" required />
                        <label className="mt-4">Contraseña</label>
                        <input type="password" className="border border-gray-300 rounded-lg p-3 mb-8" required />
                        <button type="submit" className="bg-green-500 text-white p-2 h-12 rounded-lg hover:bg-green-600">Iniciar Sesión</button>
                    </form>
                </div>
                <p className="mt-8 text-center"><a href="/auth/signUp" className="hover:underline">¿Olvidaste tu contraseña?</a></p>
                <p className="mt-4 text-center">¿No tienes cuenta? <a href="/auth/signUp" className="hover:underline">Regístrate aquí</a></p>
            </div>

            <div className="flex flex-col basis-1/2 bg-green-500">
                <div className="flex flex-col self-center mt-30">
                    <Image
                        className="dark:invert"
                        src="/ganttFlowWhite.svg"
                        alt="Gantt Logo"
                        width={346}
                        height={77}
                        priority
                    />
                </div>
                <p className="mt-30 text-center text-white text-[30px] w-2/3 self-center">La solución que necesitas para tu proyecto</p>
            </div>
        </div>
    )
}