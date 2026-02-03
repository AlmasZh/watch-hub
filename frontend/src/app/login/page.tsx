'use client';

import { useState } from 'react';

export default function LoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement authentication logic
        console.log('Logging in with:', { identifier, password });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-600 to-blue-600 px-4 py-12 sm:px-6 lg:px-8">
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
                            className="flex w-full justify-center rounded-md bg-[#5865F2] px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#4752c4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5865F2] transition-colors duration-200"
                        >
                            Log In
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-left text-sm">
                    <p className="text-gray-400">
                        Need an account?{' '}
                        <a href="#" className="font-semibold text-[#00A8FC] hover:underline transition-colors">
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
