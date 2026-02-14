"use client";

import { useParams } from "next/navigation";
import VideoPlayer from "../../../../components/watch/VideoPlayer";
import VideoInfo from "../../../../components/watch/VideoInfo";
import CommentsSection from "../../../../components/watch/CommentsSection";

// Mock Data
const VIDEO_DETAILS = {
    title: "Stranger Things",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Using a sample video for now
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop", // Using a poster-like image
    views: "1.5M", // Keeping this for internal use or other displays
    year: "2016",
    country: "USA",
    genres: ["Sci-Fi", "Horror", "Drama"],
    duration: "1h 6m",
    premiere: "2016-07-12",
    quality: "BluRay 4K",
    audioLanguages: ["English", "Russian (Dub)", "French", "German", "Spanish"],
    ratingImdb: "8.7",
    uploadDate: "2 weeks ago",
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back. Set in the 1980s in the fictional town of Hawkins, Indiana, the first season focuses on the investigation into the disappearance of a young boy.",
    likeCount: "45K",
};

const COMMENTS = [
    {
        id: "1",
        author: "Alice Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop",
        text: "I've been to Kyoto and it's absolutely magical! Definitely recommending it to everyone.",
        timestamp: "1 week ago",
        likes: 245,
    },
    {
        id: "2",
        author: "Mark Davis",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2574&auto=format&fit=crop",
        text: "Great video! The drone shots are incredible. What camera do you use?",
        timestamp: "3 days ago",
        likes: 89,
    },
    {
        id: "3",
        author: "Sarah Lee",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2661&auto=format&fit=crop",
        text: "Number 3 is on my list for next summer! Can't wait.",
        timestamp: "2 hours ago",
        likes: 12,
    },
];

export default function WatchPage() {
    const { uuid } = useParams();

    // In a real app, fetch video details by UUID
    const currentVideo = { ...VIDEO_DETAILS, id: uuid };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="flex flex-col gap-8">
                    {/* The Player - Large & Cinematic */}
                    <div className="w-full">
                        <VideoPlayer
                            // src="https://d24lanzu8wxnoe.cloudfront.net/inception/inception.m3u8"
                            src="/video-proxy/inception/inception.m3u8"
                            poster={currentVideo.poster} // Use the backdrop/thumbnail for the player, or poster if preferred
                            title="Inception"
                        />
                    </div>

                    {/* Info & Comments - Centered & Focused */}
                    <div className="max-w-5xl mx-auto w-full">
                        <VideoInfo
                            title={currentVideo.title}
                            description={currentVideo.description}
                            poster={currentVideo.poster}
                            year={currentVideo.year}
                            country={currentVideo.country}
                            genres={currentVideo.genres}
                            duration={currentVideo.duration}
                            premiere={currentVideo.premiere}
                            quality={currentVideo.quality}
                            audioLanguages={currentVideo.audioLanguages}
                            ratingImdb={currentVideo.ratingImdb}
                        />
                        <div className="mt-12">
                            <CommentsSection comments={COMMENTS} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
