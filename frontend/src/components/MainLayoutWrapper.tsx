"use client";

import { useSidebar } from "@/context/SidebarContext";


// I'll define cn locally for now or check if lib/utils exists.
// Checking file structure earlier, I didn't see src/lib.
// I'll just use clsx and tailwind-merge here too or create src/lib/utils.ts.

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function MainLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isExpanded } = useSidebar();

    return (
        <main
            className={cn(
                "transition-all duration-300 ease-in-out min-h-screen",
                isExpanded ? "ml-[250px]" : "ml-[80px]"
            )}
        >
            {children}
        </main>
    );
}
