"use client";

import { useState, useEffect } from "react";
import { getUserVideos, deleteUserVideo } from "@/api/video/user-videos";
import VideoTable, { Video } from "@/components/library/VideoTable";
import UppyUploader from "@/components/library/UppyUploader";
import VideoPlayerModal from "@/components/library/VideoPlayerModal";
import { UploadCompleteResponse } from "@/types/video/upload";

function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function LibraryPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [playingVideo, setPlayingVideo] = useState<Video | null>(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const data = await getUserVideos();
                const formattedVideos: Video[] = data.map((v) => ({
                    id: v.id,
                    title: v.originalFileName,
                    thumbnail: v.thumbnailUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop",
                    duration: formatDuration(v.durationSeconds),
                    streamUrl: v.streamUrl,
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
                id: videoData.id,
                title: videoData.originalFileName,
                thumbnail: videoData.thumbnailUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop",
                duration: formatDuration(videoData.durationSeconds || 0),
                streamUrl: videoData.streamUrl,
                createdAt: new Date(videoData.createdAt),
                size: "N/A",
            },
            ...prev
        ]);
    };

    const handleDeleteVideo = async (id: string) => {
        if (confirm("Are you sure you want to delete this video?")) {
            try {
                await deleteUserVideo(id);
                setVideos((prev) => prev.filter((v) => v.id !== id));
            } catch (error) {
                console.error("Failed to delete video", error);
                alert("Failed to delete video. Please try again later.");
            }
        }
    };

    const handleCopyLink = (id: string) => {
        const video = videos.find(v => v.id === id);
        if (video?.streamUrl) {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(video.streamUrl)
                    .then(() => alert("Link copied to clipboard!"))
                    .catch(() => alert("Failed to copy link."));
            } else {
                // Fallback for insecure contexts (like HTTP)
                const textArea = document.createElement("textarea");
                textArea.value = video.streamUrl;
                textArea.style.position = "absolute";
                textArea.style.left = "-999999px";
                document.body.prepend(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    alert("Link copied to clipboard!");
                } catch (error) {
                    console.error("Fallback copy failed", error);
                    alert("Failed to copy link.");
                } finally {
                    textArea.remove();
                }
            }
        } else {
            alert("Failed to copy link: Stream URL not found.");
        }
    };

    const handlePlay = (id: string) => {
        console.log(`Playing video ${id}`);
        const video = videos.find(v => v.id === id);
        if (video) {
            setPlayingVideo(video);
        }
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

                {/* Video Player Modal */}
                <VideoPlayerModal
                    isOpen={!!playingVideo}
                    onClose={() => setPlayingVideo(null)}
                    streamUrl={playingVideo?.streamUrl || ""}
                    title={playingVideo?.title || ""}
                />
            </div>
        </div>
    );
}
