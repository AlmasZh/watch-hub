"use client";

import { useEffect, useState } from "react";
import Uppy from "@uppy/core";
import Dashboard from "@uppy/react/dashboard";
// @ts-ignore
import AwsS3 from "@uppy/aws-s3";
import { startUpload, completeUpload } from "@/api/video/upload";

import "@uppy/core/css/style.min.css";
import "@uppy/dashboard/css/style.min.css";

interface UppyUploaderProps {
    onUploadSuccess: (video: any) => void;
}

export default function UppyUploader({ onUploadSuccess }: UppyUploaderProps) {
    const [uppy] = useState(() => {
        const u = new Uppy({
            id: "uppy-videos",
            autoProceed: false,
            restrictions: {
                maxFileSize: 10 * 1024 * 1024 * 1024, // 10GB
                allowedFileTypes: ["video/*"],
            },
        });

        // Object to store presigned URLs for each upload
        const uploadDataCache: Record<string, { uploadId: string; fileKey: string; presignedUrls: any[] }> = {};

        u.use(AwsS3, {
            shouldUseMultipart: true,
            limit: 4,
            retryDelays: [0, 1000, 3000, 5000],

            async createMultipartUpload(file) {
                // Determine parts count (AwsS3Multipart divides the file into chunks, default size is usually 5MB)
                // Uppy internally calculates the parts needed, but our backend expects partsCount upfront.
                // We'll calculate it based on a 5MB threshold which is standard
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
                console.log('uploadDataCache:', uploadDataCache)

                return {
                    uploadId: response.uploadId,
                    key: response.fileKey,
                };
            },

            async listParts(file, opts) {
                // Not implemented on backend yet, returning empty arrays resets multipart upload nicely
                return [];
            },

            async signPart(file, partData) {
                const cache = uploadDataCache[file.id];
                if (!cache) {
                    throw new Error("Upload data not found");
                }

                // Uppy's partData.partNumber is 1-indexed just like our presignedUrls array.
                const presignedUrlData = cache.presignedUrls.find(p => p.partNumber === partData.partNumber);
                if (!presignedUrlData) {
                    throw new Error(`Presigned URL for part ${partData.partNumber} not found`);
                }

                return {
                    url: presignedUrlData.url,
                    headers: {},
                };
            },

            async completeMultipartUpload(file, uploadData) {
                const cache = uploadDataCache[file.id];
                if (!cache) {
                    throw new Error("Upload data not found");
                }

                const response = await completeUpload({
                    filename: file.name,
                    fileKey: cache.fileKey,
                    uploadId: cache.uploadId,
                    parts: uploadData.parts.map((p) => ({
                        PartNumber: p.PartNumber || 0,
                        ETag: p.ETag || "",
                    })),
                });

                return {
                    location: response.video?.stream_url || cache.fileKey,
                };
            },

            async abortMultipartUpload(file, uploadData) {
                // Abort logic not explicitly exposed in our API yet but handled on failure in complete
                console.log("Aborting", file.id);
            }
        });

        return u;
    });

    useEffect(() => {
        const onComplete = (file: any, response: any) => {
            console.log("Upload complete!", file, response);
            if (response.body?.video) {
                onUploadSuccess(response.body.video);
            } else {
                // Fallback basic item if we can't extract the video properly directly yet
                onUploadSuccess({
                    id: file.id,
                    title: file.name,
                    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop",
                    duration: "00:00",
                    createdAt: new Date(),
                    size: (file.size ? (file.size / (1024 * 1024)).toFixed(2) + " MB" : "N/A")
                });
            }
        };

        uppy.on("upload-success", onComplete);

        return () => {
            uppy.off("upload-success", onComplete);
        };
    }, [uppy, onUploadSuccess]);

    // Clean up uppy instance when the component entirely unmounts (but React 18 strict mode double-mounts might be an issue, so we stick to state initialization)
    useEffect(() => {
        return () => uppy.destroy();
    }, [uppy]);

    return (
        <div className="w-full mb-8">
            <Dashboard
                uppy={uppy}
                theme="dark"
                proudlyDisplayPoweredByUppy={false}
                width="100%"
                height={350}
                note="MP4, MKV, AVI up to 10GB"
            />
        </div>
    );
}
