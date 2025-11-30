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
        autoplay: false, // Don't autoplay, we'll control it manually
    });

    // Initialize with Day mode and play all loop animations
    useEffect(() => {
        if (rive) {
            // First, ensure we're in day mode by playing the reverse transition if needed
            // This ensures we start in daytime
            const allAnimations = rive.animationNames;
            console.log("Available animations:", allAnimations);

            // Filter out transition animations and play only the loop animations
            const loopAnimations = allAnimations.filter(anim =>
                !anim.includes("trans") && !anim.includes("transition")
            );

            console.log("Playing loop animations:", loopAnimations);

            // Play all the loop animations (sheep, clouds, etc.)
            if (loopAnimations.length > 0) {
                rive.play(loopAnimations);
            }
        }
    }, [rive]);

    const toggleTheme = () => {
        if (!rive) return;

        if (isNight) {
            // Switch to Day
            console.log("Switching to Day");
            rive.play("Environment Night to Sun trans");
            setIsNight(false);

            // After transition, continue loop animations
            setTimeout(() => {
                const allAnimations = rive.animationNames;
                const loopAnimations = allAnimations.filter(anim =>
                    !anim.includes("trans") && !anim.includes("transition")
                );
                rive.play(loopAnimations);
            }, 1000);
        } else {
            // Switch to Night
            console.log("Switching to Night");
            rive.play("Environment Sun to Night trans");
            setIsNight(true);

            // After transition, continue loop animations
            setTimeout(() => {
                const allAnimations = rive.animationNames;
                const loopAnimations = allAnimations.filter(anim =>
                    !anim.includes("trans") && !anim.includes("transition")
                );
                rive.play(loopAnimations);
            }, 1000);
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
