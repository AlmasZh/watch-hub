/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Uppy from "@uppy/core";
import AwsS3 from "@uppy/aws-s3";
import { startUpload, completeUpload } from "@/api/video/upload";
import { UploadCompleteResponse } from "@/types/video/upload";
import { UploadState } from "./types";

export function useUppyUploader(onUploadSuccess: (video: UploadCompleteResponse) => void) {
    const [uploadState, setUploadState] = useState<UploadState>({
        fileId: null,
        fileName: '',
        progress: 0,
        status: 'idle',
        error: null
    });

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
                    durationSeconds: Number.isFinite(durationSeconds) ? Math.round(durationSeconds) : 0,
                    parts: uploadData.parts.map((p: any) => {
                        if (!p.PartNumber || !p.ETag) {
                            throw new Error(`Invalid part entry missing PartNumber or ETag: ${JSON.stringify(p)}`);
                        }
                        return {
                            PartNumber: p.PartNumber,
                            ETag: p.ETag,
                        };
                    }),
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
                    id: file.id,
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

    const cancelUpload = () => {
        if (uploadState.fileId) {
            uppy.removeFile(uploadState.fileId);
            setUploadState({ fileId: null, fileName: '', progress: 0, status: 'idle', error: null });
        }
    };

    const retryUpload = () => {
        setUploadState({ fileId: null, fileName: '', progress: 0, status: 'idle', error: null });
    };

    const handleFileUpload = (files: File[]) => {
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
    };

    return {
        uppy,
        uploadState,
        cancelUpload,
        retryUpload,
        handleFileUpload
    };
}
