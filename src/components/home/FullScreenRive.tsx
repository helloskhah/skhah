"use client";

import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function FullScreenRive() {
    const [isNight, setIsNight] = useState(false);

    const { RiveComponent, rive } = useRive({
        src: "/nature.riv",
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
        autoplay: true,
        // Play 'All' and every specific sheep loop found to ensure they all move
        animations: [
            "All",
            "Sheeps Eating",
            "Sheep 3 eating",
            "Sheep 2 eating",
            "Sheeps ears 1",
            "Sheep 2 ears",
            "Stars Moving"
        ],
    });

    // Ensure animations play when Rive is ready
    useEffect(() => {
        if (rive) {
            // Force play all loops
            rive.play([
                "All",
                "Sheeps Eating",
                "Sheep 3 eating",
                "Sheep 2 eating",
                "Sheeps ears 1",
                "Sheep 2 ears",
                "Stars Moving"
            ]);
        }
    }, [rive]);

    const toggleTheme = () => {
        if (!rive) return;

        if (isNight) {
            // Switch to Day
            rive.play("Environment Night to Sun trans");
            setIsNight(false);
        } else {
            // Switch to Night
            rive.play("Environment Sun to Night trans");
            setIsNight(true);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full z-0 bg-black">
            <RiveComponent className="w-full h-full" />

            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg group"
                aria-label="Toggle Theme"
            >
                {isNight ? (
                    <Sun className="w-6 h-6 text-yellow-300 group-hover:rotate-90 transition-transform" />
                ) : (
                    <Moon className="w-6 h-6 text-blue-200 group-hover:-rotate-12 transition-transform" />
                )}
            </button>
        </div>
    );
}
