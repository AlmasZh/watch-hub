"use client";

import { Play, Trash2, Link as ShareLink, Clock, Calendar } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

export interface Video {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    createdAt: Date;
    size: string;
}

interface VideoTableProps {
    videos: Video[];
    onPlay: (id: string) => void;
    onDelete: (id: string) => void;
    onCopyLink: (id: string) => void;
}

export default function VideoTable({ videos, onPlay, onDelete, onCopyLink }: VideoTableProps) {
    if (videos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-[#1e1f22] rounded-xl border border-[#2b2d31] mt-8">
                <div className="bg-gray-800 p-4 rounded-full mb-4">
                    <Play size={32} className="text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-300">No videos yet</h3>
                <p className="text-gray-500 mt-2 text-sm">Upload your first video to get started</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden bg-[#1e1f22] rounded-xl border border-[#2b2d31] mt-8 shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead className="bg-[#2b2d31] text-xs uppercase text-gray-400 font-semibold tracking-wider">
                    <tr>
                        <th className="px-6 py-4">Video</th>
                        <th className="px-6 py-4 hidden sm:table-cell">Duration</th>
                        <th className="px-6 py-4 hidden md:table-cell">Date Added</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#2b2d31]">
                    {videos.map((video) => (
                        <tr key={video.id} className="hover:bg-[#25272b] transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-24 h-14 bg-gray-800 rounded overflow-hidden flex-shrink-0 cursor-pointer group-hover:ring-2 ring-blue-500 transition-all" onClick={() => onPlay(video.id)}>
                                        <Image
                                            src={video.thumbnail}
                                            alt={video.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play size={16} className="fill-white text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-white line-clamp-1 max-w-[200px] cursor-pointer hover:text-blue-400" onClick={() => onPlay(video.id)}>
                                            {video.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-0.5 sm:hidden">{video.duration}</p>
                                    </div>
                                </div>
                            </td>

                            <td className="px-6 py-4 hidden sm:table-cell text-sm text-gray-400">
                                <div className="flex items-center gap-1.5">
                                    <Clock size={14} />
                                    {video.duration}
                                </div>
                            </td>

                            <td className="px-6 py-4 hidden md:table-cell text-sm text-gray-400">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    {format(video.createdAt, "MMM d, yyyy")}
                                </div>
                            </td>

                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onPlay(video.id)}
                                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                        title="Play"
                                    >
                                        <Play size={16} />
                                    </button>
                                    <button
                                        onClick={() => onCopyLink(video.id)}
                                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                                        title="Copy Link"
                                    >
                                        <ShareLink size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(video.id)}
                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
