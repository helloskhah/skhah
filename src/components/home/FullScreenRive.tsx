"use client";

import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function FullScreenRive() {
    const [isNight, setIsNight] = useState(false);

    const { RiveComponent, rive } = useRive({
        src: "/nature.riv",
        artboard: "Day", // Start with Day artboard
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
        autoplay: true,
    });

    // Ensure ALL animations play when Rive is ready
    useEffect(() => {
        if (rive) {
            // Get ALL animation names and play them all
            const allAnimations = rive.animationNames;
            console.log("Playing all animations:", allAnimations);

            // Play every single animation found in the file
            if (allAnimations && allAnimations.length > 0) {
                rive.play(allAnimations);
            }
        }
    }, [rive]);

    const toggleTheme = () => {
        if (!rive) return;

        if (isNight) {
            // Switch to Day - change artboard
            rive.stop();
            // Note: Rive doesn't support dynamic artboard switching easily
            // The transitions should handle this via animations
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
