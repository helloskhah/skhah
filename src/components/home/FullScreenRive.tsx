"use client";

import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

export function FullScreenRive() {
    const { RiveComponent } = useRive({
        src: "/nature.riv",
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
        autoplay: true,
    });

    return (
        <div className="fixed inset-0 w-full h-full z-0">
            <RiveComponent className="w-full h-full" />
        </div>
    );
}
