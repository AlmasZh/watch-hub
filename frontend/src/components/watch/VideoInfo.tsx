"use client";

import { Star } from "lucide-react";
import Image from "next/image";

interface VideoInfoProps {
    title: string;
    description: string;
    poster: string;
    year: string;
    country: string;
    genres: string[];
    duration: string;
    premiere: string;
    quality: string;
    audioLanguages: string[];
    ratingImdb: string;
}

export default function VideoInfo({
    title,
    description,
    poster,
    year,
    country,
    genres,
    duration,
    premiere,
    quality,
    audioLanguages,
    ratingImdb,
}: VideoInfoProps) {
    return (
        <div className="mt-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">

                {/* Left Column: Poster & Simplified Rating */}
                <div className="flex-shrink-0 w-full md:w-[240px] flex flex-col gap-4">
                    <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-2xl group ring-1 ring-white/10">
                        <Image
                            src={poster}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="flex items-center justify-center gap-2 text-yellow-500 font-bold bg-white/5 py-2 rounded-lg border border-white/5">
                        <Star size={18} className="fill-current" />
                        <span className="text-lg">{ratingImdb}</span>
                        <span className="text-xs text-gray-500 font-normal uppercase tracking-wider ml-1">IMDb</span>
                    </div>
                </div>

                {/* Right Column: Info & Details */}
                <div className="flex-1 min-w-0">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">{title}</h1>

                    {/* Quick Meta Row */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8">
                        <span className="bg-white/10 text-white px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider">{quality}</span>
                        <span>{year}</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full" />
                        <span>{duration}</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full" />
                        <span>{country}</span>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-[100px_1fr] gap-y-2 text-sm md:text-base mb-8">
                        <div className="text-gray-500">Genre</div>
                        <div className="flex flex-wrap gap-2">
                            {genres.map((genre, idx) => (
                                <span key={idx} className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                                    {genre}{idx < genres.length - 1 ? "," : ""}
                                </span>
                            ))}
                        </div>

                        <div className="text-gray-500">Premiere</div>
                        <div className="text-gray-300">{premiere}</div>

                        <div className="text-gray-500">Audio</div>
                        <div className="text-gray-300">
                            {audioLanguages.join(", ")}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="text-gray-300 text-lg leading-relaxed max-w-3xl">
                        {description}
                    </div>
                </div>
            </div>
        </div>
    );
}
