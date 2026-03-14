import { CheckCircle2 } from "lucide-react";

export function UploadSuccessState() {
    return (
        <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
            <div className="p-6 bg-green-500/10 rounded-full mb-6 ring-4 ring-green-500/20 relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                <CheckCircle2 className="w-16 h-16 text-green-500 relative z-10" />
            </div>
            <h3 className="text-3xl font-bold text-gray-100 mb-2 tracking-tight">Upload Complete!</h3>
            <p className="text-gray-400 font-medium">Your video is ready.</p>
        </div>
    );
}
