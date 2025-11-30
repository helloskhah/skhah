"use client";

import { useRive, Layout, Fit, Alignment, RiveFile } from "@rive-app/react-canvas";
import { useState, useEffect } from "react";

export function FullScreenRive() {
    const [currentArtboard, setCurrentArtboard] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<{
        artboards: string[];
        animations: string[];
        stateMachines: string[];
        inputs: any[];
    }>({ artboards: [], animations: [], stateMachines: [], inputs: [] });

    // 1. Load the RiveFile first to inspect contents
    useEffect(() => {
        async function loadFile() {
            try {
                const file = await RiveFile.new({ src: "/nature.riv" });
                await file.init(); // Wait for file to fully load

                const artboardNames = file.artboardNames;
                console.log("Found Artboards:", artboardNames);

                setDebugInfo(prev => ({ ...prev, artboards: artboardNames }));

                // Default to first artboard if not set
                if (!currentArtboard && artboardNames.length > 0) {
                    setCurrentArtboard(artboardNames[0]);
                }
            } catch (e) {
                console.error("Failed to load Rive file:", e);
            }
        }
        loadFile();
    }, []);

    // 2. Use useRive with the specific artboard
    const { RiveComponent, rive } = useRive({
        src: "/nature.riv",
        artboard: currentArtboard || undefined, // Pass selected artboard
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
        autoplay: true,
    });

    // 3. Update debug info when rive instance changes (artboard changed)
    useEffect(() => {
        if (rive) {
            setTimeout(() => {
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
                    <strong className="text-yellow-400 block mb-1">Artboards (Click to Switch):</strong>
                    <div className="flex flex-wrap gap-2">
                        {debugInfo.artboards.length > 0 ? (
                            debugInfo.artboards.map(ab => (
                                <button
                                    key={ab}
                                    onClick={() => setCurrentArtboard(ab)}
                                    className={`px-2 py-1 rounded border ${currentArtboard === ab ? 'bg-yellow-600 border-yellow-400' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`}
                                >
                                    {ab}
                                </button>
                            ))
                        ) : <span className="text-red-400">Loading...</span>}
                    </div>
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
            </div>
        </div>
    );
}
