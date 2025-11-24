// app/components/HardwarePopup.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type ServerKey = "Nebula" | "Nimbus" | "Zenith";

type HardwareInfo = {
    title: string;
    subtitle: string;
    specs: Array<{ label: string; value: string }>;
    notes?: string[];
};

export default function HardwarePopup() {
    const [open, setOpen] = useState<ServerKey | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const DATA = useMemo<Record<ServerKey, HardwareInfo>>(
        () => ({
            Nebula: {
                title: "Nebula",
                subtitle: "HPE DL360 Gen9",
                specs: [
                    { label: "CPU", value: "2× Xeon E5-2699 v4" },
                    { label: "RAM", value: "24×64 GB (≈1.5 TB)" },
                    { label: "GPU", value: "Intel Arc Pro A60" },
                    { label: "NVMe Riser", value: "PCIe 3.0 x16 (4 TB NVMe)" },
                    { label: "Role", value: "High-performance workloads / compute" },
                ],
                notes: ["Main heavy compute node", "Fast NVMe scratch + big RAM pool"],
            },

            Nimbus: {
                title: "Nimbus",
                subtitle: "HPE DL360 Gen9",
                specs: [
                    { label: "CPU", value: "2× Xeon E5-2696 v4" },
                    { label: "RAM", value: "384 GB" },
                    { label: "Storage 1", value: "4×900 GB SAS (RAID 6)" },
                    { label: "Storage 2", value: "3×1.2 TB SAS (RAID 5)" },
                    { label: "Storage 3", value: "1×1.8 TB SAS (single)" },
                    { label: "Role", value: "Hosts site + services" },
                ],
            },

            Zenith: {
                title: "Zenith",
                subtitle: "Custom 4U Server",
                specs: [
                    { label: "CPU", value: "Intel i9-14900K" },
                    { label: "RAM", value: "64 GB" },
                    { label: "GPU", value: "GTX 1080 Ti" },
                    { label: "Storage", value: "24×24 TB WD Red drives" },
                    { label: "Role", value: "Mass storage + media/services" },
                ],
                notes: ["Big storage beast", "Primary archive/array node"],
            },
        }),
        []
    );

    const active = open ? DATA[open] : null;

    return (
        <>
            {/* Clickable list inside card */}
            <ul className="space-y-2 text-white/80">
                {(["Nebula", "Nimbus", "Zenith"] as ServerKey[]).map((key) => (
                    <li key={key}>
                        <button
                            onClick={() => setOpen(key)}
                            className="
                w-full text-left
                rounded-lg border border-white/10 bg-white/5
                px-3 py-2
                hover:text-white hover:shadow-[0_0_12px_rgba(176,110,255,0.25)]
                transition
              "
                        >
                            {key}{" "}
                            <span className="text-white/50 text-xs">
                ({DATA[key].subtitle})
              </span>
                        </button>
                    </li>
                ))}
            </ul>

            {/* Portal modal to body (so it can't be constrained by cards) */}
            {mounted && active
                ? createPortal(
                    <div
                        className="fixed inset-0 z-[9999] grid place-items-center px-4 sm:px-8"
                        onClick={() => setOpen(null)}
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                        {/* Panel (big, centered, NOT fullscreen) */}
                        <div
                            className="
                  relative w-full max-w-2xl
                  rounded-2xl border border-white/10
                  bg-[rgba(18,14,26,0.98)]
                  shadow-[0_20px_80px_rgba(0,0,0,0.7),0_0_45px_rgba(176,110,255,0.25)]
                  p-5 sm:p-7
                  max-h-[85vh] overflow-y-auto
                  transition-all duration-300 ease-[cubic-bezier(.25,.1,.25,1)]
                "
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-white">
                                        {active.title}
                                    </h3>
                                    <p className="text-sm text-white/60">{active.subtitle}</p>
                                </div>

                                <button
                                    onClick={() => setOpen(null)}
                                    className="
                      rounded-lg border border-white/10 bg-white/5
                      px-2.5 py-1.5 text-xs text-white/70
                      hover:text-white hover:shadow-[0_0_12px_rgba(176,110,255,0.35)]
                      transition
                    "
                                >
                                    ✕ Close
                                </button>
                            </div>

                            {/* Specs */}
                            <div className="mt-5 space-y-2.5">
                                {active.specs.map((s) => (
                                    <div
                                        key={s.label}
                                        className="
                        flex items-center justify-between gap-4
                        rounded-xl border border-white/10 bg-white/5
                        px-4 py-3 text-sm
                      "
                                    >
                                        <span className="text-white/60">{s.label}</span>
                                        <span className="text-white text-right">{s.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Notes */}
                            {active.notes?.length ? (
                                <div className="mt-6">
                                    <p className="mb-2 text-[10px] font-semibold tracking-widest text-white/50">
                                        NOTES
                                    </p>
                                    <ul className="list-disc pl-5 text-sm text-white/75 space-y-1.5">
                                        {active.notes.map((n, i) => (
                                            <li key={i}>{n}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}
                        </div>
                    </div>,
                    document.body
                )
                : null}
        </>
    );
}
