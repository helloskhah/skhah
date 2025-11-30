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
    });

    // Play all animations when Rive is ready AND force day mode
    useEffect(() => {
        if (rive) {
            const allAnimations = rive.animationNames;
            console.log("All animations:", allAnimations);

            // First, transition from night to day to ensure we start in day mode
            if (allAnimations.includes("Environment Night to Sun trans")) {
                rive.play("Environment Night to Sun trans");

                // After transition completes, play all loop animations
                setTimeout(() => {
                    const loopAnimations = allAnimations.filter(anim =>
                        !anim.includes("trans") && !anim.includes("transition")
                    );
                    if (loopAnimations.length > 0) {
                        rive.play(loopAnimations);
                    }
                }, 1500);
            } else {
                // Fallback: just play all animations
                if (allAnimations && allAnimations.length > 0) {
                    rive.play(allAnimations);
                }
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
