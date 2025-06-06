"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";

interface DarkModeContextType {
    darkmode: boolean;
    changeDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

/**
 * Provider component to manage and provide dark mode state to the application.
 * Handles theme persistence using localStorage and applies the theme dynamically.
 */
export function DarkModeProvider({ children }: { children: ReactNode }) {
    const [darkmode, setDarkmode] = useState(false);

    useEffect(() => {
        // Retrieve the saved theme from localStorage on app load
        const savedTheme = localStorage.getItem("theme") || "dark"; // Default to "dark" if no theme is saved
        setDarkmode(savedTheme === "dark");
        applyTheme(savedTheme);
    }, []);

    /**
     * Toggles the dark mode state and updates localStorage and the applied theme.
     */
    const changeDarkMode = () => {
        setDarkmode(!darkmode);
        // Guardar la preferencia en localStorage
        localStorage.setItem("theme", !darkmode ? "dark" : "light");
        applyTheme(!darkmode ? "dark" : "light");
    };

    /**
     * Applies the specified theme to the document by adding or removing the "dark" class.
     * @param theme - The theme to apply ("dark" or "light").
     */
    const applyTheme = (theme: string) => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    return (
        <DarkModeContext.Provider value={{ darkmode, changeDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
}

/**
 * Custom hook to access the dark mode context.
 * Throws an error if used outside of a DarkModeProvider.
 */
export function useDarkMode() {
    const context = useContext(DarkModeContext);
    if (context === undefined) {
        throw new Error("useDarkMode must be used within a DarkModeProvider");
    }
    return context;
}
