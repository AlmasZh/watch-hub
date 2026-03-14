import { authFetch } from '@/api/fetch-client';
import { UserVideoResponse } from '@/types/video/user-videos';

export async function getUserVideos(): Promise<UserVideoResponse[]> {
    const response = await authFetch('/video/videos');

    if (!response.ok) {
        throw new Error('Failed to fetch user videos');
    }

    return response.json();
}

export async function deleteUserVideo(id: string): Promise<void> {
    const response = await authFetch(`/video/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete video');
    }
}
