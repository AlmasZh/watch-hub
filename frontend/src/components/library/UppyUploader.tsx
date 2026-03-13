"use client";

import { useState, useRef } from "react";
import { UploadCompleteResponse } from "@/types/video/upload";
import { useUppyUploader } from "./uploader/useUppyUploader";
import { UploadIdleState } from "./uploader/UploadIdleState";
import { UploadProgressState } from "./uploader/UploadProgressState";
import { UploadSuccessState } from "./uploader/UploadSuccessState";
import { UploadErrorState } from "./uploader/UploadErrorState";

import "@uppy/core/css/style.min.css";

interface UppyUploaderProps {
    onUploadSuccess: (video: UploadCompleteResponse) => void;
}

export default function UppyUploader({ onUploadSuccess }: UppyUploaderProps) {
    const { uploadState, cancelUpload, retryUpload, handleFileUpload } = useUppyUploader(onUploadSuccess);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        handleFileUpload(files);
        e.target.value = '';
    };

    const getContainerClasses = () => {
        const baseClasses = "relative flex flex-col items-center justify-center w-full h-[350px] rounded-3xl border-2 transition-all duration-300 ease-in-out overflow-hidden group";

        if (uploadState.status === 'idle' || uploadState.status === 'error') {
            if (isDragging) {
                return `${baseClasses} cursor-pointer border-blue-500 bg-blue-500/10 scale-[1.02]`;
            }
            return `${baseClasses} cursor-pointer border-gray-700 border-dashed bg-gray-900/50 hover:bg-gray-800/80 hover:border-gray-500`;
        }

        return `${baseClasses} border-gray-800/50 bg-gray-900 shadow-xl`;
    };

    return (
        <div className="w-full mb-8">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="video/*"
                onChange={handleFileChange}
            />
            <div
                onClick={() => {
                    if (uploadState.status === 'idle' || uploadState.status === 'error') {
                        fileInputRef.current?.click();
                    }
                }}
                className={getContainerClasses()}
                onDragOver={(e) => {
                    e.preventDefault();
                    if (uploadState.status === 'idle' || uploadState.status === 'error') setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (uploadState.status !== 'idle' && uploadState.status !== 'error') return;
                    const files = Array.from(e.dataTransfer.files);
                    handleFileUpload(files);
                }}
            >
                {/* IDLE STATE */}
                {uploadState.status === 'idle' && <UploadIdleState />}

                {/* UPLOADING STATE */}
                {uploadState.status === 'uploading' && (
                    <UploadProgressState
                        progress={uploadState.progress}
                        fileName={uploadState.fileName}
                        onCancel={cancelUpload}
                    />
                )}

                {/* SUCCESS STATE */}
                {uploadState.status === 'success' && <UploadSuccessState />}

                {/* ERROR STATE */}
                {uploadState.status === 'error' && (
                    <UploadErrorState
                        error={uploadState.error}
                        onRetry={() => {
                            if (fileInputRef.current) fileInputRef.current.value = '';
                            retryUpload();
                        }}
                    />
                )}
            </div>
        </div>
    );
}
