"use client";

import { useState, useEffect } from "react";
import { getUserVideos } from "@/api/video/user-videos";
import UploadZone from "@/components/library/UploadZone";
import ProcessingList, { ProcessingItem } from "@/components/library/ProcessingList";
import VideoTable, { Video } from "@/components/library/VideoTable";
import { v4 as uuidv4 } from "uuid";

function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function LibraryPage() {
    const [processingItems, setProcessingItems] = useState<ProcessingItem[]>([]);
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

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;

        const newItems: ProcessingItem[] = Array.from(files).map((file) => ({
            id: uuidv4(),
            name: file.name,
            progress: 0,
            status: "uploading",
            size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
            timeLeft: "2 min remaining"
        }));

        setProcessingItems((prev) => [...prev, ...newItems]);

        // Simulate upload progress
        newItems.forEach((item) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 10;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setProcessingItems((prev) =>
                        prev.map((i) =>
                            i.id === item.id ? { ...i, progress: 100, status: "completed", timeLeft: "Done" } : i
                        )
                    );

                    // Add to video list after "processing"
                    setTimeout(() => {
                        const newVideo: Video = {
                            id: item.id,
                            title: item.name,
                            thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop", // placeholder
                            duration: "00:00",
                            createdAt: new Date(),
                            size: item.size
                        };
                        setVideos(prev => [newVideo, ...prev]);
                    }, 1000);

                } else {
                    setProcessingItems((prev) =>
                        prev.map((i) => (i.id === item.id ? { ...i, progress: Math.floor(progress) } : i))
                    );
                }
            }, 500);
        });
    };

    const handleCancelUpload = (id: string) => {
        setProcessingItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleClearCompleted = () => {
        setProcessingItems(prev => prev.filter(item => item.status !== 'completed'));
    };

    const handleDeleteVideo = (id: string) => {
        if (confirm("Are you sure you want to delete this video?")) {
            setVideos((prev) => prev.filter((v) => v.id !== id));
        }
    };

    const handleCopyLink = (id: string) => {
        // Mock copy
        navigator.clipboard.writeText(`https://watchtogether.com/watch/${id}`);
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

                {/* Upload Zone */}
                <UploadZone onFileSelect={handleFileSelect} />

                {/* Processing List */}
                <ProcessingList
                    items={processingItems}
                    onCancel={handleCancelUpload}
                    onClearCompleted={handleClearCompleted}
                />

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
