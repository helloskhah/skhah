"use client";

import { useRive, useStateMachineInput, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function FullScreenRive() {
    const [isNight, setIsNight] = useState(false);
    const [debugInfo, setDebugInfo] = useState<string>("");

    const { rive, RiveComponent } = useRive({
        src: "/nature.riv",
        // We'll try to use state machine if it exists
        // stateMachines: "State Machine 1", // We'll detect this dynamically first
        autoplay: true,
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
    });

    // Log state machine info for debugging
    useEffect(() => {
        if (rive) {
            const stateMachines = rive.stateMachineNames;
            const animations = rive.animationNames;

            console.log("=== RIVE DEBUG INFO ===");
            console.log("State Machines:", stateMachines);
            console.log("Animations:", animations);

            if (stateMachines.length > 0) {
                const firstSM = stateMachines[0];
                const inputs = rive.stateMachineInputs(firstSM);
                console.log(`Inputs for "${firstSM}":`, inputs?.map(i => ({
                    name: i.name,
                    type: i.type,
                    value: i.value
                })));

                setDebugInfo(`SM: ${firstSM}, Inputs: ${inputs?.map(i => i.name).join(", ") || "none"}`);
            } else {
                console.log("No state machines found, falling back to animations");
                setDebugInfo("No state machines - using animations");

                // Play all animations if no state machine
                if (animations.length > 0) {
                    rive.play(animations);
                }
            }
        }
    }, [rive]);

    const toggleTheme = () => {
        if (!rive) return;

        const stateMachines = rive.stateMachineNames;

        if (stateMachines.length > 0) {
            // If there's a state machine, we need to use inputs
            // This will be updated once we know the exact input name
            console.log("Toggle via state machine (needs input name)");
            setIsNight(!isNight);
        } else {
            // Fallback to animation transitions
            if (isNight) {
                console.log("Switching to Day");
                rive.play("Environment Night to Sun trans");
                setIsNight(false);
            } else {
                console.log("Switching to Night");
                rive.play("Environment Sun to Night trans");
                setIsNight(true);
            }
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

            {/* Temporary debug info */}
            <div className="absolute bottom-4 left-4 bg-black/80 text-white p-2 text-xs rounded">
                {debugInfo || "Loading..."}
            </div>
        </div>
    );
}
