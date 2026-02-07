"use client";

import { CheckCircle2, FileVideo, Loader2, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ProcessingItem {
    id: string;
    name: string;
    progress: number; // 0 to 100
    status: "uploading" | "processing" | "completed" | "error";
    size: string;
    timeLeft?: string;
}

interface ProcessingListProps {
    items: ProcessingItem[];
    onCancel?: (id: string) => void;
    onClearCompleted?: () => void;
}

export default function ProcessingList({ items, onCancel, onClearCompleted }: ProcessingListProps) {
    if (items.length === 0) return null;

    return (
        <div className="w-full bg-[#1e1f22] rounded-xl border border-[#2b2d31] overflow-hidden shadow-lg mt-6">
            <div className="flex items-center justify-between px-4 py-3 bg-[#2b2d31] border-b border-[#1e1f22]">
                <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <Loader2 className="animate-spin text-blue-500" size={16} />
                    Processing {items.length} file{items.length > 1 ? "s" : ""}
                </h3>
                {items.some(i => i.status === 'completed') && (
                    <button
                        onClick={onClearCompleted}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        Clear completed
                    </button>
                )}
            </div>

            <div className="divide-y divide-[#2b2d31]">
                {items.map((item) => (
                    <div key={item.id} className="p-4 relative hover:bg-[#25272b] transition-colors group">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[#17181a] rounded text-gray-400">
                                <FileVideo size={20} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-sm font-medium text-white truncate pr-4">{item.name}</p>
                                    <button
                                        onClick={() => onCancel && onCancel(item.id)}
                                        className="text-gray-500 hover:text-red-400 p-0.5 rounded transition-colors"
                                        title="Cancel upload"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                                    <span>
                                        {item.status === 'uploading' && `Uploading... ${item.progress}%`}
                                        {item.status === 'processing' && `Processing...`}
                                        {item.status === 'completed' && <span className="text-green-500 flex items-center gap-1"><CheckCircle2 size={12} /> Completed</span>}
                                        {item.status === 'error' && <span className="text-red-400">Failed</span>}
                                    </span>
                                    <span>{item.size} • {item.timeLeft || "calculating..."}</span>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full h-1.5 bg-[#17181a] rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all duration-500 ease-out",
                                            item.status === 'completed' ? "bg-green-500" :
                                                item.status === 'error' ? "bg-red-500" :
                                                    "bg-blue-500 relative overflow-hidden"
                                        )}
                                        style={{ width: `${item.progress}%` }}
                                    >
                                        {/* Shimmer effect for active progress */}
                                        {item.status !== 'completed' && item.status !== 'error' && (
                                            <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
