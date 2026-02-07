import { Play, Info } from 'lucide-react';
import Image from 'next/image';

interface HeroSectionProps {
    title: string;
    description: string;
    backgroundImage: string;
    rating?: string;
    year?: string;
    duration?: string;
    type?: string;
    onWatch?: () => void;
    onMoreInfo?: () => void;
}

export default function HeroSection({
    title,
    description,
    backgroundImage,
    rating,
    year,
    duration,
    type,
    onWatch,
    onMoreInfo
}: HeroSectionProps) {
    return (
        <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] rounded-3xl overflow-hidden shadow-2xl group mx-auto max-w-[95%] mt-4">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={backgroundImage}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                />
                {/* Cinematic Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative h-full flex flex-col justify-end p-6 md:p-12 lg:p-16 max-w-4xl z-10">
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700">

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-300 mb-2">
                        {type && (
                            <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider shadow-sm">
                                {type}
                            </span>
                        )}
                        {year && <span>{year}</span>}
                        {rating && <span className="border border-gray-500 px-1.5 rounded text-xs">{rating}</span>}
                        {duration && <span>{duration}</span>}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight drop-shadow-2xl leading-none">
                        {title}
                    </h1>

                    {/* Description */}
                    <p className="text-gray-200 text-sm md:text-base lg:text-lg line-clamp-3 md:line-clamp-2 max-w-2xl drop-shadow-md">
                        {description}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-4 pt-4">
                        <button
                            onClick={onWatch}
                            className="flex items-center gap-2 bg-white text-black px-6 md:px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all shadow-lg active:scale-95 duration-200"
                        >
                            <Play className="fill-current w-5 h-5" />
                            Watch Now
                        </button>
                        <button
                            onClick={onMoreInfo}
                            className="flex items-center gap-2 bg-gray-600/60 backdrop-blur-md text-white px-6 md:px-8 py-3 rounded-full font-bold hover:bg-gray-500/80 transition-all shadow-lg active:scale-95 duration-200"
                        >
                            <Info className="w-5 h-5" />
                            More Info
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
