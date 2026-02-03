"use client";

import { useSidebar } from "@/context/SidebarContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Library,
    PlusCircle,
    Upload,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    MessageCircle,
    Users,
    Video,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Sidebar() {
    const { isExpanded, toggleSidebar } = useSidebar();
    const pathname = usePathname();

    const navItems = [
        { name: "Home", href: "/", icon: Home },
        { name: "My Library", href: "/library", icon: Library },
    ];

    // Mock data for social section
    const directMessages = [
        { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/150?u=alice", status: "online" },
        { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/150?u=bob", status: "watching" },
        { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/150?u=charlie", status: "offline" },
    ];

    const groups = [
        { id: 1, name: "Movie Night", icon: Video },
        { id: 2, name: "Coding Crew", icon: Users },
    ];

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen bg-[#1e1f22] text-gray-300 transition-all duration-300 ease-in-out flex flex-col border-r border-[#1e1f22]",
                isExpanded ? "w-[250px]" : "w-[80px]"
            )}
        >
            {/* Top: Logo and Toggle */}
            <div className="flex h-16 items-center justify-between px-4 shadow-sm bg-[#1e1f22]">
                <div className={cn("flex items-center gap-2 overflow-hidden", !isExpanded && "justify-center w-full")}>
                    <div className="min-w-8 min-h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                        WT
                    </div>
                    {isExpanded && <span className="text-lg font-bold text-white truncate">WatchTogether</span>}
                </div>
                {isExpanded && (
                    <button
                        onClick={toggleSidebar}
                        className="rounded-full p-1 hover:bg-gray-700 text-gray-400 hover:text-white"
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}
            </div>

            {!isExpanded && (
                <div className="flex justify-center py-2">
                    <button
                        onClick={toggleSidebar}
                        className="rounded-full p-1 hover:bg-gray-700 text-gray-400 hover:text-white"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
                <div className="px-2 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-[#35373c] text-white"
                                        : "hover:bg-[#35373c] hover:text-gray-100",
                                    !isExpanded && "justify-center px-2"
                                )}
                            >
                                <item.icon size={22} />
                                {isExpanded && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </div>

                <div className="my-4 border-t border-gray-700 mx-4" />

                {/* Actions */}
                <div className="px-2 space-y-1">
                    <button
                        className={cn(
                            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-green-400 hover:bg-[#35373c] hover:text-green-300 transition-colors",
                            !isExpanded && "justify-center px-2"
                        )}
                    >
                        <Upload size={22} />
                        {isExpanded && <span>Upload Video</span>}
                    </button>
                    <button
                        className={cn(
                            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-blue-400 hover:bg-[#35373c] hover:text-blue-300 transition-colors",
                            !isExpanded && "justify-center px-2"
                        )}
                    >
                        <PlusCircle size={22} />
                        {isExpanded && <span>Create Group</span>}
                    </button>
                </div>

                <div className="my-4 border-t border-gray-700 mx-4" />

                {/* Social */}
                <div className="px-4 mb-2">
                    {isExpanded && <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Direct Messages</h3>}
                </div>
                <div className="px-2 space-y-1">
                    {directMessages.map((dm) => (
                        <button
                            key={dm.id}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#35373c] transition-colors group",
                                !isExpanded && "justify-center px-2"
                            )}
                        >
                            <div className="relative">
                                <img src={dm.avatar} alt={dm.name} className="w-8 h-8 rounded-full bg-gray-600" />
                                <span className={cn(
                                    "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1e1f22]",
                                    dm.status === 'online' ? "bg-green-500" : dm.status === 'watching' ? "bg-purple-500" : "bg-gray-500"
                                )}></span>
                            </div>
                            {isExpanded && (
                                <div className="text-left overflow-hidden">
                                    <p className="truncate text-gray-300 group-hover:text-white">{dm.name}</p>
                                    {dm.status === 'watching' && <p className="text-xs text-purple-400 flex items-center gap-1"><Video size={10} /> Watching</p>}
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="my-4 border-t border-gray-700 mx-4" />

                <div className="px-4 mb-2">
                    {isExpanded && <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Groups</h3>}
                </div>
                <div className="px-2 space-y-1">
                    {groups.map((group) => (
                        <button
                            key={group.id}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#35373c] transition-colors",
                                !isExpanded && "justify-center px-2"
                            )}
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 group-hover:text-white">
                                <group.icon size={18} />
                            </div>
                            {isExpanded && <span className="text-gray-300 hover:text-white">{group.name}</span>}
                        </button>
                    ))}
                </div>

            </nav>

            {/* Bottom: User Profile */}
            <div className="border-t border-gray-700 p-4 bg-[#17181a]">
                <div className={cn("flex items-center gap-3", !isExpanded && "justify-center")}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-red-500 flex-shrink-0" />

                    {isExpanded && (
                        <div className="flex-1 overflow-hidden">
                            <p className="font-medium text-white truncate">User Name</p>
                            <p className="text-xs text-gray-500 truncate">#1234</p>
                        </div>
                    )}

                    {isExpanded && (
                        <div className="flex items-center">
                            <button className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-white">
                                <Settings size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
