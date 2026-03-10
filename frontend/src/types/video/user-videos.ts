export interface UserVideoResponse {
    streamUrl: string;
    thumbnailUrl: string | null;
    durationSeconds: number;
    originalFileName: string;
    createdAt: string;
    updatedAt: string;
}
