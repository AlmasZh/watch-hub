import { FileVideo, X } from "lucide-react";

interface Props {
    progress: number;
    fileName: string;
    onCancel: () => void;
}

export function UploadProgressState({ progress, fileName, onCancel }: Props) {
    return (
        <div className="w-full max-w-md px-8 flex flex-col items-center animate-in fade-in duration-500">
            <div className="w-24 h-24 relative mb-8 drop-shadow-2xl">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" className="text-gray-800 stroke-current" strokeWidth="6" fill="none" />
                    <circle
                        cx="50" cy="50" r="45"
                        className="text-blue-500 stroke-current transition-all duration-300 ease-out"
                        strokeWidth="6" strokeLinecap="round" fill="none"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * progress) / 100}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-white tracking-tighter">{progress}%</span>
                </div>
            </div>
            <div className="flex items-center justify-center w-full mb-4 space-x-3 bg-gray-950/40 p-4 rounded-2xl border border-gray-800/50 backdrop-blur-md">
                <div className="p-2 bg-gray-800 rounded-lg">
                    <FileVideo className="w-6 h-6 text-gray-300" />
                </div>
                <span className="text-base font-medium text-gray-200 truncate flex-1" title={fileName}>
                    {fileName}
                </span>
            </div>
            <p className="text-sm font-medium text-gray-400 animate-pulse tracking-wide">Uploading and processing...</p>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onCancel();
                }}
                className="mt-8 p-3 bg-gray-800/50 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-full transition-all duration-300 hover:scale-110 border border-transparent hover:border-red-500/30"
                title="Cancel upload"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
}
