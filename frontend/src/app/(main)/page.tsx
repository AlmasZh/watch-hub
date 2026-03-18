"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import VideoCard from "@/components/VideoCard";
import { Play, Loader2 } from "lucide-react";
import { getMovies, Movie } from "@/api/video/movies";

const HERO_DATA = {
  title: "Inception",
  description:
    "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  backgroundImage: "/main_poster.webp",
  rating: "PG-13",
  year: "2010",
  duration: "2h 28m",
  type: "Featured Movie",
};

const CATEGORIES = [
  "All",
  "Action",
  "Comedy",
  "Drama",
  "Sci-Fi",
  "Horror",
  "Documentary",
  "Anime",
  "Thriller",
];

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        const data = await getMovies();
        console.log(data);
        setMovies(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError("Failed to load movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  // TODO: Enable filtering once genres are added to the API
  // const filteredVideos =
  //   selectedCategory === "All"
  //     ? movies
  //     : movies.filter((movie) => movie.genres.includes(selectedCategory));
  const filteredVideos = movies;

  const handleVideoClick = (id: string) => {
    router.push(`/watch/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">

      {/* Hero Section */}
      <HeroSection
        {...HERO_DATA}
        onWatch={() => console.log("Watch Now Clicked")}
        onMoreInfo={() => console.log("More Info Clicked")}
      />

      {/* Categories */}
      <CategoryFilter
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Content Grid */}
      <div className="max-w-[95%] mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Play className="fill-white w-5 h-5" />
          {selectedCategory === "All" ? "Trending Now" : `${selectedCategory} Movies`}
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="text-lg">Loading movies...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-400">
            <p className="text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-blue-400 hover:underline"
            >
              Retry
            </button>
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredVideos.map((movie) => (
              <VideoCard
                key={movie.id}
                title={movie.title}
                thumbnail={movie.thumbnailUrl}
                duration={formatDuration(movie.durationSeconds)}
                views={`${movie.rating}/10`}
                onClick={() => handleVideoClick(movie.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-lg">No videos found in this category.</p>
            <button onClick={() => setSelectedCategory("All")} className="mt-4 text-blue-400 hover:underline">
              View All
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
