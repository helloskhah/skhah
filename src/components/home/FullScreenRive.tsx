"use client";

import { useEffect, useState } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { Moon, Sun } from "lucide-react";

export function FullScreenRive() {
    const [isNight, setIsNight] = useState(false);

    const { rive, RiveComponent } = useRive({
        src: "/nature.riv",
        autoplay: false, // We control start precisely
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
    });

    useEffect(() => {
        if (!rive) return;

        const SM = "All"; // State machine for day/night control
        const INPUT = "on/off"; // Boolean input
        const DAY_VALUE = false; // false = day mode

        // Get all animations - we need at least one looping animation
        const animNames = (rive as any).animationNames ?? [];
        console.log("Available animations:", animNames);
        console.log("Available state machines:", (rive as any).stateMachineNames);

        // Pick looping animations - prefer "All" or use all available animations
        const LOOP_ANIMS = animNames.length > 0 ? animNames : [];

        // IMPORTANT: instantiate BOTH state machine AND animations via reset()
        rive.reset({
            stateMachines: SM,
            animations: LOOP_ANIMS, // All looping animations
            autoplay: false,
        });

        // Set day mode BEFORE playing
        const input = rive.stateMachineInputs(SM)?.find((i: any) => i.name === INPUT);
        if (input && "value" in input) {
            input.value = DAY_VALUE;
            console.log(`Set day mode (${INPUT} = ${DAY_VALUE})`);
        }

        // Start: play both state machine and all animations
        const toPlay = [SM, ...LOOP_ANIMS];
        rive.play(toPlay);
        console.log("Playing:", toPlay);
    }, [rive]);

    const toggleTheme = () => {
        if (!rive) return;

        const SM = "All";
        const INPUT = "on/off";

        // Get the input and toggle it
        const input = rive.stateMachineInputs(SM)?.find((i: any) => i.name === INPUT);
        if (input && "value" in input) {
            const newValue = !isNight;
            input.value = newValue;
            setIsNight(newValue);
            console.log(`Toggled to ${newValue ? "night" : "day"} mode`);
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
