"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Video } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function ConversationList() {
    const pathname = usePathname();

    const conversations = [
        { id: 'g1', type: 'group', name: "Movie Night", icon: Video, hasNotification: true },
        { id: 'u1', type: 'dm', name: "Alice", avatar: "https://i.pravatar.cc/150?u=alice", status: "online", hasNotification: true },
        { id: 'u2', type: 'dm', name: "Bob", avatar: "https://i.pravatar.cc/150?u=bob", status: "watching", hasNotification: false },
        { id: 'g2', type: 'group', name: "Coding Crew", icon: Users, hasNotification: false },
        { id: 'u3', type: 'dm', name: "Charlie", avatar: "https://i.pravatar.cc/150?u=charlie", status: "offline", hasNotification: false },
    ];

    return (
        <aside className="w-[240px] h-full bg-[#2b2d31] flex flex-col text-[#949ba4] border-r border-[#1e1f22]">
            {/* Header / Search could go here if needed, keeping it simple as per original Sidebar */}

            <div className="flex-1 overflow-y-auto px-2 space-y-4 no-scrollbar pt-3">
                {/* Friends Button (Navigates to Friends Page) */}
                <Link
                    href="/friends"
                    className={cn(
                        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                        pathname === "/friends"
                            ? "bg-[#3f4147] text-white"
                            : "text-gray-400 hover:bg-[#35373c] hover:text-white"
                    )}
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
                                href={`/watch/${item.id}`} // Changed to /watch/[id] based on user task context "in the chat's page"
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
    );
}
