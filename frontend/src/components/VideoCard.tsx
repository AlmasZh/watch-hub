import { Play, Clock, Eye } from 'lucide-react';
import Image from 'next/image';

interface VideoCardProps {
    title: string;
    thumbnail: string;
    duration: string;
    views: string;
    onClick?: () => void;
}

export default function VideoCard({
    title,
    thumbnail,
    duration,
    views,
    onClick
}: VideoCardProps) {
    return (
        <div
            onClick={onClick}
            className="group relative w-full flex flex-col rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >

            {/* Thumbnail Box */}
            <div className="relative w-full aspect-video overflow-hidden">
                <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Gradient overlay to make text/icons pop */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-90">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                        <Play className="fill-white text-white w-6 h-6 ml-1 drop-shadow-md" />
                    </div>
                </div>

                {/* Duration Badge */}
                <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white/90 text-[11px] px-2 py-1 rounded-md flex items-center gap-1.5 font-medium border border-white/10 shadow-sm">
                    <Clock size={12} className="text-white/80" />
                    {duration}
                </span>
            </div>

            {/* Content Box */}
            <div className="p-4 flex flex-col gap-2 relative">
                {/* A subtle gleam effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

                <h3 className="text-white/90 font-semibold text-base leading-tight line-clamp-2 group-hover:text-white transition-colors">
                    {title}
                </h3>

                <div className="flex items-center text-white/50 text-xs mt-auto">
                    <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-md border border-white/5">
                        <Eye size={12} className="text-blue-400" />
                        <span className="font-medium text-white/70">{views}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
