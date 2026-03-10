import { authFetch } from '@/api/fetch-client';
import { UploadCompleteRequest, UploadStartRequest, UploadStartResponse } from '@/types/video/upload';

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
