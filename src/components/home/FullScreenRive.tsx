"use client";

import { useRive, Layout, Fit, Alignment, useStateMachineInput } from "@rive-app/react-canvas";
import { useState, useEffect } from "react";

export function FullScreenRive() {
    const [debugInfo, setDebugInfo] = useState<{
        animations: string[];
        stateMachines: string[];
        inputs: any[];
        activeStateMachine: string | null;
    }>({ animations: [], stateMachines: [], inputs: [], activeStateMachine: null });

    const { RiveComponent, rive } = useRive({
        src: "/nature.riv",
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
        autoplay: true, // Let Rive decide the default start
        onLoad: () => {
            console.log("Rive loaded");
        },
    });

    useEffect(() => {
        if (rive) {
            // Wait a tick to ensure Rive is fully ready
            setTimeout(() => {
                const animations = rive.animationNames;
                const stateMachines = rive.stateMachineNames;
                const inputs = stateMachines.length > 0 ? rive.stateMachineInputs(stateMachines[0]) : [];

                setDebugInfo({
                    animations,
                    stateMachines,
                    inputs: inputs.map(i => ({ name: i.name, type: i.type, value: i.value })),
                    activeStateMachine: stateMachines.length > 0 ? stateMachines[0] : null
                });

                // Force play the first state machine if available
                if (stateMachines.length > 0) {
                    if (!rive.isPlaying) {
                        rive.play(stateMachines[0]);
                    }
                } else if (animations.length > 0) {
                    rive.play(animations[0]);
                }
            }, 100);
        }
    }, [rive]);

    return (
        <div className="fixed inset-0 w-full h-full z-0 bg-black">
            <RiveComponent className="w-full h-full" />

            {/* Debug Overlay - Visible to User to diagnose the issue */}
            <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-lg max-w-md text-xs font-mono overflow-auto max-h-[80vh] z-50 border border-white/20">
                <h3 className="font-bold text-lg mb-2 text-primary">Rive Debugger</h3>

                <div className="mb-4">
                    <strong className="text-gray-400">State Machines:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {debugInfo.stateMachines.length > 0 ? (
                            debugInfo.stateMachines.map(sm => (
                                <button
                                    key={sm}
                                    onClick={() => rive?.play(sm)}
                                    className="bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded"
                                >
                                    Play {sm}
                                </button>
                            ))
                        ) : <span className="text-red-400">None found</span>}
                    </div>
                </div>

                <div className="mb-4">
                    <strong className="text-gray-400">Animations:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {debugInfo.animations.length > 0 ? (
                            debugInfo.animations.map(anim => (
                                <button
                                    key={anim}
                                    onClick={() => rive?.play(anim)}
                                    className="bg-green-600 hover:bg-green-500 px-2 py-1 rounded"
                                >
                                    Play {anim}
                                </button>
                            ))
                        ) : <span className="text-red-400">None found</span>}
                    </div>
                </div>

                <div>
                    <strong className="text-gray-400">Inputs (First SM):</strong>
                    <pre className="mt-1 bg-white/10 p-2 rounded">
                        {JSON.stringify(debugInfo.inputs, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
}

