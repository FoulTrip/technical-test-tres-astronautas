import { usePlanetData } from "@/hooks/useOnlyPlanet";
import { GiPlanetCore } from "react-icons/gi";

function ErrorPlanet({ planetId }: { planetId: string }) {
    const {
        error,
        router,
    } = usePlanetData(planetId);
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
            <div className="text-center space-y-6 max-w-md">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                    <GiPlanetCore className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Error al cargar datos
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {error || "No se pudieron obtener los datos del planeta"}
                    </p>
                </div>
                <button
                    onClick={() => router.push('/')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Volver al inicio
                </button>
            </div>
        </div>
    )
}

export default ErrorPlanet;