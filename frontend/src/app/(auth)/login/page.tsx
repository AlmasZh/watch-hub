'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { login } from '@/api/auth/login';
import { useRouter } from 'next/navigation';
import { authFetch } from '@/api/fetch-client';

export default function LoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const formData = new URLSearchParams();
            formData.append('username', identifier);
            formData.append('password', password);
            await login(formData);
            router.push('/');
        } catch (err) {
            console.error('Login failed:', err);
            setError('Invalid username or password.');
        }
    };
    const router = useRouter();

    useEffect(
        () => {
            const checkAuth = async () => {
                try {
                    const res = await authFetch('/auth/verify');
                    const body = await res.json();
                    if (body) {
                        router.push('/');
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                }
            };
            checkAuth();
        }, []
    )

    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-violet-600 to-blue-600 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-[#2b2d31] p-10 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
                        Welcome back!
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        We're so excited to see you again!
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-red-500/10 p-3 outline outline-1 outline-red-500/20">
                            <p className="text-sm font-medium text-red-400">{error}</p>
                        </div>
                    )}
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="identifier" className="block text-xs font-bold uppercase leading-6 text-gray-400">
                                Email or Username
                            </label>
                            <div className="mt-2">
                                <input
                                    id="identifier"
                                    name="identifier"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    className="block w-full rounded-md border-none bg-[#1e1f22] py-3 pl-4 text-gray-100 shadow-sm focus:ring-2 focus:ring-inset focus:ring-[#5865F2] sm:text-sm sm:leading-6 transition-all duration-200 outline-none"
                                    placeholder=""
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-xs font-bold uppercase leading-6 text-gray-400">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-[#00A8FC] hover:underline transition-colors">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-none bg-[#1e1f22] py-3 pl-4 text-gray-100 shadow-sm focus:ring-2 focus:ring-inset focus:ring-[#5865F2] sm:text-sm sm:leading-6 transition-all duration-200 outline-none"
                                    placeholder=""
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-[#5865F2] px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#4752c4] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#5865F2] transition-colors duration-200"
                        >
                            Log In
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-left text-sm">
                    <p className="text-gray-400">
                        Need an account?{' '}
                        <Link href="/register" className="font-semibold text-[#00A8FC] hover:underline transition-colors">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
