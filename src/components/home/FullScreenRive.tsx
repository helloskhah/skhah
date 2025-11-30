"use client";

import { useEffect, useState } from "react";
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { Moon, Sun } from "lucide-react";

export function FullScreenRive() {
    const [isNight, setIsNight] = useState(false);

    const SM = "All"; // State machine for theme control
    const INPUT = "on/off"; // Boolean input (false = day, true = night)
    const LOOP_ANIM = "All"; // Looping animation for continuous movement

    const { rive, RiveComponent } = useRive({
        src: "/nature.riv",
        autoplay: false,
        stateMachines: SM, // Instantiate state machine
        animations: LOOP_ANIM, // Instantiate looping animation
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
    });

    // Get the day/night input
    const onOff = useStateMachineInput(rive, SM, INPUT, false);

    useEffect(() => {
        if (!rive || !onOff) return;

        // Set day mode on first frame
        onOff.value = false;
        console.log("Set day mode (on/off = false)");

        // Play all instantiated animations/state machines (no args = play all)
        rive.play();

        // Optional: ensure rendering is active
        (rive as any).startRendering?.();

        // Debug: confirm what's actually playing
        console.log("=== PLAYBACK STATUS ===");
        console.log("playingAnimationNames:", (rive as any).playingAnimationNames);
        console.log("playingStateMachineNames:", (rive as any).playingStateMachineNames);
        console.log("All animations available:", (rive as any).animationNames);
    }, [rive, onOff]);

    const toggleTheme = () => {
        if (!onOff) {
            console.warn("on/off input not available yet");
            return;
        }

        const newValue = !isNight;
        onOff.value = newValue;
        setIsNight(newValue);
        console.log(`Toggled to ${newValue ? "night" : "day"} mode`);
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
