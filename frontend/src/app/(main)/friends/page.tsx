"use client";

import { useState } from "react";
import { MessageCircle, MoreHorizontal, Check, X } from "lucide-react";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function FriendsPage() {
    const [activeTab, setActiveTab] = useState<"all" | "pending" | "add">("all");
    const [friendsSearch, setFriendsSearch] = useState("");

    // Mock data
    const friends = [
        { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/150?u=alice", status: "online", tag: "1234" },
        { id: 2, name: "Diana", avatar: "https://i.pravatar.cc/150?u=diana", status: "online", tag: "5678" },
        { id: 4, name: "Eve", avatar: "https://i.pravatar.cc/150?u=eve", status: "online", tag: "9012" },
        { id: 3, name: "Bob", avatar: "https://i.pravatar.cc/150?u=bob", status: "watching", tag: "3456" },
        { id: 5, name: "Charlie", avatar: "https://i.pravatar.cc/150?u=charlie", status: "offline", tag: "7890" },
    ];

    const sortedFriends = [...friends].sort((a, b) => {
        if (a.status === 'online' && b.status !== 'online') return -1;
        if (a.status !== 'online' && b.status === 'online') return 1;
        return a.id - b.id; // Stable secondary sort
    });

    const pendingRequests = [
        { id: 101, name: "Frank", avatar: "https://i.pravatar.cc/150?u=frank", type: "incoming" },
        { id: 102, name: "Grace", avatar: "https://i.pravatar.cc/150?u=grace", type: "outgoing" },
    ];

    return (
        <div className="flex-1 flex flex-col bg-[#313338] h-full overflow-hidden">
            {/* Top Bar with Tabs */}
            <div className="h-16 border-b border-[#26272d] flex items-center px-6 gap-4 flex-shrink-0 bg-[#313338]">
                <div className="flex items-center gap-2 mr-4 border-r border-gray-600 pr-4">
                    <div className="w-6 h-6 text-gray-400">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 3C13 2.44772 12.5523 2 12 2C11.4477 2 11 2.44772 11 3V11H3C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H11V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11H13V3Z" /></svg>
                    </div>
                    <span className="font-bold text-white text-base">Friends</span>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setActiveTab("all")}
                        className={cn(
                            "px-2 py-0.5 rounded text-sm font-medium transition-colors",
                            activeTab === "all" ? "text-white bg-[#41434a]" : "text-gray-400 hover:bg-[#35373c] hover:text-gray-200"
                        )}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setActiveTab("pending")}
                        className={cn(
                            "px-2 py-0.5 rounded text-sm font-medium transition-colors flex items-center gap-2",
                            activeTab === "pending" ? "text-white bg-[#41434a]" : "text-gray-400 hover:bg-[#35373c] hover:text-gray-200"
                        )}
                    >
                        Pending
                        {pendingRequests.length > 0 && <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">{pendingRequests.length}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab("add")}
                        className={cn(
                            "px-2 py-0.5 rounded text-sm font-medium transition-colors",
                            activeTab === "add" ? "text-green-400 bg-transparent" : "text-green-500 hover:bg-[#35373c]"
                        )}
                    >
                        Add Friend
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6">

                {/* ALL FRIENDS VIEW */}
                {activeTab === "all" && (
                    <div>
                        <div className="mb-4 text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-[#26272d] pb-2">
                            All Friends — {friends.length}
                        </div>
                        <div className="space-y-1">
                            {sortedFriends.map((friend) => (
                                <div
                                    key={friend.id}
                                    className="group flex items-center justify-between p-3 rounded-lg hover:bg-[#393c41] transition-colors border-t border-[#3f4147] hover:border-transparent first:border-0 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <img src={friend.avatar} alt={friend.name} className="w-9 h-9 rounded-full bg-[#1e1f22]" />
                                            <span className={cn(
                                                "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-4 border-[#313338] group-hover:border-[#393c41]",
                                                friend.status === 'online' ? "bg-green-500" : friend.status === 'watching' ? "bg-[#8a4fff]" : "bg-gray-500"
                                            )}></span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-semibold text-gray-200">{friend.name}</span>
                                                <span className="text-xs text-gray-400 hidden group-hover:inline">#{friend.tag}</span>
                                            </div>
                                            <div className="text-xs text-gray-400 font-medium">
                                                {friend.status === 'online' ? "Online" : friend.status === 'watching' ? "Watching Interstellar" : "Offline"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#2b2d31] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="w-8 h-8 rounded-full bg-[#313338] flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-[#404249]" title="Message">
                                            <MessageCircle size={18} />
                                        </button>
                                        <button className="w-8 h-8 rounded-full bg-[#313338] flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-[#404249]" title="More">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PENDING VIEW */}
                {activeTab === "pending" && (
                    <div>
                        <div className="mb-4 text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-[#26272d] pb-2">
                            Pending — {pendingRequests.length}
                        </div>
                        {pendingRequests.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 opacity-50">
                                <img src="https://discord.com/assets/b5eb2f7d6b3f8cc9b60be4a5dcf2a48d.svg" alt="No pending" className="w-64 mb-6 grayscale" />
                                {/* Placeholder image or integrated SVG usually goes here */}
                                <p className="text-gray-400">There are no pending friend requests.</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {pendingRequests.map((req) => (
                                    <div
                                        key={req.id}
                                        className="group flex items-center justify-between p-3 rounded-lg hover:bg-[#393c41] transition-colors border-t border-[#3f4147] hover:border-transparent first:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={req.avatar} alt={req.name} className="w-9 h-9 rounded-full bg-[#1e1f22]" />
                                            <div>
                                                <span className="font-semibold text-gray-200 block">{req.name}</span>
                                                <span className="text-xs text-gray-400 font-medium">
                                                    {req.type === 'incoming' ? "Incoming Friend Request" : "Outgoing Friend Request"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {req.type === 'incoming' && (
                                                <button className="w-8 h-8 rounded-full bg-[#2b2d31] flex items-center justify-center text-gray-400 hover:text-green-500 hover:bg-[#1e1f22]" title="Accept">
                                                    <Check size={18} />
                                                </button>
                                            )}
                                            <button className="w-8 h-8 rounded-full bg-[#2b2d31] flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-[#1e1f22]" title="Cancel">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ADD FRIEND VIEW */}
                {activeTab === "add" && (
                    <div className="max-w-2xl px-2">
                        <h2 className="text-white font-bold text-base mb-2 uppercase">Add Friend</h2>
                        <p className="text-gray-400 text-xs mb-4">You can add friends with their username.</p>

                        <div className="relative group">
                            <div className={cn(
                                "flex items-center bg-[#1e1f22] rounded-lg border border-[#1e1f22] p-3 transition-colors",
                                "focus-within:border-blue-500"
                            )}>
                                <input
                                    type="text"
                                    className="flex-1 bg-transparent border-none outline-none text-gray-200 placeholder-gray-500 font-medium"
                                    placeholder="Enter a Username#0000"
                                    value={friendsSearch}
                                    onChange={(e) => setFriendsSearch(e.target.value)}
                                    autoFocus
                                />
                                {friendsSearch.length > 0 && (
                                    <button className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                                        Send Friend Request
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Empty/Results State */}
                        <div className="mt-10 flex flex-col items-center justify-center">
                            {friendsSearch ? (
                                <div className="text-center">
                                    <p className="text-gray-400 text-sm">Searching for <span className="font-bold text-white">{friendsSearch}</span>...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center opacity-40">
                                    {/* <div className="w-64 h-40 bg-[#36393f] rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-gray-600">
                                        <span className="text-gray-500 font-bold">Wumpus is waiting...</span>
                                    </div> */}
                                    <p className="text-gray-500 text-sm">Enter a username to add a friend.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
