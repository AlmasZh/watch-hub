import { Play, Users, Clock, Eye } from 'lucide-react';
import Image from 'next/image';

interface VideoCardProps {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    views: string;
    onClick?: () => void;
    onWatchAlone?: () => void;
    onCreateParty?: () => void;
}

export default function VideoCard({
    id,
    title,
    thumbnail,
    duration,
    views,
    onClick,
    onWatchAlone,
    onCreateParty
}: VideoCardProps) {
    return (
        <div
            onClick={onClick}
            className="group relative w-full h-[320px] rounded-xl overflow-hidden bg-[#1e1f22] border border-[#2b2d31] hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 cursor-pointer"
        >

            {/* Thumbnail */}
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

                {/* Play Icon Overlay (Hidden by default, visible on hover) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Play className="fill-white text-white w-6 h-6 ml-1" />
                    </div>
                </div>

                {/* Duration Badge */}
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1 font-medium">
                    <Clock size={10} />
                    {duration}
                </span>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-white font-semibold text-lg line-clamp-1 mb-1 group-hover:text-blue-400 transition-colors">
                    {title}
                </h3>
                <div className="flex items-center text-gray-400 text-xs mb-4">
                    <Eye size={12} className="mr-1" />
                    <span className="mr-3">{views} views</span>
                </div>

                {/* Hover Actions (Slide Up) */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#2b2d31] p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onWatchAlone?.();
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded transition-colors"
                    >
                        <Play size={14} className="fill-current" /> Watch Alone
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onCreateParty?.();
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 rounded transition-colors"
                    >
                        <Users size={14} /> Party
                    </button>
                </div>
            </div>
        </div>
    );
}
