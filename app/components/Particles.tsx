"use client";

import { useEffect } from "react";

export default function Particles() {
    useEffect(() => {
        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (reducedMotion) return;

        const script = document.createElement("script");
        script.src =
            "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
        script.async = true;

        script.onload = () => {
            const w = window as any;
            if (!w.particlesJS) return;

            w.particlesJS("particles-js", {
                particles: {
                    number: { value: 60, density: { enable: true, value_area: 900 } },
                    color: { value: ["#6a2aa1", "#6a2aa1", "#6a2aa1"] },
                    shape: { type: "circle" },
                    opacity: { value: 0.35 },
                    size: { value: 2.5, random: { enable: true, minimumValue: 1.2 } },
                    line_linked: {
                        enable: true,
                        distance: 140,
                        color: "#B06EFF",
                        opacity: 0.35,
                        width: 1,
                    },
                    move: { enable: true, speed: 1.0, out_mode: "out" },
                },
                interactivity: {
                    detect_on: "canvas",
                    events: { onhover: { enable: true, mode: "grab" }, resize: true },
                    modes: { grab: { distance: 160, line_linked: { opacity: 0.5 } } },
                },
                retina_detect: true,
            });
        };

        document.body.appendChild(script);
        return () => script.remove();
    }, []);

    return null;
}
