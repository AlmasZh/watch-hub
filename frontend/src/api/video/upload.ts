import { authFetch } from '@/api/fetch-client';

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
    uploadId: string;
    parts: PartInfo[];
}

export async function startUpload(request: UploadStartRequest): Promise<UploadStartResponse> {
    const response = await authFetch('/video/upload/start', {
        method: 'POST',
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error('Failed to start multipart upload');
    }

    return response.json();
}

export async function completeUpload(request: UploadCompleteRequest): Promise<any> {
    const response = await authFetch('/video/upload/complete', {
        method: 'POST',
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error('Failed to complete multipart upload');
    }

    return response.json();
}
