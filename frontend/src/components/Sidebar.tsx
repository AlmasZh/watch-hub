"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Library,
    Plus,
    Settings,
    LogOut,
    MessageCircle,
    Users,
    Video,
    Upload,
    PlusCircle,
    MoreHorizontal,
    Bell,
    User,
    ChevronDown,
    Search,
    UserPlus,
    X,
    Check
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Sidebar() {
    const pathname = usePathname();
    const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
    const plusMenuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (plusMenuRef.current && !plusMenuRef.current.contains(event.target as Node)) {
                setIsPlusMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
            <div className="flex flex-col gap-2 flex-1 overflow-y-auto no-scrollbar scroll-x-none py-2 px-3">

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

                {/* Chats Link (NEW) */}
                <Link
                    href="/chats"
                    className={cn(
                        "group relative flex items-center justify-center w-12 h-12 rounded-[24px] transition-all duration-200 hover:rounded-[15px] hover:bg-green-500",
                        (pathname.startsWith("/chats") || pathname.startsWith("/watch")) ? "rounded-[15px] bg-green-500 text-white" : "bg-[#313338] text-gray-400 hover:text-white"
                    )}
                    title="Chats"
                >
                    <MessageCircle size={24} />
                    {/* Selection Indicator */}
                    <div className={cn(
                        "absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 bg-white rounded-r-full transition-all duration-200",
                        (pathname.startsWith("/chats") || pathname.startsWith("/watch")) ? "h-10" : "h-0 group-hover:h-5"
                    )} />
                </Link>


                {/* The Plus Action */}
                <div className="relative mt-2" ref={plusMenuRef}>
                    <button
                        onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                        className={cn(
                            "flex items-center justify-center w-12 h-12 rounded-[24px] transition-all duration-200 bg-[#313338] text-green-500 hover:rounded-[15px] hover:bg-green-500 hover:text-white shadow-lg",
                            isPlusMenuOpen && "rounded-[15px] bg-green-500 text-white"
                        )}
                        title="Add..."
                    >
                        <Plus size={24} />
                    </button>

                    {/* Plus Action Overlay Menu */}
                    {isPlusMenuOpen && (
                        <div className="absolute left-16 top-0 w-48 bg-[#111214] border border-[#1e1f22] rounded-md shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-left-2 duration-200">
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-[#35373c] hover:text-white transition-colors">
                                <Users size={18} className="text-blue-400" />
                                <span>New Group</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-[#35373c] hover:text-white transition-colors">
                                <Upload size={18} className="text-green-400" />
                                <span>Upload Video</span>
                            </button>
                        </div>
                    )}
                </div>
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
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-[2px] border-[#1e1f22]" title="Online" />
                </div>
            </div>
        </div>
    );
}
