"use client";

import { useEffect, useState } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { Moon, Sun } from "lucide-react";

export function FullScreenRive() {
    const [isNight, setIsNight] = useState(false);

    const { rive, RiveComponent } = useRive({
        src: "/nature.riv",
        // Don't use state machines - they conflict with animation playback
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
        autoplay: true,
    });

    useEffect(() => {
        if (!rive) return;

        const allAnimations = rive.animationNames;
        console.log("All animations:", allAnimations);

        // Play all animations for continuous movement
        if (allAnimations && allAnimations.length > 0) {
            rive.play(allAnimations);
            console.log("Playing all animations");
        }
    }, [rive]);

    const toggleTheme = () => {
        if (!rive) return;

        if (isNight) {
            // Switch to Day
            console.log("Switching to Day");
            rive.play("Environment Night to Sun trans");
            setIsNight(false);
        } else {
            // Switch to Night
            console.log("Switching to Night");
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
