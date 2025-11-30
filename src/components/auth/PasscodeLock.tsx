"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PasscodeLock({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [input, setInput] = useState("");
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [attempts, setAttempts] = useState(0);
    const [bannedUntil, setBannedUntil] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState<string>("");

    useEffect(() => {
        // Check session storage and local storage on mount
        const storedAuth = sessionStorage.getItem("site_access_granted");
        const storedAttempts = localStorage.getItem("passcode_attempts");
        const storedBan = localStorage.getItem("passcode_ban_until");

        if (storedAuth === "true") {
            setIsAuthenticated(true);
        }

        if (storedAttempts) setAttempts(parseInt(storedAttempts));
        if (storedBan) {
            const banTime = parseInt(storedBan);
            if (banTime > Date.now()) {
                setBannedUntil(banTime);
            } else {
                // Ban expired
                localStorage.removeItem("passcode_ban_until");
                localStorage.removeItem("passcode_attempts");
                setAttempts(0);
            }
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        // Timer for ban countdown
        if (bannedUntil) {
            const interval = setInterval(() => {
                const now = Date.now();
                if (now > bannedUntil) {
                    setBannedUntil(null);
                    setAttempts(0);
                    localStorage.removeItem("passcode_ban_until");
                    localStorage.removeItem("passcode_attempts");
                    clearInterval(interval);
                } else {
                    const diff = bannedUntil - now;
                    const minutes = Math.floor(diff / 60000);
                    const seconds = Math.floor((diff % 60000) / 1000);
                    setTimeLeft(`${minutes}m ${seconds}s`);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [bannedUntil]);

    const logDeviceDetails = () => {
        const details = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            timestamp: new Date().toISOString(),
            ip: "Logged (Simulated)" // In a real app, this would be captured server-side
        };
        console.warn("SECURITY ALERT: Device banned due to multiple failed attempts", details);
        // Here you would send 'details' to your backend
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (bannedUntil) return;

        if (input === "2703") {
            sessionStorage.setItem("site_access_granted", "true");
            localStorage.removeItem("passcode_attempts");
            setIsAuthenticated(true);
        } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            localStorage.setItem("passcode_attempts", newAttempts.toString());

            if (newAttempts >= 3) {
                const banTime = Date.now() + 30 * 60 * 1000; // 30 minutes
                setBannedUntil(banTime);
                localStorage.setItem("passcode_ban_until", banTime.toString());
                logDeviceDetails();
                setError(true);
            } else {
                setError(true);
                setInput("");
                setTimeout(() => setError(false), 2000);
            }
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
                        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-8 p-8 max-w-md w-full text-center">
                            <h1 className="text-2xl md:text-3xl font-serif tracking-[0.3em] uppercase text-white/80">
                                {bannedUntil ? "Security Lockout" : "Restricted Access"}
                            </h1>

                            {bannedUntil ? (
                                <div className="flex flex-col items-center gap-4">
                                    <p className="text-red-500 font-mono text-sm tracking-widest uppercase">
                                        Too many failed attempts
                                    </p>
                                    <div className="text-4xl font-mono text-white/50">
                                        {timeLeft}
                                    </div>
                                    <p className="text-xs text-white/30 uppercase tracking-widest mt-4">
                                        Device ID & IP Logged
                                    </p>
                                </div>
                            ) : (
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
                                                {attempts > 0 ? `${3 - attempts} attempts remaining` : "Access Denied"}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {!bannedUntil && (
                                <button
                                    type="submit"
                                    className="mt-8 px-12 py-3 border border-white/10 hover:bg-white/5 hover:border-white/30 transition-all duration-500 uppercase tracking-[0.2em] text-xs text-white/60 hover:text-white"
                                >
                                    Enter
                                </button>
                            )}
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {isAuthenticated && children}
        </>
    );
}
