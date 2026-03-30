'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { register } from '@/api/auth/register';
import { RegisterRequest } from "@/types/auth/register";
import { verifyRegistrationForm } from '@/utils/verifyAuthForm';
import { useRouter } from 'next/navigation';
import { authFetch } from '@/api/fetch-client';

export default function RegisterPage() {
    const [formData, setFormData] = useState<RegisterRequest>({
        email: '',
        username: '',
        displayName: '',
        dateOfBirth: '',
        password: '',
    });
    const [authError, setAuthError] = useState<string | null>(null);
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
        }, [router]
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(null);
        // TODO: Implement registration logic
        console.log('Registering with:', formData);
        const errors = verifyRegistrationForm(formData);
        if (Object.keys(errors).length > 0) {
            console.log('Errors:', errors);
            setAuthError(Object.values(errors)[0] as string);
            return;
        }

        try {
            await register(formData);
            router.push('/');
        } catch (error) {
            console.error('Registration failed:', error);
            setAuthError('Registration failed. Please check your details and try again.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-violet-600 to-blue-600 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-[#2b2d31] p-10 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
                        Create an account
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Join us and start watching!
                    </p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    {authError && (
                        <div className="rounded-md bg-red-500/10 p-3 outline outline-1 outline-red-500/20">
                            <p className="text-sm font-medium text-red-400">{authError}</p>
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-xs font-bold uppercase leading-6 text-gray-400">
                            Email
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full rounded-md border-none bg-[#1e1f22] py-3 pl-4 text-gray-100 shadow-sm focus:ring-2 focus:ring-inset focus:ring-[#5865F2] sm:text-sm sm:leading-6 transition-all duration-200 outline-none"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-xs font-bold uppercase leading-6 text-gray-400">
                            Username
                        </label>
                        <div className="mt-2">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                className="block w-full rounded-md border-none bg-[#1e1f22] py-3 pl-4 text-gray-100 shadow-sm focus:ring-2 focus:ring-inset focus:ring-[#5865F2] sm:text-sm sm:leading-6 transition-all duration-200 outline-none"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="displayName" className="block text-xs font-bold uppercase leading-6 text-gray-400">
                            Display Name
                        </label>
                        <div className="mt-2">
                            <input
                                id="displayName"
                                name="displayName"
                                type="text"
                                autoComplete="nickname"
                                required
                                className="block w-full rounded-md border-none bg-[#1e1f22] py-3 pl-4 text-gray-100 shadow-sm focus:ring-2 focus:ring-inset focus:ring-[#5865F2] sm:text-sm sm:leading-6 transition-all duration-200 outline-none"
                                value={formData.displayName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="dateOfBirth" className="block text-xs font-bold uppercase leading-6 text-gray-400">
                            Date of Birth
                        </label>
                        <div className="mt-2">
                            <input
                                id="dateOfBirth"
                                name="dateOfBirth"
                                type="date"
                                required
                                className="block w-full rounded-md border-none bg-[#1e1f22] py-3 pl-4 text-gray-100 shadow-sm focus:ring-2 focus:ring-inset focus:ring-[#5865F2] sm:text-sm sm:leading-6 transition-all duration-200 outline-none [color-scheme:dark]"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs font-bold uppercase leading-6 text-gray-400">
                            Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="block w-full rounded-md border-none bg-[#1e1f22] py-3 pl-4 text-gray-100 shadow-sm focus:ring-2 focus:ring-inset focus:ring-[#5865F2] sm:text-sm sm:leading-6 transition-all duration-200 outline-none"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-[#5865F2] px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#4752c4] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#5865F2] transition-colors duration-200"
                        >
                            Continue
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-left text-sm">
                    <p className="text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-[#00A8FC] hover:underline transition-colors">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
