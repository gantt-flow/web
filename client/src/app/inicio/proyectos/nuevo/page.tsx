import Image from "next/image";
import Button from "@/components/ui/button";


export default function Proyectos(){
    return(
        <div className="flex flex-row w-full">

            <div className="flex flex-col mt-2 px-6">
                <div>
                    <h1 className="text-3xl">Nuevo proyecto</h1>
                </div>

                <div className="flex flex-col flex-1">
                    <form className="flex flex-col mt-10 gap-5">
                        <div>
                            <label htmlFor="projectName">Dale un nombre a tu proyecto</label>
                            <div className="mt-2">
                                <input
                                id="first-name"
                                name="first-name"
                                type="text"
                                autoComplete="given-name"
                                className="block w-64 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="projectDescription">Agrega una pequeña descripción</label>
                                <div className="mt-2">
                                    <input
                                    id="first-name"
                                    name="first-name"
                                    type="text"
                                    autoComplete="given-name"
                                    className="block w-64 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                        </div>
                        
                        <div>
                            <label htmlFor="projectDescription">¿Cuándo comienza tu proyecto?</label>
                                <div className="mt-2">
                                    <input
                                    id="first-name"
                                    name="first-name"
                                    type="date"
                                    autoComplete="given-name"
                                    className="block w-64 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                        </div>
                        
                        <div>
                            <label htmlFor="projectDescription">¿Sabes cuando termina tu proyecto?</label>
                                <div className="mt-2">
                                    <input
                                    id="first-name"
                                    name="first-name"
                                    type="date"
                                    autoComplete="given-name"
                                    className="block w-64 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                        </div>

                        <Button 
                            text="Registrar proyecto" 
                            type="button" 
                            className="w-44 p-2 mt-8 cursor-pointer rounded-lg bg-green-500 border border-gray-200 hover:bg-gray-100 hover:text-green-500" 
                            redirectTo="/registrarProyecto"
                        />
                    </form>
                </div>                
            </div>
                
            <div className="flex flex-col justify-center ml-2">
                <Image src="/newProjectTemplate.svg" alt="Magnigier Icon" width={937} height={616} />
            </div>
        </div>
    )
}