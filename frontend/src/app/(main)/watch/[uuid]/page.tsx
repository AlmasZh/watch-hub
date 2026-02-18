"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import VideoPlayer from "../../../../components/watch/VideoPlayer";
import VideoInfo from "../../../../components/watch/VideoInfo";
import CommentsSection from "../../../../components/watch/CommentsSection";
import { getMovieByUuid, Movie } from "@/api/video/movies";
import { Loader2 } from "lucide-react";

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

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
}

export default function WatchPage() {
    const { uuid } = useParams();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!uuid) return;

        const fetchMovie = async () => {
            try {
                setIsLoading(true);
                const data = await getMovieByUuid(uuid as string);
                setMovie(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch movie:", err);
                setError("Failed to load movie. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovie();
    }, [uuid]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
                <div className="text-center">
                    <p className="text-xl mb-4">{error || "Movie not found"}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col gap-8">
                    {/* The Player - Large & Cinematic */}
                    <div className="w-full">
                        <VideoPlayer
                            src={movie.streamUrl}
                            poster={movie.thumbnailUrl}
                            title={movie.title}
                        />
                    </div>

                    {/* Info & Comments - Centered & Focused */}
                    <div className="max-w-5xl mx-auto w-full">
                        <VideoInfo
                            title={movie.title}
                            description={movie.description}
                            poster={movie.posterUrl}
                            year={movie.releaseYear.toString()}
                            country="N/A" // Missing from API
                            genres={[]} // Missing from API
                            duration={formatDuration(movie.durationSeconds)}
                            premiere={movie.releaseYear.toString()} // Missing exact date
                            quality="HD" // Default
                            audioLanguages={["English"]} // Default
                            ratingImdb={movie.rating.toString()}
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
