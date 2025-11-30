
"use client";

import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { useState, useEffect } from "react";

export function FullScreenRive() {
    const [currentArtboard, setCurrentArtboard] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<{
        artboards: string[];
        animations: string[];
        stateMachines: string[];
        inputs: any[];
    }>({ artboards: [], animations: [], stateMachines: [], inputs: [] });

    const { RiveComponent, rive } = useRive({
        src: "/nature.riv",
        artboard: currentArtboard || undefined,
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
        autoplay: true,
        onLoad: () => {
            console.log("Rive loaded");
        },
    });

    useEffect(() => {
        if (rive) {
            // Wait a tick to ensure Rive is fully ready
            setTimeout(() => {
                // Try to get artboard names if available on the instance or source
                // Note: The react-canvas wrapper might not expose all artboards easily without loading the file separately.
                // We will list what we can see from the current instance.

                const animations = rive.animationNames;
                const stateMachines = rive.stateMachineNames;
                const inputs = stateMachines.length > 0 ? rive.stateMachineInputs(stateMachines[0]) : [];

                setDebugInfo(prev => ({
                    ...prev,
                    animations,
                    stateMachines,
                    inputs: inputs.map(i => ({ name: i.name, type: i.type, value: i.value })),
                }));

                // Auto-play something
                if (stateMachines.length > 0 && !rive.isPlaying) {
                    rive.play(stateMachines[0]);
                } else if (animations.length > 0 && !rive.isPlaying) {
                    rive.play(animations[0]);
                }
            }, 100);
        }
    }, [rive]);

    return (
        <div className="fixed inset-0 w-full h-full z-0 bg-black">
            <RiveComponent className="w-full h-full" />

            {/* Enhanced Debug Overlay */}
            <div className="absolute top-4 left-4 bg-black/90 text-white p-4 rounded-lg max-w-md text-xs font-mono overflow-auto max-h-[90vh] z-50 border border-white/20 shadow-xl">
                <h3 className="font-bold text-lg mb-2 text-primary">Rive Inspector</h3>

                <div className="mb-4 border-b border-gray-700 pb-2">
                    <p className="text-gray-400 mb-1">
                        (Artboard switching temporarily disabled to fix build)
                    </p>
                </div>

                <div className="mb-4">
                    <strong className="text-blue-400 block mb-1">State Machines:</strong>
                    <div className="flex flex-wrap gap-2">
                        {debugInfo.stateMachines.length > 0 ? (
                            debugInfo.stateMachines.map(sm => (
                                <button
                                    key={sm}
                                    onClick={() => rive?.play(sm)}
                                    className="bg-blue-900/50 border border-blue-600 hover:bg-blue-800 px-2 py-1 rounded"
                                >
                                    Play {sm}
                                </button>
                            ))
                        ) : <span className="text-gray-500 italic">None on this artboard</span>}
                    </div>
                </div>

                <div className="mb-4">
                    <strong className="text-green-400 block mb-1">Animations:</strong>
                    <div className="flex flex-wrap gap-2">
                        {debugInfo.animations.length > 0 ? (
                            debugInfo.animations.map(anim => (
                                <button
                                    key={anim}
                                    onClick={() => rive?.play(anim)}
                                    className="bg-green-900/50 border border-green-600 hover:bg-green-800 px-2 py-1 rounded"
                                >
                                    Play {anim}
                                </button>
                            ))
                        ) : <span className="text-gray-500 italic">None on this artboard</span>}
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

