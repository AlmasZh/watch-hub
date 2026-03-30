"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Library,
    Settings,
    LogOut,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="fixed left-0 top-0 z-40 h-screen flex flex-col bg-[#1e1f22] border-r border-[#1e1f22] w-[72px] transition-all duration-300 ease-in-out">
            {/* Top: App Logo / Home */}
            <div className="flex items-center justify-center py-4 flex-shrink-0">
                <Link
                    href="/"
                    className={cn(
                        "w-12 h-12 rounded-[24px] bg-blue-600 flex items-center justify-center text-white font-bold text-xl transition-all duration-200 hover:rounded-[15px] hover:bg-blue-500",
                        pathname === "/" && "rounded-[15px]"
                    )}
                    title="Home / Catalog"
                >
                    WH
                </Link>
            </div>

            <div className="flex justify-center mb-2">
                <div className="w-8 h-[2px] bg-gray-700/50 rounded-full" />
            </div>

            {/* Middle Action Icons */}
            <div className="flex flex-col gap-2 flex-1 overflow-y-auto overflow-x-hidden no-scrollbar py-2 px-3">

                {/* Library Icon */}
                <Link
                    href="/library"
                    className={cn(
                        "group relative flex items-center justify-center w-12 h-12 rounded-[24px] transition-all duration-200 hover:rounded-[15px] hover:bg-green-500",
                        pathname === "/library" ? "rounded-[15px] bg-green-500 text-white" : "bg-[#313338] text-gray-400 hover:text-white"
                    )}
                    title="My Library"
                >
                    <Library size={24} />
                    {/* Selection Indicator */}
                    <div className={cn(
                        "absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 bg-white rounded-r-full transition-all duration-200",
                        pathname === "/library" ? "h-10" : "h-0 group-hover:h-5"
                    )} />
                </Link>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col items-center gap-4 mt-auto py-4">

                <button className="text-gray-400 hover:text-white transition-colors" title="Settings">
                    <Settings size={22} />
                </button>
                <button className="text-gray-400 hover:text-red-400 transition-colors" title="Logout">
                    <LogOut size={22} />
                </button>

                {/* User Avatar */}
                <div className="relative group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-red-500 border-2 border-[#1e1f22] ring-2 ring-transparent group-hover:ring-blue-500" />
                </div>
            </div>
        </div>
    );
}
