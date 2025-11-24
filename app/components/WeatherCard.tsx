// /app/components/WeatherCard.tsx
"use client";

import { useEffect, useState } from "react";
import Card from "./Card";

type Weather = {
    temp: number | null;
    feels: number | null;
    humidity: number | null;
    wind: number | null;
    weatherCode: number | null;
    rainProb: number | null;
    time: string | null;
};

function codeToText(code: number | null) {
    if (code == null) return "Unknown";

    // WMO weather codes (common ones)
    if (code === 0) return "Clear";
    if (code === 1 || code === 2) return "Partly Cloudy";
    if (code === 3) return "Cloudy";
    if (code === 45 || code === 48) return "Fog";
    if (code >= 51 && code <= 57) return "Drizzle";
    if (code >= 61 && code <= 67) return "Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Showers";
    if (code >= 95) return "Thunderstorm";

    return "Mixed";
}

export default function WeatherCard() {
    const [w, setW] = useState<Weather | null>(null);
    const [err, setErr] = useState(false);

    useEffect(() => {
        let alive = true;

        const load = async () => {
            try {
                const res = await fetch("/api/weather", { cache: "no-store" });
                if (!res.ok) throw new Error();
                const json = (await res.json()) as Weather;
                if (alive) {
                    setW(json);
                    setErr(false);
                }
            } catch {
                if (alive) setErr(true);
            }
        };

        load();
        const id = setInterval(load, 1000 * 60 * 5); // refresh every 5 min
        return () => {
            alive = false;
            clearInterval(id);
        };
    }, []);

    const text = codeToText(w?.weatherCode ?? null);

    return (
        <Card>
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-widest text-white/50">
                <span className="opacity-70">☁️</span>
                WEATHER
            </div>

            {err && (
                <p className="mt-4 text-sm text-white/60">
                    Weather unavailable
                </p>
            )}

            {!err && !w && (
                <p className="mt-4 text-sm text-white/60">
                    Loading weather…
                </p>
            )}

            {!err && w && (
                <>
                    <div className="mt-4 flex items-start justify-between">
                        <div>
                            <p className="text-4xl font-semibold">
                                {w.temp != null ? `${Math.round(w.temp)}°` : "n/a"}
                            </p>
                            <p className="text-sm text-white/60">{text}</p>
                        </div>

                        <div className="text-right text-sm text-white/60">
                            <p>{text}</p>
                            <p className="text-xs">
                                Feels like{" "}
                                {w.feels != null ? `${Math.round(w.feels)}°` : "n/a"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                        <MiniStat
                            label="Wind"
                            value={w.wind != null ? `${Math.round(w.wind)} km/h` : "n/a"}
                        />
                        <MiniStat
                            label="Humidity"
                            value={w.humidity != null ? `${Math.round(w.humidity)}%` : "n/a"}
                        />
                        <MiniStat
                            label="Rain"
                            value={w.rainProb != null ? `${Math.round(w.rainProb)}%` : "n/a"}
                        />
                    </div>

                    {w.time && (
                        <p className="mt-3 text-[10px] text-white/40">
                            Updated {new Date(w.time).toLocaleString()}
                        </p>
                    )}
                </>
            )}
        </Card>
    );
}

function MiniStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/80">
            <div className="text-xs text-white/60">{label}</div>
            <div className="text-sm">{value}</div>
        </div>
    );
}
