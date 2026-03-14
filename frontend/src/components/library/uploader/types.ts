export interface UploadState {
    fileId: string | null;
    fileName: string;
    progress: number;
    status: 'idle' | 'uploading' | 'success' | 'error';
    error: string | null;
}
