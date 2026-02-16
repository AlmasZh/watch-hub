import { authFetch } from '@/api/fetch-client';

export interface Movie {
    id: string;
    title: string;
    description: string;
    streamUrl: string;
    posterUrl: string;
    thumbnailUrl: string;
    durationSeconds: number;
    releaseYear: number;
    director: string;
    rating: number;
    status: string;
    type: string;
}

export async function getMovies(): Promise<Movie[]> {
    const response = await authFetch('/video/movies', { skipAuth: true });

    if (!response.ok) {
        throw new Error('Failed to fetch movies');
    }

    return response.json();
}
