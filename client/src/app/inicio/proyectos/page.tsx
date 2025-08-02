import Button from "@/components/ui/button";


export default function Proyectos(){
    return(
        <div className="flex flex-row w-full">

            <div className="flex flex-col flex-1 ml-2 mt-2">
                <div>
                    <h1 className="text-6xl">Proyectos</h1>
                </div>

                <div className="flex flex-col flex-1 justify-center">
                    <h2 className="text-2xl text-center">¡No hay proyectos por mostrar!</h2>
                    <Button 
                        text="Nuevo proyecto" 
                        type="button" 
                        className="w-44 p-2 self-center mt-8 cursor-pointer rounded-lg bg-green-500 border border-gray-200 hover:bg-gray-100 hover:text-green-500" 
                        redirectTo="/inicio/proyectos/nuevo"
                    />
                </div>                
            </div>

        </div>
    )
}