"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";


export function Hero() {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-background">
            {/* Background Gradient/Image Placeholder */}
            <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="text-primary uppercase tracking-[0.2em] text-sm md:text-base mb-4 block">
                        Fine Jewelry Collection
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-5xl md:text-7xl lg:text-9xl font-serif text-foreground mb-6 leading-tight"
                >
                    Timeless <br className="hidden md:block" />
                    <span className="italic text-primary">Elegance</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light"
                >
                    Discover pieces that tell your story. Handcrafted with passion, designed for eternity.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                >
                    <Link
                        href="/collections"
                        className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-3 uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
                    >
                        Explore Collection
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs text-gray-500 tracking-widest uppercase animate-bounce"
            >
                Scroll to Discover
            </motion.div>
        </section>
    );
}
