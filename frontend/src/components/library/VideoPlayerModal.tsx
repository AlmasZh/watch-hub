"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface VideoPlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
    streamUrl: string;
    title: string;
}

export default function VideoPlayerModal({ isOpen, onClose, streamUrl, title }: VideoPlayerModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }
        return () => {
            window.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!mounted || !isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-5xl bg-[#1e1f22] rounded-xl overflow-hidden border border-[#2b2d31] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-[#2b2d31] bg-[#2b2d31]/50">
                    <h3 className="text-lg font-semibold text-white truncate pr-4">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="relative w-full aspect-video bg-black">
                    <video
                        src={streamUrl}
                        controls
                        autoPlay
                        className="w-full h-full object-contain"
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </div>
    );
}
