export interface UploadStartRequest {
    filename: string;
    partsCount: number;
    contentType?: string;
}

export interface UploadStartResponse {
    fileKey: string;
    uploadId: string;
    presignedUrls: {
        partNumber: number;
        url: string;
    }[];
}

export interface PartInfo {
    PartNumber: number;
    ETag: string;
}

export interface UploadCompleteRequest {
    filename: string;
    fileKey: string;
    durationSeconds: number;
    uploadId: string;
    parts: PartInfo[];
}
