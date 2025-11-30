"use client";

import { useEffect, useState } from "react";
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { Moon, Sun } from "lucide-react";

export function FullScreenRive() {
    const SM = "All"; // State machine
    const INPUT = "on/off"; // boolean: false = day

    const [ready, setReady] = useState(false);
    const [isNight, setIsNight] = useState(false);

    const { rive, RiveComponent } = useRive({
        src: "/nature.riv",
        stateMachines: SM,
        autoplay: true, // IMPORTANT: keep render loop alive
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
    });

    // initialValue = false for day mode
    const onOff = useStateMachineInput(rive, SM, INPUT, false);

    useEffect(() => {
        if (!rive || !onOff) return;

        // Force day mode deterministically
        onOff.value = false;
        console.log("Set day mode (on/off = false)");

        // Show only after the input is available and set (prevents night flash)
        setReady(true);
    }, [rive, onOff]);

    const toggle = () => {
        if (!onOff) return;
        const newValue = !isNight;
        onOff.value = newValue;
        setIsNight(newValue);
        console.log(`Toggled to ${newValue ? "night" : "day"} mode`);
    };

    return (
        <div
            className="fixed inset-0 w-full h-full z-0 bg-black"
            style={{ opacity: ready ? 1 : 0 }}
        >
            <RiveComponent className="w-full h-full" />

            {/* Theme Toggle Button */}
            <button
                onClick={toggle}
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
