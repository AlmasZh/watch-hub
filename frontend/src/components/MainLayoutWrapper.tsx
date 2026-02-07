"use client";

import { useSidebar } from "@/context/SidebarContext";
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
    // The sidebar is now a fixed dual-column layout.
    // Rail (72px) + Social List (240px) = 312px

    return (
        <main
            className={cn(
                "transition-all duration-300 ease-in-out min-h-screen",
                "ml-[312px]" // Fixed combined width of Rail and Social List
            )}
        >
            <div className="max-w-7xl mx-auto py-6">
                {children}
            </div>
        </main>
    );
}
