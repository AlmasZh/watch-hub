"use client";

import ConversationList from "@/components/chats/ConversationList";
export default function WatchPage({ params }: { params: { uuid: string } }) {


    // Sidebar is now fixed, no need to toggle


    return (
        <div className="flex h-full w-full">
            {/* The Wider Bar (Conversation List) moved here */}
            <ConversationList />

            {/* Main Content Area */}
            <main className="flex-1 bg-[#313338] flex flex-col items-center justify-center text-gray-400">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Watch Party / Chat</h1>
                    <p>UUID: {params.uuid}</p>
                    <p className="mt-4 text-sm opacity-70">Video player and chat interface will go here.</p>
                </div>
            </main>
        </div>
    );
}
