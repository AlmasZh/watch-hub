"use client";

import { useSidebar } from "@/context/SidebarContext";
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
    const { isExpanded } = useSidebar();
    const pathname = usePathname();
    const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
    const plusMenuRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState("");
    // Combined Conversations List (Groups and Users)

    const conversations = [
        { id: 'g1', type: 'group', name: "Movie Night", icon: Video, hasNotification: true },
        { id: 'u1', type: 'dm', name: "Alice", avatar: "https://i.pravatar.cc/150?u=alice", status: "online", hasNotification: true },
        { id: 'u2', type: 'dm', name: "Bob", avatar: "https://i.pravatar.cc/150?u=bob", status: "watching", hasNotification: false },
        { id: 'g2', type: 'group', name: "Coding Crew", icon: Users, hasNotification: false },
        { id: 'u3', type: 'dm', name: "Charlie", avatar: "https://i.pravatar.cc/150?u=charlie", status: "offline", hasNotification: false },
    ];

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
        <div className="fixed left-0 top-0 z-40 h-screen flex border-r border-[#1e1f22]">

            {/* 1. THE RAIL (Global Navigation) */}
            <aside className="w-[72px] h-full bg-[#1e1f22] flex flex-col items-center py-4 gap-4 flex-shrink-0">

                {/* Top: App Logo / Home */}
                <Link
                    href="/"
                    className={cn(
                        "w-12 h-12 rounded-[24px] bg-blue-600 flex items-center justify-center text-white font-bold text-xl transition-all duration-200 hover:rounded-[15px] hover:bg-blue-500",
                        pathname === "/" && "rounded-[15px]"
                    )}
                    title="Home / Catalog"
                >
                    WT
                </Link>

                <div className="w-8 h-[2px] bg-gray-700/50 rounded-full" />

                {/* Middle Icons */}
                <div className="flex flex-col items-center gap-3 flex-1 overflow-y-auto no-scrollbar py-1">

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

                    {/* The Plus Action */}
                    <div className="relative" ref={plusMenuRef}>
                        <button
                            onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                            className={cn(
                                "flex items-center justify-center w-12 h-12 rounded-[24px] transition-all duration-200 bg-[#313338] text-green-500 hover:rounded-[15px] hover:bg-green-500 hover:text-white shadow-lg",
                                isPlusMenuOpen && "rounded-[15px] bg-green-500 text-white"
                            )}
                            title="Add..."
                        >
                            <Plus size={28} />
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
                <div className="flex flex-col items-center gap-4 mt-auto">
                    <button className="text-gray-400 hover:text-white transition-colors" title="Settings">
                        <Settings size={22} />
                    </button>
                    <button className="text-gray-400 hover:text-red-400 transition-colors" title="Logout">
                        <LogOut size={22} />
                    </button>

                    {/* User Avatar with Status Ring */}
                    <div className="relative group cursor-pointer">
                        <div className="w-12 h-12 rounded-[24px] bg-gradient-to-tr from-yellow-400 to-red-500 transition-all duration-200 group-hover:rounded-[15px] border-2 border-[#1e1f22] ring-2 ring-transparent group-hover:ring-blue-500" />
                        <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-[3px] border-[#1e1f22]" title="Online" />
                    </div>
                </div>
            </aside>

            {/* 2. THE SOCIAL LIST (Wider Sidebar) */}
            <aside className="w-[240px] h-full bg-[#2b2d31] flex flex-col text-[#949ba4]">

                <div className="h-12 border-b border-[#1e1f22] flex items-center px-2 shadow-sm">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search for users"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#1e1f22] px-3 py-1.5 rounded text-sm text-gray-200 placeholder-gray-500 hover:bg-[#1e1f22] transition-colors outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto px-2 space-y-4 no-scrollbar pt-3">

                    {/* Friends Button (Navigates to Friends Page) */}
                    <Link
                        href="/friends"
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[#35373c] hover:text-white text-gray-400"
                    >
                        <Users size={22} />
                        <span className={cn(pathname === "/friends" && "text-white")}>Friends</span>
                    </Link>

                    {/* Unified Conversations List */}
                    <div>
                        <div className="flex items-center justify-between px-2 mb-1 mt-2 group">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-300 transition-colors">Direct Messages</h3>
                            <button className="text-gray-500 hover:text-gray-300" title="Create DM">+</button>
                        </div>
                        <div className="space-y-0.5">
                            {conversations.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/chats/${item.id}`} // Assuming chat routes are /chats/[id]
                                    className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-[#35373c] hover:text-[#dbdee1] transition-all group relative"
                                >
                                    <div className="relative flex-shrink-0">
                                        {item.type === 'dm' ? (
                                            <>
                                                <img src={item.avatar} alt={item.name} className="w-8 h-8 rounded-full bg-[#1e1f22]" />
                                                <span className={cn(
                                                    "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#2b2d31]",
                                                    item.status === 'online' ? "bg-green-500" : item.status === 'watching' ? "bg-[#8a4fff]" : "bg-gray-500"
                                                )}></span>
                                            </>
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-[#313338] flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                                                {item.icon && <item.icon size={18} />}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 text-left overflow-hidden">
                                        <p className="truncate">{item.name}</p>
                                        {item.status === 'watching' && <p className="text-[10px] text-[#8a4fff] leading-tight">Watching Interstellar</p>}
                                    </div>
                                    {item.hasNotification && (
                                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </aside>
        </div>
    );
}
