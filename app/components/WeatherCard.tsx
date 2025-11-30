// /app/components/WeatherCard.tsx
"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudLightning, CloudRain, Droplets, Sun, Wind } from "lucide-react";
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

function codeToEmoji(code: number | null) {
    if (code == null) return "❔";
    if (code === 0) return "☀️";
    if (code === 1 || code === 2) return "⛅";
    if (code === 3) return "☁️";
    if (code === 45 || code === 48) return "🌫️";
    if (code >= 51 && code <= 67) return "🌧️";
    if (code >= 71 && code <= 82) return "🌨️";
    if (code >= 95) return "⛈️";
    return "🌤️";
}

function codeToIcon(code: number | null) {
    if (code == null) return Cloud;
    if (code === 0) return Sun;
    if (code === 1 || code === 2) return Cloud;
    if (code === 3) return Cloud;
    if (code === 45 || code === 48) return Cloud;
    if (code >= 51 && code <= 67) return CloudRain;
    if (code >= 71 && code <= 82) return CloudRain;
    if (code >= 95) return CloudLightning;
    return Cloud;
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
    const emoji = codeToEmoji(w?.weatherCode ?? null);
    const Icon = codeToIcon(w?.weatherCode ?? null);

    const temp = (value: number | null) =>
        value != null ? `${value.toFixed(1)}°` : "n/a";
    const wind = (value: number | null) =>
        value != null ? `${value.toFixed(1)} km/h` : "n/a";
    const percent = (value: number | null) =>
        value != null ? `${Math.round(value)}%` : "n/a";

    return (
        <Card className="bg-[rgba(18,14,24,0.7)] border-white/5">
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-widest text-white/50">
                <Cloud className="h-4 w-4 text-white/60" />
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
                    <div className="mt-5 flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <p className="text-5xl font-semibold leading-none text-white">
                                {temp(w.temp)}
                            </p>
                        </div>

                        <div className="text-right text-sm text-white/60 flex flex-col gap-2 items-end">
                            <p className="text-white/70 text-base flex items-center gap-2">
                                <Icon className="h-4 w-4 text-white/70" />
                                {text}
                            </p>
                            <p className="text-xs text-white/50">
                                Feels like {temp(w.feels)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
                        <MiniStat
                            label="Wind"
                            icon={<Wind className="h-4 w-4 text-[#5DA2FF]" />}
                            value={wind(w.wind)}
                        />
                        <MiniStat
                            label="Humidity"
                            icon={<Droplets className="h-4 w-4 text-[#5DA2FF]" />}
                            value={percent(w.humidity)}
                        />
                        <MiniStat
                            label="Rain"
                            icon={<CloudRain className="h-4 w-4 text-[#5DA2FF]" />}
                            value={percent(w.rainProb)}
                        />
                    </div>

                    {w.time && (
                        <p className="mt-4 text-[10px] text-white/35">
                            Updated {new Date(w.time).toLocaleString()}
                        </p>
                    )}
                </>
            )}
        </Card>
    );
}

function MiniStat({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon?: React.ReactNode;
}) {
    return (
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-white/80 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] flex flex-col items-center gap-1">
            {icon && <div className="flex items-center justify-center">{icon}</div>}
            <div className="text-sm font-semibold text-white">{value}</div>
            <div className="text-xs text-white/50">{label}</div>
        </div>
    );
}
