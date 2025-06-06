"use client";

import PlanetCard from "./CardPlanet";
import ButtonsPagination from "./ButtonsPaginations";
import { SearchBar } from "./searchBar";
import { usePlanets } from "@/hooks/usePlanets";
import { PiWarningCircleFill } from "react-icons/pi";
import { useDarkMode } from "@/context/DarkModeContext";
import { Suspense, useState, useEffect } from "react";

type Particle = {
    id: number;
    left: number;
    top: number;
    animationDelay: number;
    animationDuration: number;
};

function PlanetListContent() {
    const { darkmode } = useDarkMode();
    const {
        planets,
        searchTerm,
        pagination,
        isLoading,
        order,
        handleNextPage,
        handlePreviousPage,
        switchOrderDesc,
        handleSearch,
        isInitialized
    } = usePlanets();

    const [particles, setParticles] = useState<Particle[]>([]);
    const [isClient, setIsClient] = useState(false);

    // Generar partículas solo en el cliente
    useEffect(() => {
        setIsClient(true);
        const generatedParticles = [...Array(8)].map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            animationDelay: i * 0.7,
            animationDuration: 4 + Math.random() * 3
        }));
        setParticles(generatedParticles);
    }, []);

    // Mostrar loading mientras se inicializa desde URL
    if (!isInitialized) {
        return (
            <div className={`w-full relative min-h-screen ${darkmode
                ? "bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900"
                : "bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-100"
                }`}>
                <div className="grid place-content-center h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className={`w-16 h-16 border-4 rounded-full animate-spin ${darkmode
                                ? "border-purple-500/20 border-t-purple-500"
                                : "border-blue-500/20 border-t-blue-500"
                                }`}></div>
                            <div className={`absolute inset-2 w-12 h-12 border-4 rounded-full animate-spin ${darkmode
                                ? "border-cyan-500/20 border-t-cyan-500"
                                : "border-indigo-500/20 border-t-indigo-500"
                                }`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                        </div>
                        <div className={`text-xl font-light tracking-wide ${darkmode ? "text-slate-300" : "text-slate-600"
                            }`}>
                            Inicializando explorador...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full relative min-h-screen ${darkmode
            ? "bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900"
            : "bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-100"
            }`} id="planet-list">

            {/* Gradiente de transición desde arriba */}
            <div className={`absolute top-0 left-0 right-0 h-32 ${darkmode
                ? "bg-gradient-to-b from-slate-900 to-transparent"
                : "bg-gradient-to-b from-slate-50 to-transparent"
                } pointer-events-none z-20`}></div>

            {/* Elementos decorativos de fondo - mismo estilo que Hero */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Elementos geométricos abstractos */}
                <div className={`absolute top-20 left-16 w-4 h-4 rounded-full animate-pulse ${darkmode ? "bg-purple-400" : "bg-blue-400"
                    }`} style={{ animationDelay: '0.5s' }}></div>

                <div className={`absolute top-40 right-32 w-2 h-2 rounded-full animate-pulse ${darkmode ? "bg-cyan-300" : "bg-indigo-300"
                    }`} style={{ animationDelay: '1.5s' }}></div>

                <div className={`absolute bottom-60 left-24 w-3 h-3 rounded-full animate-pulse ${darkmode ? "bg-purple-300" : "bg-blue-300"
                    }`} style={{ animationDelay: '2.5s' }}></div>

                <div className={`absolute top-80 right-16 w-2 h-2 rounded-full animate-pulse ${darkmode ? "bg-cyan-400" : "bg-indigo-400"
                    }`} style={{ animationDelay: '3s' }}></div>

                {/* Líneas conectoras sutiles - continuando el flujo */}
                <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="lineGradList" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={darkmode ? "#a855f7" : "#3b82f6"} />
                            <stop offset="100%" stopColor={darkmode ? "#06b6d4" : "#6366f1"} />
                        </linearGradient>
                    </defs>
                    <path
                        d="M 150 100 Q 450 200 750 150"
                        stroke="url(#lineGradList)"
                        strokeWidth="1"
                        fill="none"
                        className="animate-pulse"
                        style={{ animationDelay: '0.5s' }}
                    />
                    <path
                        d="M 300 300 Q 600 150 900 400"
                        stroke="url(#lineGradList)"
                        strokeWidth="0.5"
                        fill="none"
                        className="animate-pulse"
                        style={{ animationDelay: '2s' }}
                    />
                    <path
                        d="M 50 500 Q 400 350 700 600"
                        stroke="url(#lineGradList)"
                        strokeWidth="0.8"
                        fill="none"
                        className="animate-pulse"
                        style={{ animationDelay: '3.5s' }}
                    />
                </svg>

                {/* Grid sutil de fondo - mismo patrón que Hero */}
                <div className={`absolute inset-0 opacity-5 ${darkmode ? "bg-grid-white" : "bg-grid-slate-900"
                    }`} style={{
                        backgroundImage: `radial-gradient(circle, ${darkmode ? '#ffffff' : '#0f172a'} 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}></div>

                {/* Gradientes sutiles flotantes - mismos colores que Hero */}
                <div className={`absolute top-20 left-10 w-32 h-32 rounded-full blur-3xl ${darkmode ? "bg-gradient-to-r from-purple-500/10 to-cyan-500/10" : "bg-gradient-to-r from-blue-500/10 to-indigo-500/10"
                    }`}></div>
                <div className={`absolute top-60 right-20 w-40 h-40 rounded-full blur-3xl ${darkmode ? "bg-gradient-to-r from-cyan-500/8 to-purple-500/8" : "bg-gradient-to-r from-indigo-500/8 to-blue-500/8"
                    }`}></div>
                <div className={`absolute bottom-40 left-1/3 w-28 h-28 rounded-full blur-3xl ${darkmode ? "bg-gradient-to-r from-purple-500/12 to-cyan-500/12" : "bg-gradient-to-r from-blue-500/12 to-indigo-500/12"
                    }`}></div>
            </div>

            {/* Partículas flotantes - generadas solo en el cliente */}
            {isClient && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {particles.map((particle) => (
                        <div
                            key={particle.id}
                            className={`absolute w-1 h-1 rounded-full animate-float ${darkmode ? "bg-purple-400/60" : "bg-blue-400/60"
                                }`}
                            style={{
                                left: `${particle.left}%`,
                                top: `${particle.top}%`,
                                animationDelay: `${particle.animationDelay}s`,
                                animationDuration: `${particle.animationDuration}s`
                            }}
                        ></div>
                    ))}
                </div>
            )}

            {/* Contenido principal */}
            <div className="relative z-10 pb-20 px-[5%] pt-32 md:pt-32">
                {/* Barra de búsqueda con contenedor glassmorphism - colores coherentes */}
                <div >
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearch={handleSearch}
                        order={order}
                        onToggleOrder={switchOrderDesc}
                    />
                </div>

                {/* Pantalla de Carga */}
                {isLoading ? (
                    <div className="grid place-content-center h-[400px]">
                        <div className="flex flex-col items-center gap-4">
                            {/* Spinner espacial - colores coherentes */}
                            <div className="relative">
                                <div className={`w-16 h-16 border-4 rounded-full animate-spin ${darkmode
                                    ? "border-purple-500/20 border-t-purple-500"
                                    : "border-blue-500/20 border-t-blue-500"
                                    }`}></div>
                                <div className={`absolute inset-2 w-12 h-12 border-4 rounded-full animate-spin ${darkmode
                                    ? "border-cyan-500/20 border-t-cyan-500"
                                    : "border-indigo-500/20 border-t-indigo-500"
                                    }`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                            </div>
                            <div className={`text-xl font-light tracking-wide ${darkmode ? "text-slate-300" : "text-slate-600"
                                }`}>
                                Explorando el cosmos...
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Grid de Planetas */}
                        {planets.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                {planets.map((planet, index) => (
                                    <div
                                        key={planet.id}
                                        className="transform transition-all duration-500 hover:scale-[1.02]"
                                        style={{
                                            animationDelay: `${index * 100}ms`
                                        }}
                                    >
                                        <PlanetCard planet={planet} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Estado vacío mejorado - colores coherentes */}
                        {planets.length === 0 && (
                            <div className="grid place-content-center w-full mb-20 py-20">
                                <div className="flex flex-col items-center gap-6 text-center">
                                    {/* Icono con efecto */}
                                    <div className="relative">
                                        <div className={`absolute inset-0 rounded-full blur-xl ${darkmode
                                            ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20"
                                            : "bg-gradient-to-r from-blue-500/20 to-indigo-500/20"
                                            }`}></div>
                                        <div className={`relative backdrop-blur-sm rounded-full p-6 border ${darkmode
                                            ? "bg-white/10 border-white/20"
                                            : "bg-white/20 border-white/30"
                                            }`}>
                                            <PiWarningCircleFill size={48} className={
                                                darkmode ? "text-slate-400" : "text-slate-500"
                                            } />
                                        </div>
                                    </div>

                                    {/* Texto mejorado */}
                                    <div className="space-y-2">
                                        <h3 className={`text-xl font-semibold ${darkmode ? "text-slate-300" : "text-slate-700"
                                            }`}>
                                            Planeta no encontrado
                                        </h3>
                                        <p className={`max-w-md ${darkmode ? "text-slate-400" : "text-slate-600"
                                            }`}>
                                            No hemos podido localizar planetas que coincidan con tu búsqueda.
                                            Intenta con diferentes términos o explora todos los planetas.
                                        </p>
                                    </div>

                                    {/* Botón para limpiar búsqueda - colores coherentes */}
                                    {searchTerm && (
                                        <button
                                            onClick={() => {
                                                const event = {
                                                    target: { value: '' }
                                                } as React.ChangeEvent<HTMLInputElement>;
                                                handleSearch(event);
                                            }}
                                            className={`px-6 py-3 backdrop-blur-sm rounded-xl border transition-all duration-300 transform hover:scale-105 ${darkmode
                                                ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-white/20 text-slate-300 hover:from-purple-500/30 hover:to-cyan-500/30"
                                                : "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-white/30 text-slate-700 hover:from-blue-500/30 hover:to-indigo-500/30"
                                                }`}
                                        >
                                            Ver todos los planetas
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Botones de Paginación con container glassmorphism - colores coherentes */}
                        {planets.length > 0 && (
                            <div >
                                <ButtonsPagination
                                    currentPage={pagination.currentPage}
                                    totalPages={pagination.totalPages}
                                    onNext={handleNextPage}
                                    onPrevious={handlePreviousPage}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// Componente principal envuelto en Suspense para manejar useSearchParams
function PlanetList() {
    return (
        <Suspense fallback={
            <div className="w-full relative min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
                <div className="grid place-content-center h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 rounded-full animate-spin border-purple-500/20 border-t-purple-500"></div>
                            <div className="absolute inset-2 w-12 h-12 border-4 rounded-full animate-spin border-cyan-500/20 border-t-cyan-500"
                                style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                        </div>
                        <div className="text-xl font-light tracking-wide text-slate-300">
                            Cargando explorador...
                        </div>
                    </div>
                </div>
            </div>
        }>
            <PlanetListContent />
        </Suspense>
    );
}

export default PlanetList;