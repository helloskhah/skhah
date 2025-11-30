"use client";

import { useEffect, useState } from "react";
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { Moon, Sun } from "lucide-react";

export function FullScreenRive() {
    // Exact values from debug output
    const STATE_MACHINE = "All";
    const NIGHT_INPUT = "on/off"; // false = day, true = night

    const [isNight, setIsNight] = useState(false);

    const { rive, RiveComponent } = useRive(
        {
            src: "/nature.riv",
            stateMachines: STATE_MACHINE,
            autoplay: false, // CRITICAL: prevent auto-play before setting inputs
            layout: new Layout({
                fit: Fit.Cover,
                alignment: Alignment.Center,
            }),
        }
    );

    // Get the day/night input (with initial value = false for day mode)
    const onOffInput = useStateMachineInput(rive, STATE_MACHINE, NIGHT_INPUT, false);

    useEffect(() => {
        if (!rive || !onOffInput) return;

        // Force DAY mode BEFORE starting playback
        onOffInput.value = false;
        console.log("Set day mode (on/off = false)");

        // Start the state machine
        rive.play();

        // ALSO play all the loop animations (sheep, clouds, etc.)
        const allAnimations = rive.animationNames;
        console.log("Available animations:", allAnimations);

        // Play all animations to ensure continuous movement
        if (allAnimations && allAnimations.length > 0) {
            rive.play(allAnimations);
            console.log("Playing all animations:", allAnimations);
        }

        console.log("Started Rive playback with 'All' state machine");
    }, [rive, onOffInput]);

    const toggleTheme = () => {
        if (!onOffInput) {
            console.warn("on/off input not available yet");
            return;
        }

        // Robust toggle - handles both boolean value and fire() trigger
        if (typeof (onOffInput as any).value === "boolean") {
            const newNightValue = !isNight;
            onOffInput.value = newNightValue;
            setIsNight(newNightValue);
            console.log(`Toggled to ${newNightValue ? "night" : "day"} mode`);
        } else if (typeof (onOffInput as any).fire === "function") {
            (onOffInput as any).fire();
            setIsNight(!isNight);
            console.log("Fired toggle");
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
