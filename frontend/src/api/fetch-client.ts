'use client';

import env from '@/api/env';

type AuthFetchOptions = RequestInit & {
  skipAuth?: boolean;
};

let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

const isFormData = (body: any): body is FormData => {
  return typeof FormData !== 'undefined' && body instanceof FormData;
};

export async function authFetch(
  input: RequestInfo,
  init?: AuthFetchOptions
) {
  input = env.API_URL! + input;

  const headers = new Headers(init?.headers);

  if (!headers.has('Content-Type') && !isFormData(init?.body)) {
    headers.set('Content-Type', 'application/json');
  }
  if (accessToken && !init?.skipAuth) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const config: RequestInit = {
    credentials: 'include',
    ...init,
    headers,
  };

  let response = await fetch(input, config);
  if (response.status === 401) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken();
    }

    try {
      const newToken = await refreshPromise;
      setAccessToken(newToken);
      
      headers.set('Authorization', `Bearer ${newToken}`);
      
      const retryConfig: RequestInit = { 
        ...config, 
        headers 
      };
      
      response = await fetch(input, retryConfig);
    } catch (error) {
      setAccessToken('');
      if (typeof window !== 'undefined') {
        console.log("redirecting to login");
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
      throw error;
    } finally {
      refreshPromise = null;
    }
  }

  return response;
}

async function refreshAccessToken(): Promise<string> {
  const res = await fetch(`${env.API_URL}/auth/refresh-token`, {
    method: 'POST',
    credentials: 'include', 
  });

  if (!res.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await res.json();
  return data.access_token;
}