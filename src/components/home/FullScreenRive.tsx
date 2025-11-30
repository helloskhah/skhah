"use client";

import { useEffect, useState } from "react";
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { Moon, Sun } from "lucide-react";

type DebugInfo = {
    stateMachines: string[];
    animations: string[];
    inputs: { name: string; valueType: string; value: unknown; hasFire: boolean }[];
};

export function FullScreenRive() {
    // We'll update these once we see the debug output
    const STATE_MACHINE = "Start"; // placeholder - will update from debug
    const NIGHT_INPUT = "isNight"; // placeholder - will update from debug

    const [debug, setDebug] = useState<DebugInfo | null>(null);
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
    const nightInput = useStateMachineInput(rive, STATE_MACHINE, NIGHT_INPUT, false);

    useEffect(() => {
        if (!rive) return;

        // Collect debug info
        const smNames = (rive as any).stateMachineNames ?? [];
        const animNames = (rive as any).animationNames ?? [];

        let inputsRaw: any[] = [];
        if (smNames.length > 0) {
            // Try to get inputs from the first state machine
            const firstSM = smNames[0];
            inputsRaw = rive.stateMachineInputs(firstSM) ?? [];

            console.log("=== RIVE DEBUG INFO ===");
            console.log("State Machines:", smNames);
            console.log("Animations:", animNames);
            console.log(`Inputs for "${firstSM}":`, inputsRaw.map((i: any) => ({
                name: i.name,
                type: typeof i.value,
                value: i.value,
                hasFire: typeof i.fire === "function",
            })));
        }

        setDebug({
            stateMachines: smNames,
            animations: animNames,
            inputs: inputsRaw.map((i: any) => ({
                name: i.name,
                valueType: typeof i.value,
                value: i.value,
                hasFire: typeof i.fire === "function",
            })),
        });

        // Force day mode BEFORE starting playback
        if (nightInput) {
            nightInput.value = false; // day mode
            console.log("Set day mode (isNight = false)");
        }

        // Start playback only after we've set the input
        rive.play();
        console.log("Started Rive playback");
    }, [rive, nightInput]);

    const toggleTheme = () => {
        if (!nightInput) {
            console.warn("Night input not available yet");
            return;
        }

        const newNightValue = !isNight;
        nightInput.value = newNightValue;
        setIsNight(newNightValue);
        console.log(`Toggled to ${newNightValue ? "night" : "day"} mode`);
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

            {/* Debug info overlay */}
            {debug && (
                <pre className="absolute left-4 bottom-4 m-0 p-2 text-[11px] leading-tight bg-black/80 text-white rounded-lg max-w-[380px] overflow-auto max-h-[180px] font-mono">
                    {JSON.stringify(debug, null, 2)}
                </pre>
            )}
        </div>
    );
}
