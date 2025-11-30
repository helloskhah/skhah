"use client";

import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { useState } from "react";
import { Play, Pause } from "lucide-react";

export function RiveAnimation() {
    const [isPlaying, setIsPlaying] = useState(true);

    const { rive, RiveComponent } = useRive({
        // Using a public community file as a placeholder. 
        // You can replace this src with your own .riv file in the public folder.
        src: "https://cdn.rive.app/animations/vehicles.riv",
        stateMachines: "bumpy",
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
        autoplay: true,
    });

    const togglePlayback = () => {
        if (rive) {
            if (isPlaying) {
                rive.pause();
            } else {
                rive.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="w-full h-[300px] md:h-[500px] bg-secondary/20 rounded-lg overflow-hidden relative group">
            <RiveComponent className="w-full h-full" />

            {/* React Component Overlay */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                    onClick={togglePlayback}
                    className="bg-black/50 hover:bg-primary text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300"
                    aria-label={isPlaying ? "Pause Animation" : "Play Animation"}
                >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <div className="text-xs text-gray-500 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                    Powered by Rive
                </div>
            </div>
        </div>
    );
}
