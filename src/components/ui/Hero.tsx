"use client"

import { useDarkMode } from "@/context/DarkModeContext";

function Hero() {
    const { darkmode } = useDarkMode()

    return (
        <div className={`relative py-24 min-h-dvh overflow-hidden ${darkmode
            ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
            : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
            }`}>
            
            {/* Elementos geométricos flotantes */}
            <div className="absolute inset-0 overflow-hidden">

                {/* Elementos geométricos abstractos */}
                <div className={`absolute top-20 left-16 w-4 h-4 rounded-full animate-pulse ${
                    darkmode ? "bg-purple-400" : "bg-blue-400"
                }`} style={{ animationDelay: '0s' }}></div>
                
                <div className={`absolute top-32 right-20 w-2 h-2 rounded-full animate-pulse ${
                    darkmode ? "bg-cyan-300" : "bg-indigo-300"
                }`} style={{ animationDelay: '1s' }}></div>
                
                <div className={`absolute bottom-40 left-32 w-3 h-3 rounded-full animate-pulse ${
                    darkmode ? "bg-purple-300" : "bg-blue-300"
                }`} style={{ animationDelay: '2s' }}></div>

                {/* Líneas conectoras sutiles */}
                <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={darkmode ? "#a855f7" : "#3b82f6"} />
                            <stop offset="100%" stopColor={darkmode ? "#06b6d4" : "#6366f1"} />
                        </linearGradient>
                    </defs>
                    <path 
                        d="M 100 200 Q 400 100 700 300" 
                        stroke="url(#lineGrad)" 
                        strokeWidth="1" 
                        fill="none"
                        className="animate-pulse"
                    />
                    <path 
                        d="M 200 400 Q 500 200 800 500" 
                        stroke="url(#lineGrad)" 
                        strokeWidth="0.5" 
                        fill="none"
                        className="animate-pulse"
                        style={{ animationDelay: '1s' }}
                    />
                </svg>

                {/* Grid sutil de fondo */}
                <div className={`absolute inset-0 opacity-5 ${
                    darkmode ? "bg-grid-white" : "bg-grid-slate-900"
                }`} style={{
                    backgroundImage: `radial-gradient(circle, ${darkmode ? '#ffffff' : '#0f172a'} 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            {/* Contenido principal */}
            <div className="relative z-10">
                <div className="text-center mt-24 space-y-4">
                    <div className="relative inline-block">
                        <h1 className={`text-7xl md:text-8xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                            darkmode 
                                ? "from-purple-300 via-cyan-300 to-purple-300" 
                                : "from-blue-600 via-indigo-600 to-blue-600"
                        }`}>
                            Cosmos
                        </h1>
                        <div className={`absolute -inset-2 blur-xl opacity-30 ${
                            darkmode ? "bg-purple-500" : "bg-blue-500"
                        } rounded-lg`}></div>
                    </div>
                    
                    <h2 className={`text-5xl md:text-6xl font-light ${
                        darkmode ? "text-cyan-200" : "text-indigo-700"
                    } tracking-wide`}>
                        Sistema Solar
                    </h2>
                </div>

                {/* Descripción con mejor tipografía */}
                <div className="max-w-2xl mx-auto mt-12 px-6">
                    <p className={`text-xl leading-relaxed text-center ${
                        darkmode ? "text-slate-300" : "text-slate-600"
                    }`}>
                        Embárcate en un viaje extraordinario a través del cosmos. 
                        Descubre los secretos del universo con una experiencia 
                        interactiva que transforma la exploración espacial en una 
                        aventura visual cautivadora.
                    </p>
                </div>

                {/* Botón CTA moderno */}
                <div className="flex justify-center mt-12">
                    <button className={`group relative px-8 py-4 rounded-full font-medium transition-all duration-300 ${
                        darkmode 
                            ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-500 hover:to-cyan-500" 
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500"
                    } transform hover:scale-105 hover:shadow-xl`}>
                        <span className="relative z-10">Comenzar Exploración</span>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                </div>
            </div>

            {/* Partículas flotantes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-1 h-1 rounded-full animate-float ${
                            darkmode ? "bg-purple-400" : "bg-blue-400"
                        }`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    ></div>
                ))}
            </div>
        </div>
    )
}

export default Hero