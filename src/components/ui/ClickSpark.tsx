"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Spark {
    id: number;
    x: number;
    y: number;
}

interface ClickSparkProps {
    children: React.ReactNode;
    sparkColor?: string;
    sparkSize?: number;
    sparkRadius?: number;
    sparkCount?: number;
    duration?: number;
}

export function ClickSpark({
    children,
    sparkColor = "#d4af37", // Gold default
    sparkSize = 10,
    sparkRadius = 15,
    sparkCount = 8,
    duration = 0.4,
}: ClickSparkProps) {
    const [sparks, setSparks] = useState<Spark[]>([]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const newSpark = { id: Date.now(), x: e.clientX, y: e.clientY };
            setSparks((prev) => [...prev, newSpark]);

            // Cleanup spark after animation
            setTimeout(() => {
                setSparks((prev) => prev.filter((s) => s.id !== newSpark.id));
            }, duration * 1000);
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [duration]);

    return (
        <>
            {children}
            <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
                <AnimatePresence>
                    {sparks.map((spark) => (
                        <SparkGroup
                            key={spark.id}
                            x={spark.x}
                            y={spark.y}
                            color={sparkColor}
                            size={sparkSize}
                            radius={sparkRadius}
                            count={sparkCount}
                            duration={duration}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </>
    );
}

function SparkGroup({
    x,
    y,
    color,
    size,
    radius,
    count,
    duration,
}: {
    x: number;
    y: number;
    color: string;
    size: number;
    radius: number;
    count: number;
    duration: number;
}) {
    return (
        <div
            className="absolute pointer-events-none"
            style={{ left: x, top: y }}
        >
            {Array.from({ length: count }).map((_, i) => {
                const angle = (i / count) * 360;
                return (
                    <motion.div
                        key={i}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                        animate={{
                            x: Math.cos((angle * Math.PI) / 180) * radius * 5, // Multiply radius for distance
                            y: Math.sin((angle * Math.PI) / 180) * radius * 5,
                            opacity: 0,
                            scale: 0,
                        }}
                        transition={{ duration: duration, ease: "easeOut" }}
                        className="absolute rounded-full"
                        style={{
                            backgroundColor: color,
                            width: size,
                            height: size,
                            transform: `rotate(${angle}deg)`,
                        }}
                    />
                );
            })}
        </div>
    );
}
