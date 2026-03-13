import { AlertCircle, UploadCloud } from "lucide-react";

interface Props {
    error: string | null;
    onRetry: () => void;
}

export function UploadErrorState({ error, onRetry }: Props) {
    return (
        <div className="flex flex-col items-center text-center px-8 w-full max-w-lg animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-5 bg-red-500/10 rounded-full mb-6 ring-1 ring-red-500/30 shadow-lg shadow-red-500/10 relative">
                <AlertCircle className="w-12 h-12 text-red-500 relative z-10" />
            </div>
            <h3 className="text-2xl font-bold text-red-100 mb-3">Upload Failed</h3>
            <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4 mb-8 w-full max-h-32 overflow-y-auto custom-scrollbar">
                <p className="text-red-400/90 text-sm break-words">{error}</p>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRetry();
                }}
                className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-full font-bold transition-all duration-300 shadow-xl shadow-white/5 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
                <UploadCloud className="w-5 h-5" />
                Try Again
            </button>
        </div>
    );
}
