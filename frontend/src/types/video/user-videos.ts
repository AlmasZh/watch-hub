export interface UserVideoResponse {
    id: string;
    streamUrl: string;
    thumbnailUrl: string | null;
    durationSeconds: number;
    originalFileName: string;
    createdAt: string;
    updatedAt: string;
}
