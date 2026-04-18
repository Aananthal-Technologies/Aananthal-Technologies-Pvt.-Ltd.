import createGlobe from "https://cdn.skypack.dev/cobe";

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("globeCanvas");
    if (!canvas) return;

    let phi = 0, isPaused = false;

    const globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio, 2),
        width: 300, height: 300,
        phi: 0, theta: 0.2,
        dark: 0, diffuse: 1.5,
        mapSamples: 16000, mapBrightness: 10,
        baseColor: [1, 1, 1],
        markerColor: [1, 0, 0],
        glowColor: [0.94, 0.93, 0.91],
        markers: [{ location: [13.0340, 77.6600], size: 0.03 }],
        arcs: [], arcWidth: 0, opacity: 1
    });

    function animate() {
        if (!isPaused) phi += 0.003;
        globe.update({ phi, theta: 0.2 });
        requestAnimationFrame(animate);
    }
    animate();

    canvas.addEventListener("pointerdown", () => { isPaused = true; });
    canvas.addEventListener("pointerup", () => { isPaused = false; });
});
