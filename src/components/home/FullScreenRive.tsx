```javascript
"use client";

import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { useEffect } from "react";

export function FullScreenRive() {
  const { RiveComponent, rive } = useRive({
    src: "/nature.riv",
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
    autoplay: true,
    animations: "All", // Play the 'All' animation found in the debugger
  });

  // Redundancy: Ensure 'All' plays when Rive is ready
  useEffect(() => {
    if (rive) {
      rive.play("All");
    }
  }, [rive]);

  return (
    <div className="fixed inset-0 w-full h-full z-0 bg-black">
      <RiveComponent className="w-full h-full" />
    </div>
  );
}
```
