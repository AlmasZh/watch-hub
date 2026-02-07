"use client";

import { UploadCloud } from "lucide-react";
import { useState, useRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface UploadZoneProps {
    onFileSelect: (files: FileList | null) => void;
}

export default function UploadZone({ onFileSelect }: UploadZoneProps) {
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileSelect(e.dataTransfer.files);
            // clear the selection afterward if needed, but for now we just pass it up
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files);
        }
    };

    return (
        <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
                "relative group flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer overflow-hidden",
                isDragActive
                    ? "border-blue-500 bg-blue-500/10 scale-[1.01]"
                    : "border-gray-700 bg-[#1e1f22] hover:border-gray-500 hover:bg-[#2b2d31]"
            )}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInput}
                className="hidden"
                multiple
                accept="video/*"
            />

            <div className="flex flex-col items-center gap-4 text-center p-6 z-10 transition-transform duration-300 group-hover:-translate-y-1">
                <div className={cn(
                    "p-4 rounded-full bg-gray-800 text-gray-400 mb-2 transition-all duration-300",
                    isDragActive ? "bg-blue-500 text-white scale-110" : "group-hover:bg-gray-700 group-hover:text-white"
                )}>
                    <UploadCloud size={32} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                        {isDragActive ? "Drop files to upload" : "Drag & drop videos here"}
                    </h3>
                    <p className="text-gray-400 text-sm">
                        or <span className="text-blue-400 hover:underline">browse files</span> from your computer
                    </p>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                    MP4, MKV, AVI up to 10GB
                </div>
            </div>

            {/* Background Decorative/Glow effect */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 transition-opacity duration-300",
                isDragActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )} />
        </div>
    );
}
