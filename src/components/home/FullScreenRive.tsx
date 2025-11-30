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
            // Switch to Day
            rive.play("Environment Night to Sun trans");
            setIsNight(false);
        } else {
            // Switch to Night
            rive.play("Environment Sun to Night trans");
            setIsNight(true);
        }
    };

    const [showList, setShowList] = useState(false);

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

            {/* Temporary Debug: List All Animations */}
            <button
                onClick={() => setShowList(!showList)}
                className="absolute bottom-6 left-6 z-50 px-4 py-2 bg-black/50 text-white text-xs rounded hover:bg-black/70"
            >
                {showList ? "Hide List" : "Show All Animations"}
            </button>

            {showList && rive && (
                <div className="absolute top-20 left-6 bottom-20 w-80 bg-black/90 text-white p-4 rounded overflow-auto z-50 border border-white/20">
                    <h3 className="font-bold mb-2 text-yellow-400">All Animations Found:</h3>
                    <textarea
                        readOnly
                        className="w-full h-64 bg-gray-900 text-xs p-2 rounded mb-2"
                        value={rive.animationNames.join("\n")}
                    />
                    <h3 className="font-bold mb-2 text-blue-400">State Machines:</h3>
                    <textarea
                        readOnly
                        className="w-full h-32 bg-gray-900 text-xs p-2 rounded"
                        value={rive.stateMachineNames.join("\n")}
                    />
                    <p className="text-xs text-gray-400 mt-2">Copy these lists and send them to the developer!</p>
                </div>
            )}
        </div>
    );
}
