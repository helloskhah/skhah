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
    const containerRef = useRef<HTMLDivElement>(null);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const newSpark = { id: Date.now(), x, y };
            setSparks((prev) => [...prev, newSpark]);

            // Cleanup spark after animation
            setTimeout(() => {
                setSparks((prev) => prev.filter((s) => s.id !== newSpark.id));
            }, duration * 1000);
        }
    };

    return (
        <div
            ref={containerRef}
            onClick={handleClick}
            className="relative w-full h-full"
        >
            {children}
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
