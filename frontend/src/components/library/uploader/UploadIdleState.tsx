import { UploadCloud, AlertCircle } from "lucide-react";

export function UploadIdleState() {
    return (
        <div className="flex flex-col items-center pointer-events-none transition-all duration-300">
            <div className="p-5 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500 ring-1 ring-gray-700/50">
                <UploadCloud className="w-12 h-12 text-blue-400 drop-shadow-lg" />
            </div>
            <h3 className="text-2xl font-bold text-gray-100 mb-3 tracking-tight">Upload your video</h3>
            <p className="text-gray-400 text-sm mb-8 text-center max-w-sm leading-relaxed">
                Drag and drop your video file here, or click to browse.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 bg-gray-950/50 px-4 py-2 rounded-full border border-gray-800 backdrop-blur-sm">
                <AlertCircle className="w-4 h-4 text-blue-400" />
                MP4, MKV, AVI up to 10GB
            </div>
        </div>
    );
}
