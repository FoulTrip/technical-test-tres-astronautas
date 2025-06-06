import { ImSpinner8 } from "react-icons/im";

function LoaderPlanet() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
            <div className="text-center space-y-4">
                <ImSpinner8 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                <p className="text-gray-600 dark:text-gray-400">Cargando información del planeta...</p>
            </div>
        </div>
    )
}

export default LoaderPlanet