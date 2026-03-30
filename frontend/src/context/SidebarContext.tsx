"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
    isExpanded: boolean;
    toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isExpanded, setIsExpanded] = useState(true);

    // Optional: Persist state to local storage
    useEffect(() => {
        const timer = setTimeout(() => {
            const saved = localStorage.getItem("sidebar-expanded");
            if (saved !== null) {
                setIsExpanded(saved === "true");
            }
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const toggleSidebar = () => {
        setIsExpanded((prev) => {
            const newState = !prev;
            localStorage.setItem("sidebar-expanded", String(newState));
            return newState;
        });
    };

    return (
        <SidebarContext.Provider value={{ isExpanded, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}
