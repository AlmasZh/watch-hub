import { RegisterRequest } from "@/types/auth/register";
import env from "@/api/env";

export async function register(request: RegisterRequest) {
    const res = await fetch(env.API_URL + '/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!res.ok) {
        throw new Error('Failed to register');
    }

    const data = await res.json();
    return data;
}