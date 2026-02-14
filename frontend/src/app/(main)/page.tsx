"use client";

import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import VideoCard from "@/components/VideoCard";
import { Play } from "lucide-react";

// Mock Data
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

const VIDEOS = [
  {
    id: "1",
    title: "Interstellar",
    thumbnail: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2613&auto=format&fit=crop", // Space
    duration: "2h 49m",
    views: "1.2M",
    category: "Sci-Fi",
  },
  {
    id: "2",
    title: "The Dark Knight",
    thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e63?q=80&w=2508&auto=format&fit=crop", // Dark city
    duration: "2h 32m",
    views: "980K",
    category: "Action",
  },
  {
    id: "3",
    title: "Avengers: Endgame",
    thumbnail: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop", // Action feel
    duration: "3h 2m",
    views: "2.5M",
    category: "Action",
  },
  {
    id: "4",
    title: "Spirited Away",
    thumbnail: "https://images.unsplash.com/photo-1614947932609-84728512cd6a?q=80&w=2670&auto=format&fit=crop", // Fantasy
    duration: "2h 5m",
    views: "850K",
    category: "Anime",
  },
  {
    id: "5",
    title: "Parasite",
    thumbnail: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2670&auto=format&fit=crop", // Drama/Thriller
    duration: "2h 12m",
    views: "1.1M",
    category: "Drama",
  },
  {
    id: "6",
    title: "The Godfather",
    thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2659&auto=format&fit=crop", // Classic film
    duration: "2h 55m",
    views: "720K",
    category: "Drama",
  },
  {
    id: "7",
    title: "Dune: Part Two",
    thumbnail: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2576&auto=format&fit=crop", // Desert/SciFi
    duration: "2h 46m",
    views: "3.2M",
    category: "Sci-Fi"
  },
  {
    id: "8",
    title: "Barbie",
    thumbnail: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2669&auto=format&fit=crop", // Pink/Bright
    duration: "1h 54m",
    views: "4.1M",
    category: "Comedy"
  }
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredVideos =
    selectedCategory === "All"
      ? VIDEOS
      : VIDEOS.filter((video) => video.category === selectedCategory);

  const handleWatchAlone = (title: string) => {
    console.log(`Watching ${title} alone`);
    // Logic to navigate to watch page
  };

  const handleCreateParty = (title: string) => {
    console.log(`Creating party for ${title}`);
    // Logic to open modal
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

        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                thumbnail={video.thumbnail}
                duration={video.duration}
                views={video.views}
                onWatchAlone={() => handleWatchAlone(video.title)}
                onCreateParty={() => handleCreateParty(video.title)}
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
