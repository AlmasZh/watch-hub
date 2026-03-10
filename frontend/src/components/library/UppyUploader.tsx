"use client";

import { useEffect, useState, useRef } from "react";
import Uppy from "@uppy/core";
// @ts-ignore
import AwsS3 from "@uppy/aws-s3";
import { startUpload, completeUpload } from "@/api/video/upload";
import { UploadCompleteResponse } from "@/types/video/upload";
import { UploadCloud, FileVideo, CheckCircle2, AlertCircle, X } from "lucide-react";

import "@uppy/core/css/style.min.css";

interface UppyUploaderProps {
    onUploadSuccess: (video: UploadCompleteResponse) => void;
}

export default function UppyUploader({ onUploadSuccess }: UppyUploaderProps) {
    const [uploadState, setUploadState] = useState<{
        fileId: string | null;
        fileName: string;
        progress: number;
        status: 'idle' | 'uploading' | 'success' | 'error';
        error: string | null;
    }>({
        fileId: null,
        fileName: '',
        progress: 0,
        status: 'idle',
        error: null
    });
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [uppy] = useState(() => {
        const u = new Uppy({
            id: "uppy-videos",
            autoProceed: true,
            restrictions: {
                maxFileSize: 10 * 1024 * 1024 * 1024, // 10GB
                maxNumberOfFiles: 1,
                allowedFileTypes: ["video/*"],
            },
        });

        const uploadDataCache: Record<string, { uploadId: string; fileKey: string; presignedUrls: any[] }> = {};

        u.use(AwsS3, {
            shouldUseMultipart: true,
            limit: 4,
            retryDelays: [0, 1000, 3000, 5000],

            async createMultipartUpload(file: any) {
                const minPartSize = 5 * 1024 * 1024;
                const fileSize = file.data?.size || 0;
                const partsCount = fileSize > 0 ? Math.ceil(fileSize / minPartSize) : 1;

                const response = await startUpload({
                    filename: file.name,
                    partsCount: partsCount,
                    contentType: file.type || "video/mp4",
                });

                uploadDataCache[file.id] = {
                    uploadId: response.uploadId,
                    fileKey: response.fileKey,
                    presignedUrls: response.presignedUrls,
                };

                return {
                    uploadId: response.uploadId,
                    key: response.fileKey,
                };
            },

            async listParts() {
                return [];
            },

            async signPart(file: any, partData: any) {
                const cache = uploadDataCache[file.id];
                if (!cache) throw new Error("Upload data not found");

                const presignedUrlData = cache.presignedUrls.find(p => p.partNumber === partData.partNumber);
                if (!presignedUrlData) {
                    throw new Error(`Presigned URL for part ${partData.partNumber} not found`);
                }

                return {
                    url: presignedUrlData.url,
                    headers: {},
                };
            },

            async completeMultipartUpload(file: any, uploadData: any) {
                const cache = uploadDataCache[file.id];
                if (!cache) throw new Error("Upload data not found");

                let durationSeconds = 0;
                if (file.data instanceof File || file.data instanceof Blob) {
                    durationSeconds = await new Promise<number>((resolve) => {
                        const video = document.createElement('video');
                        video.preload = 'metadata';
                        video.onloadedmetadata = () => {
                            URL.revokeObjectURL(video.src);
                            resolve(video.duration);
                        };
                        video.onerror = () => {
                            URL.revokeObjectURL(video.src);
                            resolve(0);
                        };
                        video.src = URL.createObjectURL(file.data as Blob);
                    });
                }

                const response = await completeUpload({
                    filename: file.name,
                    fileKey: cache.fileKey,
                    uploadId: cache.uploadId,
                    durationSeconds: Math.round(durationSeconds),
                    parts: uploadData.parts.map((p: any) => ({
                        PartNumber: p.PartNumber || 0,
                        ETag: p.ETag || "",
                    })),
                });

                return {
                    location: response.streamUrl,
                    video: response,
                };
            },

            async abortMultipartUpload(file: any) {
                console.log("Aborting", file.id);
            }
        });

        return u;
    });

    useEffect(() => {
        const onFileAdded = (file: any) => {
            setUploadState({
                fileId: file.id,
                fileName: file.name,
                progress: 0,
                status: 'uploading',
                error: null
            });
        };

        const onProgress = (file: any, progress: any) => {
            setUploadState(prev => {
                if (prev.fileId !== file.id) return prev;
                return {
                    ...prev,
                    progress: Math.round((progress.bytesUploaded / progress.bytesTotal) * 100)
                };
            });
        };

        const onComplete = (file: any, response: any) => {
            setUploadState(prev => ({ ...prev, status: 'success', progress: 100 }));
            if (response.body?.video) {
                setTimeout(() => onUploadSuccess(response.body.video), 1200);
            } else {
                setTimeout(() => onUploadSuccess({
                    streamUrl: file.id,
                    originalFileName: file.name,
                    thumbnailUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop",
                    durationSeconds: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }), 1200);
            }
        };

        const onError = (file: any, error: any) => {
            setUploadState(prev => ({ ...prev, status: 'error', error: error.message }));
        };

        const onRestrictionFailed = (file: any, error: any) => {
            setUploadState(prev => ({ ...prev, status: 'error', error: error.message }));
        };

        uppy.on("file-added", onFileAdded);
        uppy.on("upload-progress", onProgress);
        uppy.on("upload-success", onComplete);
        uppy.on("upload-error", onError);
        uppy.on("restriction-failed", onRestrictionFailed);

        return () => {
            uppy.off("file-added", onFileAdded);
            uppy.off("upload-progress", onProgress);
            uppy.off("upload-success", onComplete);
            uppy.off("upload-error", onError);
            uppy.off("restriction-failed", onRestrictionFailed);
        };
    }, [uppy, onUploadSuccess]);

    useEffect(() => {
        return () => uppy.destroy();
    }, [uppy]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            try {
                uppy.addFile({
                    name: files[0].name,
                    type: files[0].type,
                    data: files[0],
                });
            } catch (err: any) {
                setUploadState(prev => ({ ...prev, status: 'error', error: err.message }));
            }
        }
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
                    if (files.length > 0) {
                        try {
                            uppy.addFile({
                                name: files[0].name,
                                type: files[0].type,
                                data: files[0],
                            });
                        } catch (err: any) {
                            setUploadState(prev => ({ ...prev, status: 'error', error: err.message }));
                        }
                    }
                }}
            >
                {/* IDLE STATE */}
                {uploadState.status === 'idle' && (
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
                )}

                {/* UPLOADING STATE */}
                {uploadState.status === 'uploading' && (
                    <div className="w-full max-w-md px-8 flex flex-col items-center animate-in fade-in duration-500">
                        <div className="w-24 h-24 relative mb-8 drop-shadow-2xl">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" className="text-gray-800 stroke-current" strokeWidth="6" fill="none" />
                                <circle
                                    cx="50" cy="50" r="45"
                                    className="text-blue-500 stroke-current transition-all duration-300 ease-out"
                                    strokeWidth="6" strokeLinecap="round" fill="none"
                                    strokeDasharray="283"
                                    strokeDashoffset={283 - (283 * uploadState.progress) / 100}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-bold text-white tracking-tighter">{uploadState.progress}%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center w-full mb-4 space-x-3 bg-gray-950/40 p-4 rounded-2xl border border-gray-800/50 backdrop-blur-md">
                            <div className="p-2 bg-gray-800 rounded-lg">
                                <FileVideo className="w-6 h-6 text-gray-300" />
                            </div>
                            <span className="text-base font-medium text-gray-200 truncate flex-1" title={uploadState.fileName}>
                                {uploadState.fileName}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-400 animate-pulse tracking-wide">Uploading and processing...</p>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (uploadState.fileId) {
                                    uppy.removeFile(uploadState.fileId);
                                    setUploadState({ fileId: null, fileName: '', progress: 0, status: 'idle', error: null });
                                }
                            }}
                            className="mt-8 p-3 bg-gray-800/50 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-full transition-all duration-300 hover:scale-110 border border-transparent hover:border-red-500/30"
                            title="Cancel upload"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* SUCCESS STATE */}
                {uploadState.status === 'success' && (
                    <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
                        <div className="p-6 bg-green-500/10 rounded-full mb-6 ring-4 ring-green-500/20 relative">
                            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                            <CheckCircle2 className="w-16 h-16 text-green-500 relative z-10" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-100 mb-2 tracking-tight">Upload Complete!</h3>
                        <p className="text-gray-400 font-medium">Your video is ready.</p>
                    </div>
                )}

                {/* ERROR STATE */}
                {uploadState.status === 'error' && (
                    <div className="flex flex-col items-center text-center px-8 w-full max-w-lg animate-in slide-in-from-bottom-4 duration-500">
                        <div className="p-5 bg-red-500/10 rounded-full mb-6 ring-1 ring-red-500/30 shadow-lg shadow-red-500/10 relative">
                            <AlertCircle className="w-12 h-12 text-red-500 relative z-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-red-100 mb-3">Upload Failed</h3>
                        <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4 mb-8 w-full max-h-32 overflow-y-auto custom-scrollbar">
                            <p className="text-red-400/90 text-sm break-words">{uploadState.error}</p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (fileInputRef.current) fileInputRef.current.value = '';
                                setUploadState({ fileId: null, fileName: '', progress: 0, status: 'idle', error: null });
                            }}
                            className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-full font-bold transition-all duration-300 shadow-xl shadow-white/5 hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            <UploadCloud className="w-5 h-5" />
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
