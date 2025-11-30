"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Point {
    x: number;
    y: number;
    id: number;
    rotation: number;
}

interface TextCursorProps {
    text?: string;
    spacing?: number;
    followMouseDirection?: boolean;
    randomFloat?: boolean;
    exitDuration?: number;
    removalInterval?: number;
    maxPoints?: number;
    className?: string;
}

const TextCursor: React.FC<TextCursorProps> = ({
    text = "Hello!",
    spacing = 80,
    followMouseDirection = true,
    randomFloat = true,
    exitDuration = 0.3,
    removalInterval = 20,
    maxPoints = 10,
    className = "",
}) => {
    const [points, setPoints] = useState<Point[]>([]);
    const mousePos = useRef({ x: 0, y: 0 });
    const lastPointPos = useRef({ x: 0, y: 0 });
    const pointIdCounter = useRef(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };

            const dx = mousePos.current.x - lastPointPos.current.x;
            const dy = mousePos.current.y - lastPointPos.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > spacing) {
                const rotation = followMouseDirection
                    ? Math.atan2(dy, dx) * (180 / Math.PI)
                    : 0;

                const newPoint: Point = {
                    x: mousePos.current.x,
                    y: mousePos.current.y,
                    id: pointIdCounter.current++,
                    rotation,
                };

                setPoints((prev) => {
                    const updated = [...prev, newPoint];
                    if (updated.length > maxPoints) {
                        return updated.slice(updated.length - maxPoints);
                    }
                    return updated;
                });

                lastPointPos.current = { x: mousePos.current.x, y: mousePos.current.y };
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [spacing, followMouseDirection, maxPoints]);

    useEffect(() => {
        const interval = setInterval(() => {
            setPoints((prev) => {
                if (prev.length === 0) return prev;
                return prev.slice(1);
            });
        }, removalInterval * 10); // Convert to reasonable ms if needed, or assume input is ms/ticks

        return () => clearInterval(interval);
    }, [removalInterval]);

    return (
        <div className={`fixed inset-0 pointer-events-none z-[9999] ${className}`}>
            <AnimatePresence>
                {points.map((point) => (
                    <motion.div
                        key={point.id}
                        initial={{ opacity: 1, scale: 1 }}
                        exit={{
                            opacity: 0,
                            scale: 0.5,
                            y: randomFloat ? -20 : 0,
                            x: randomFloat ? (Math.random() - 0.5) * 20 : 0,
                        }}
                        transition={{ duration: exitDuration }}
                        style={{
                            position: "absolute",
                            left: point.x,
                            top: point.y,
                            transform: `translate(-50%, -50%) rotate(${point.rotation}deg)`,
                            color: "var(--primary)", // Use theme color
                            fontWeight: "bold",
                            fontSize: "1rem",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {text}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default TextCursor;
