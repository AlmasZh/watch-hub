"use client";

import { usePathname } from "next/navigation";
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
    const pathname = usePathname();
    const isFullWidthPage = pathname.startsWith("/chats") || pathname.startsWith("/watch");

    return (
        <main
            className={cn(
                "transition-all duration-300 ease-in-out min-h-screen",
                "ml-[72px]" // Fixed width of Sidebar
            )}
        >
            <div className={cn(
                isFullWidthPage ? "h-screen" : "max-w-7xl mx-auto py-6"
            )}>
                {children}
            </div>
        </main>
    );
}
