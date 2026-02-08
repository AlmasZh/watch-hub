import env from "@/api/env";

export async function login(request: URLSearchParams) {
    const res = await fetch(env.API_URL + '/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: request.toString(),
    });

    if (!res.ok) {
        throw new Error('Failed to login');
    }

    const data = await res.json();
    return data;
}