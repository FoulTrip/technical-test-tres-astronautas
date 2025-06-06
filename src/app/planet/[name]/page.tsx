"use client"

import { usePlanetData } from "@/hooks/useOnlyPlanet"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { use } from "react"
import { GiPlanetCore } from "react-icons/gi"
import { TbArrowLeft } from "react-icons/tb"
import { ImSpinner8 } from "react-icons/im"
import { FaWind, FaWeight, FaRuler } from "react-icons/fa"
import iconOutlinePlanetFav from "@/assets/tierra.png"
import iconPlanetFav from "@/assets/tierra-color.png"
import LoaderPlanet from "@/components/loaders/LoaderPlanet"
import ErrorPlanet from "@/components/loaders/ErrorPlanet"

interface PlanetDetailsProps {
    params: Promise<{ name: string }>
}

function OnlyLotion({ params }: PlanetDetailsProps) {
    const resolvedParam = use(params);

    const router = useRouter()
    const {
        planet,
        error,
        loading,
        imagePlanet,
        imageLoading,
        imageError,
        isFavorite,
        toggleFavorites,
        formatNumber,
        formatDate,
        hasValue
    } = usePlanetData(resolvedParam.name)

    // Loading state
    if (loading) return <LoaderPlanet />

    // Error state
    if (error || !planet) return <ErrorPlanet planetId={resolvedParam.name} />

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Header Navigation */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.push('/')}
                            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <TbArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Volver</span>
                        </button>

                        <button
                            onClick={() => toggleFavorites(resolvedParam.name)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <Image
                                width={20}
                                height={20}
                                src={isFavorite(resolvedParam.name) ? iconPlanetFav : iconOutlinePlanetFav}
                                alt="Favorito"
                            />
                            <span className="text-sm font-medium">
                                {isFavorite(resolvedParam.name) ? "Favorito" : "Agregar a favoritos"}
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative">
                <div className="aspect-video md:aspect-[21/9] relative overflow-hidden">
                    {imageLoading ? (
                        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                            <ImSpinner8 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : imageError ? (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                            <div className="text-center">
                                <GiPlanetCore className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">Imagen no disponible</p>
                            </div>
                        </div>
                    ) : (
                        <Image
                            priority
                            src={imagePlanet as string}
                            alt={planet.nameES || planet.name}
                            className="w-full h-full object-cover"
                            fill
                        />
                    )}
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Hero content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                        <div className="max-w-7xl mx-auto">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-4 tracking-tight">
                                {planet.nameES || planet.name}
                            </h1>
                            {planet.description && (
                                <p className="text-lg md:text-xl text-gray-200 max-w-3xl leading-relaxed">
                                    {planet.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="space-y-16">
                    {/* Physical Characteristics */}
                    <section>
                        <div className="mb-8">
                            <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white mb-2">
                                Características físicas
                            </h2>
                            <div className="w-12 h-1 bg-blue-600 rounded-full" />
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {hasValue(planet.size) && (
                                <div className="group">
                                    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 h-full transition-colors group-hover:bg-gray-100 dark:group-hover:bg-gray-800">
                                        <FaRuler className="w-6 h-6 text-blue-600 mb-4" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Diámetro</p>
                                        <p className="text-2xl font-light text-gray-900 dark:text-white">
                                            {formatNumber(planet.size)}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">km</p>
                                    </div>
                                </div>
                            )}

                            {hasValue(planet.mass) && (
                                <div className="group">
                                    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 h-full transition-colors group-hover:bg-gray-100 dark:group-hover:bg-gray-800">
                                        <FaWeight className="w-6 h-6 text-green-600 mb-4" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Masa</p>
                                        <p className="text-2xl font-light text-gray-900 dark:text-white">
                                            {planet.mass}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">MT</p>
                                    </div>
                                </div>
                            )}

                            {hasValue(planet.density) && (
                                <div className="group">
                                    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 h-full transition-colors group-hover:bg-gray-100 dark:group-hover:bg-gray-800">
                                        <div className="w-6 h-6 bg-purple-600 rounded-lg mb-4" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Densidad</p>
                                        <p className="text-2xl font-light text-gray-900 dark:text-white">
                                            {planet.density}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">g/cm³</p>
                                    </div>
                                </div>
                            )}

                            {hasValue(planet.gravity) && (
                                <div className="group">
                                    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 h-full transition-colors group-hover:bg-gray-100 dark:group-hover:bg-gray-800">
                                        <div className="w-6 h-6 bg-red-600 rounded-full mb-4" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Gravedad</p>
                                        <p className="text-2xl font-light text-gray-900 dark:text-white">
                                            {planet.gravity}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">m/s²</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Temperature */}
                    {planet.temperature && (hasValue(planet.temperature.average) || hasValue(planet.temperature.min) || hasValue(planet.temperature.max)) && (
                        <section>
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white mb-2">
                                    Temperatura
                                </h2>
                                <div className="w-12 h-1 bg-orange-500 rounded-full" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {hasValue(planet.temperature.min) && (
                                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-8 text-center">
                                        <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">Mínima</p>
                                        <p className="text-3xl font-light text-blue-800 dark:text-blue-300">
                                            {planet.temperature.min}
                                        </p>
                                        <p className="text-blue-600 dark:text-blue-400 text-sm">K</p>
                                    </div>
                                )}

                                {hasValue(planet.temperature.average) && (
                                    <div className="bg-orange-50 dark:bg-orange-950/30 rounded-2xl p-8 text-center">
                                        <p className="text-orange-600 dark:text-orange-400 text-sm font-medium mb-2">Promedio</p>
                                        <p className="text-3xl font-light text-orange-800 dark:text-orange-300">
                                            {planet.temperature.average}
                                        </p>
                                        <p className="text-orange-600 dark:text-orange-400 text-sm">K</p>
                                    </div>
                                )}

                                {hasValue(planet.temperature.max) && (
                                    <div className="bg-red-50 dark:bg-red-950/30 rounded-2xl p-8 text-center">
                                        <p className="text-red-600 dark:text-red-400 text-sm font-medium mb-2">Máxima</p>
                                        <p className="text-3xl font-light text-red-800 dark:text-red-300">
                                            {planet.temperature.max}
                                        </p>
                                        <p className="text-red-600 dark:text-red-400 text-sm">K</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Orbital Data */}
                    <section>
                        <div className="mb-8">
                            <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white mb-2">
                                Datos orbitales
                            </h2>
                            <div className="w-12 h-1 bg-purple-600 rounded-full" />
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {hasValue(planet.distanceFromSun) && (
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Distancia del Sol</p>
                                    <p className="text-xl font-light text-gray-900 dark:text-white">
                                        {planet.distanceFromSun} AU
                                    </p>
                                </div>
                            )}

                            {hasValue(planet.orbitalPeriod) && (
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Período orbital</p>
                                    <p className="text-xl font-light text-gray-900 dark:text-white">
                                        {planet.orbitalPeriod} días
                                    </p>
                                </div>
                            )}

                            {hasValue(planet.rotationPeriod) && (
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Período de rotación</p>
                                    <p className="text-xl font-light text-gray-900 dark:text-white">
                                        {planet.rotationPeriod} horas
                                    </p>
                                </div>
                            )}

                            {hasValue(planet.escapeVelocity) && (
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Velocidad de escape</p>
                                    <p className="text-xl font-light text-gray-900 dark:text-white">
                                        {planet.escapeVelocity} km/s
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Atmosphere */}
                    {planet.atmosphere && (planet.atmosphere.hasAtmosphere || planet.atmosphere.composition?.length > 0) && (
                        <section>
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white mb-2">
                                    Atmósfera
                                </h2>
                                <div className="w-12 h-1 bg-cyan-600 rounded-full" />
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8">
                                {planet.atmosphere.hasAtmosphere ? (
                                    <div className="space-y-6">
                                        {hasValue(planet.atmosphere.pressure) && (
                                            <div className="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-700">
                                                <span className="text-gray-600 dark:text-gray-400">Presión atmosférica</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {planet.atmosphere.pressure} atm
                                                </span>
                                            </div>
                                        )}

                                        {planet.atmosphere.composition && planet.atmosphere.composition.length > 0 && (
                                            <div>
                                                <p className="text-gray-600 dark:text-gray-400 mb-4">Composición</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {planet.atmosphere.composition.map((component, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-2 bg-cyan-100 dark:bg-cyan-950/30 text-cyan-800 dark:text-cyan-300 rounded-lg text-sm font-medium"
                                                        >
                                                            {component}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <FaWind className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400">No tiene atmósfera significativa</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Moons */}
                    {planet.moons && hasValue(planet.moons.count) && (
                        <section>
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white mb-2">
                                    Lunas ({planet.moons.count})
                                </h2>
                                <div className="w-12 h-1 bg-indigo-600 rounded-full" />
                            </div>

                            {planet.moons.majorMoons && planet.moons.majorMoons.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {planet.moons.majorMoons.map((moon, index) => (
                                        <div
                                            key={index}
                                            className="bg-indigo-50 dark:bg-indigo-950/30 rounded-xl p-4 text-center"
                                        >
                                            <span className="text-indigo-800 dark:text-indigo-300 font-medium">
                                                {moon}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Interesting Facts */}
                    {planet.interestingFacts && planet.interestingFacts.length > 0 && (
                        <section>
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white mb-2">
                                    Datos curiosos
                                </h2>
                                <div className="w-12 h-1 bg-yellow-600 rounded-full" />
                            </div>

                            <div className="space-y-4">
                                {planet.interestingFacts.map((fact, index) => (
                                    <div
                                        key={index}
                                        className="bg-yellow-50 dark:bg-yellow-950/30 rounded-2xl p-6 border-l-4 border-yellow-400"
                                    >
                                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{fact}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Discovery Info */}
                    {planet.discoveryInfo && (hasValue(planet.discoveryInfo.discoveredBy) || hasValue(planet.discoveryInfo.discoveryDate)) && (
                        <section>
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white mb-2">
                                    Descubrimiento
                                </h2>
                                <div className="w-12 h-1 bg-emerald-600 rounded-full" />
                            </div>

                            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {hasValue(planet.discoveryInfo.discoveredBy) && (
                                        <div>
                                            <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-2">
                                                Descubierto por
                                            </p>
                                            <p className="text-emerald-800 dark:text-emerald-300 text-lg">
                                                {planet.discoveryInfo.discoveredBy}
                                            </p>
                                        </div>
                                    )}

                                    {hasValue(planet.discoveryInfo.discoveryDate) && (
                                        <div>
                                            <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-2">
                                                Fecha de descubrimiento
                                            </p>
                                            <p className="text-emerald-800 dark:text-emerald-300 text-lg">
                                                {planet.discoveryInfo.discoveryDate}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {hasValue(planet.discoveryInfo.discoveryMethod) && (
                                    <div className="mt-6 pt-6 border-t border-emerald-200 dark:border-emerald-800">
                                        <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-2">
                                            Método de descubrimiento
                                        </p>
                                        <p className="text-emerald-800 dark:text-emerald-300">
                                            {planet.discoveryInfo.discoveryMethod}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Missions */}
                    {planet.missions && planet.missions.length > 0 && (
                        <section>
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white mb-2">
                                    Misiones espaciales
                                </h2>
                                <div className="w-12 h-1 bg-red-600 rounded-full" />
                            </div>

                            <div className="space-y-4">
                                {planet.missions.map((mission, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                    {mission.name}
                                                </h3>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                    <span>{mission.agency}</span>
                                                    <span>•</span>
                                                    <span>Lanzamiento: {formatDate(mission.launchDate)}</span>
                                                    <span>•</span>
                                                    <span className="capitalize">{mission.type}</span>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <span className={`inline-flex px-3 py-1 rounded-lg text-sm font-medium ${
                                                    mission.status === 'active'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-300'
                                                        : mission.status === 'completed'
                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300'
                                                            : 'bg-orange-100 text-orange-800 dark:bg-orange-950/30 dark:text-orange-300'
                                                }`}>
                                                    {mission.status === 'active' ? 'Activa' :
                                                        mission.status === 'completed' ? 'Completada' : 'Planeada'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Image Gallery */}
                    {planet.images?.gallery && planet.images.gallery.length > 0 && (
                        <section>
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white mb-2">
                                    Galería de imágenes
                                </h2>
                                <div className="w-12 h-1 bg-gray-600 rounded-full" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {planet.images.gallery.map((image, index) => (
                                    <div
                                        key={index}
                                        className="group relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden"
                                    >
                                        <Image
                                            src={image.url}
                                            alt={image.caption}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            fill
                                        />
                                        {image.caption && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                                <p className="text-white text-sm leading-relaxed">{image.caption}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    )
}

export default OnlyLotion