"use client";

import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

export function FullScreenRive() {
    const { RiveComponent, rive } = useRive({
        src: "/nature.riv",
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
        autoplay: true,
        onLoad: () => {
            console.log("Rive file loaded!");
        },
    });

    // Log available animations and state machines when rive instance is ready
    if (rive) {
        console.log("Animations:", rive.animationNames);
        console.log("State Machines:", rive.stateMachineNames);

        // Try to play the first state machine if found and not playing
        if (rive.stateMachineNames.length > 0 && !rive.isPlaying) {
            rive.play(rive.stateMachineNames[0]);
        } else if (rive.animationNames.length > 0 && !rive.isPlaying) {
            rive.play(rive.animationNames[0]);
        }
    }

    return (
        <div className="fixed inset-0 w-full h-full z-0">
            <RiveComponent className="w-full h-full" />
        </div>
    );
}
