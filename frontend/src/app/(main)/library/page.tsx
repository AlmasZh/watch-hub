"use client";

import { useState, useEffect } from "react";
import { getUserVideos } from "@/api/video/user-videos";
import VideoTable, { Video } from "@/components/library/VideoTable";
import UppyUploader from "@/components/library/UppyUploader";
import { UploadCompleteResponse } from "@/types/video/upload";

function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function LibraryPage() {
    const [videos, setVideos] = useState<Video[]>([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const data = await getUserVideos();
                const formattedVideos: Video[] = data.map((v) => ({
                    id: v.streamUrl, // Fallback ID for now
                    title: v.originalFileName,
                    thumbnail: v.thumbnailUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop",
                    duration: formatDuration(v.durationSeconds),
                    createdAt: new Date(v.createdAt),
                    size: "N/A"
                }));
                // Sort by recent by default
                formattedVideos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                setVideos(formattedVideos);
            } catch (error) {
                console.error("Failed to fetch videos", error);
            }
        };

        fetchVideos();
    }, []);

    const handleUploadSuccess = (videoData: UploadCompleteResponse) => {
        setVideos((prev) => [
            {
                id: videoData.streamUrl,
                title: videoData.originalFileName,
                thumbnail: videoData.thumbnailUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop",
                duration: formatDuration(videoData.durationSeconds || 0),
                createdAt: new Date(videoData.createdAt),
                size: "N/A",
            },
            ...prev
        ]);
    };

    const handleDeleteVideo = (id: string) => {
        if (confirm("Are you sure you want to delete this video?")) {
            setVideos((prev) => prev.filter((v) => v.id !== id));
        }
    };

    const handleCopyLink = (id: string) => {
        // Mock copy
        navigator.clipboard.writeText(`http://wt.com/watch/${id}`);
        alert("Link copied to clipboard!");
    };

    const handlePlay = (id: string) => {
        console.log(`Playing video ${id}`);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">My Library</h1>
                    <p className="text-gray-400">Manage your uploaded videos and recordings.</p>
                </header>

                <UppyUploader onUploadSuccess={handleUploadSuccess} />

                {/* Video Table */}
                <VideoTable
                    videos={videos}
                    onPlay={handlePlay}
                    onDelete={handleDeleteVideo}
                    onCopyLink={handleCopyLink}
                />
            </div>
        </div>
    );
}
