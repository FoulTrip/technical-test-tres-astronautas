"use client"

import { useDarkMode } from "@/context/DarkModeContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoLogoGithub } from "react-icons/io";
import { TbMoonFilled, TbSunFilled } from "react-icons/tb";
import { useState, useEffect } from "react";

function NavBar() {
    const router = useRouter();
    const { darkmode, changeDarkMode } = useDarkMode();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
            scrolled 
                ? 'backdrop-blur-md bg-white/10 dark:bg-black/10 border-b border-white/20 dark:border-white/10' 
                : 'bg-transparent'
        }`}>
            <div className="flex flex-row justify-between items-center w-[90%] ml-[5%] py-4">
                {/* Logo y título */}
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Image
                            src={"https://res.cloudinary.com/df2gu30lb/image/upload/v1739377081/tests%20images/jajq2ca9cgcbiv15e5uz.png"}
                            width={32}
                            height={32}
                            alt={"logo_planeta"}
                            className="drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <h1 className={`text-lg font-semibold tracking-wide ${
                        darkmode ? "text-white/90" : "text-gray-800/90"
                    } hover:text-opacity-100 transition-all duration-300`}>
                        Sistema Solar
                    </h1>
                </div>

                {/* Botones de acción */}
                <div className="flex items-center gap-2">
                    {/* Toggle theme */}
                    <button 
                        className={`group relative p-3 rounded-xl transition-all duration-300 ${
                            scrolled
                                ? darkmode 
                                    ? "bg-white/5 hover:bg-white/10 text-white/80 hover:text-white backdrop-blur-sm border border-white/10 hover:border-white/20" 
                                    : "bg-black/5 hover:bg-black/10 text-gray-700/80 hover:text-gray-900 backdrop-blur-sm border border-white/10 hover:border-white/20"
                                : darkmode
                                    ? "bg-transparent hover:bg-white/5 text-white/70 hover:text-white/90"
                                    : "bg-transparent hover:bg-black/5 text-gray-800/70 hover:text-gray-900"
                        }`}
                        onClick={changeDarkMode}
                    >
                        <div className="relative z-10">
                            {darkmode ? (
                                <TbSunFilled size={20} className="transition-transform duration-300 group-hover:rotate-12" />
                            ) : (
                                <TbMoonFilled size={20} className="transition-transform duration-300 group-hover:-rotate-12" />
                            )}
                        </div>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>

                    {/* GitHub button */}
                    <button
                        className={`group relative p-3 rounded-xl transition-all duration-300 ${
                            scrolled
                                ? darkmode 
                                    ? "bg-white/5 hover:bg-white/10 text-white/80 hover:text-white backdrop-blur-sm border border-white/10 hover:border-white/20" 
                                    : "bg-black/5 hover:bg-black/10 text-gray-700/80 hover:text-gray-900 backdrop-blur-sm border border-white/10 hover:border-white/20"
                                : darkmode
                                    ? "bg-transparent hover:bg-white/5 text-white/70 hover:text-white/90"
                                    : "bg-transparent hover:bg-black/5 text-gray-800/70 hover:text-gray-900"
                        }`}
                        onClick={() => router.push("https://github.com/FoulTrip/tres_astronautas_app_test")}
                    >
                        <div className="relative z-10">
                            <IoLogoGithub size={20} className="transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;