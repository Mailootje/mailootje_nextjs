// /app/components/SpotifyCard.tsx
"use client";

import { useEffect, useState } from "react";
import Card from "./Card";

type SpotifyData = {
    isPlaying: boolean;
    title?: string;
    artist?: string;
    albumArt?: string;
    url?: string;
    progressMs?: number;
    durationMs?: number;
    recent: {
        title: string;
        artist: string;
        albumArt?: string;
        url?: string;
    }[];
};

const fmtTime = (ms?: number) => {
    if (!ms) return "0:00";
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function SpotifyCard() {
    const [data, setData] = useState<SpotifyData | null>(null);
    const [err, setErr] = useState(false);

    useEffect(() => {
        let alive = true;

        const load = async () => {
            try {
                const res = await fetch("/api/spotify", { cache: "no-store" });
                if (!res.ok) throw new Error();
                const json = (await res.json()) as SpotifyData;
                if (alive) {
                    setData(json);
                    setErr(false);
                }
            } catch {
                if (alive) setErr(true);
            }
        };

        load();
        const id = setInterval(load, 10000); // update every 10s
        return () => {
            alive = false;
            clearInterval(id);
        };
    }, []);

    const progress =
        data?.isPlaying && data.durationMs
            ? Math.min(100, ((data.progressMs ?? 0) / data.durationMs) * 100)
            : 0;

    return (
        <Card>
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-widest text-white/50">
                <span className="text-green-400">●</span>
                SPOTIFY
            </div>

            {err && (
                <p className="mt-4 text-sm text-white/60">Spotify unavailable</p>
            )}

            {!err && !data && (
                <p className="mt-4 text-sm text-white/60">Loading Spotify…</p>
            )}

            {!err && data && (
                <>
                    <p className="mt-2 text-xs text-white/60">
                        {data.isPlaying ? "Listening to" : "Nothing playing"}
                    </p>

                    {/* Now playing block */}
                    <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 flex gap-3">
                        {data.albumArt ? (
                            <img
                                src={data.albumArt}
                                className="h-14 w-14 rounded-lg border border-white/10"
                                alt=""
                            />
                        ) : (
                            <div className="h-14 w-14 rounded-lg bg-black/30 border border-white/10" />
                        )}

                        <div className="flex-1 min-w-0">
                            <a
                                href={data.url}
                                target="_blank"
                                className="block truncate text-white/90 hover:text-white"
                            >
                                {data.isPlaying ? data.title : "nothing playing"}
                            </a>
                            <p className="truncate text-sm text-white/60">
                                {data.isPlaying ? data.artist : "probably sleeping zzz"}
                            </p>

                            {data.isPlaying && (
                                <>
                                    <div className="mt-2 h-2 w-full rounded-full bg-black/40">
                                        <div
                                            className="h-2 rounded-full bg-[#B06EFF] shadow-[0_0_10px_rgba(176,110,255,0.6)] transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>

                                    <div className="mt-1 flex justify-between text-[10px] text-white/40">
                                        <span>{fmtTime(data.progressMs)}</span>
                                        <span>{fmtTime(data.durationMs)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Recently played */}
                    <div className="mt-4 space-y-2 text-sm text-white/70">
                        <p className="text-[10px] font-semibold tracking-widest text-white/50">
                            RECENTLY PLAYED
                        </p>

                        {data.recent.length === 0 && (
                            <p className="text-white/50 text-sm">no recent tracks</p>
                        )}

                        {data.recent.map((t, i) => (
                            <a
                                key={i}
                                href={t.url}
                                target="_blank"
                                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 hover:shadow-[0_0_10px_rgba(176,110,255,0.25)] transition"
                            >
                                {t.albumArt ? (
                                    <img
                                        src={t.albumArt}
                                        className="h-8 w-8 rounded border border-white/10"
                                        alt=""
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded bg-black/30 border border-white/10" />
                                )}

                                <div className="min-w-0">
                                    <p className="truncate text-white/85">{t.title}</p>
                                    <p className="truncate text-xs text-white/50">{t.artist}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </>
            )}
        </Card>
    );
}
