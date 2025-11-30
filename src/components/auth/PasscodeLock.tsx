"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PasscodeLock({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [input, setInput] = useState("");
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check session storage on mount
        const storedAuth = sessionStorage.getItem("site_access_granted");
        if (storedAuth === "true") {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input === "2703") {
            sessionStorage.setItem("site_access_granted", "true");
            setIsAuthenticated(true);
        } else {
            setError(true);
            setInput("");
            setTimeout(() => setError(false), 2000);
        }
    };

    // Prevent flash of content while checking storage
    if (isLoading) return null;

    return (
        <>
            <AnimatePresence mode="wait">
                {!isAuthenticated && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black text-white"
                    >
                        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-8 p-8">
                            <h1 className="text-2xl md:text-3xl font-serif tracking-[0.3em] uppercase text-white/80">
                                Restricted Access
                            </h1>

                            <div className="relative group">
                                <input
                                    type="password"
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value);
                                        if (error) setError(false);
                                    }}
                                    placeholder="••••"
                                    className="bg-transparent border-b border-white/20 text-center text-4xl tracking-[1em] py-4 focus:outline-none focus:border-white/60 transition-all w-64 placeholder:text-white/10 placeholder:tracking-[0.5em]"
                                    autoFocus
                                    maxLength={4}
                                />

                                <AnimatePresence>
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute top-full left-0 right-0 text-center text-red-400/80 text-xs mt-4 tracking-[0.2em] uppercase"
                                        >
                                            Access Denied
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                type="submit"
                                className="mt-8 px-12 py-3 border border-white/10 hover:bg-white/5 hover:border-white/30 transition-all duration-500 uppercase tracking-[0.2em] text-xs text-white/60 hover:text-white"
                            >
                                Enter
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Render children but keep them hidden/unmounted until auth if strict security is needed, 
          or just cover them. Here we mount them but the overlay covers them. 
          For better security/performance, we can conditionally render. */}
            {isAuthenticated && children}
        </>
    );
}
