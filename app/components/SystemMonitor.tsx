// /app/components/SystemMonitor.tsx
"use client";

import { useEffect, useState } from "react";

type Stats = {
    host: string;
    platform: string;
    source?: string;
    cpu: { model: string; load: number | null; cores: Array<number | null> };
    mem: { used: number | null; total: number | null; percent: number | null };
    disk: null | {
        used: number | null;
        size: number | null;
        percent: number | null;
        mount: string;
    };
    net: null | { rx_sec: number | null; tx_sec: number | null };
    procs: {
        all: number | null;
        running: number | null;
        blocked: number | null;
        top: { pid: number; name: string; cpu: number | null; mem: number | null }[];
    };
    time: number;
};

// ✔ Nimbus hosts the website
// ✔ All stats come from remote agents
const SERVERS = ["PC", "Nebula", "Nimbus", "Zenith"] as const;
type ServerKey = (typeof SERVERS)[number];

// null-safe byte formatter
const fmtBytes = (n?: number | null) => {
    if (n == null || Number.isNaN(n)) return "n/a";
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    let num = n;
    while (num >= 1024 && i < units.length - 1) {
        num /= 1024;
        i++;
    }
    return `${num.toFixed(1)} ${units[i]}`;
};

const fmtPct = (n?: number | null) =>
    n == null || Number.isNaN(n) ? "n/a" : `${n.toFixed(1)}%`;

export default function SystemMonitor() {
    const [active, setActive] = useState<ServerKey>("Nebula"); // default to Nimbus
    const [stats, setStats] = useState<Stats | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;

        const load = async () => {
            try {
                const res = await fetch(`/api/system?server=${active}`, {
                    cache: "no-store",
                });

                if (!res.ok) throw new Error("API Error");
                const json = (await res.json()) as Stats;

                if (alive) {
                    setStats(json);
                    setErr(null);
                    setLoading(false);
                }
            } catch {
                if (alive) {
                    setErr(`Failed to reach ${active}`);
                    setLoading(false);
                }
            }
        };

        setLoading(true);
        load();
        const id = setInterval(load, 2000);

        return () => {
            alive = false;
            clearInterval(id);
        };
    }, [active]);

    return (
        <div className="space-y-4">
            {/* Server selection tabs */}
            <div className="flex flex-wrap gap-2 text-xs">
                {SERVERS.map((s) => (
                    <button
                        key={s}
                        onClick={() => setActive(s)}
                        className={`rounded-lg px-2 py-1 border border-white/10 transition
              ${
                            active === s
                                ? "bg-white/10 text-white shadow-[0_0_10px_rgba(176,110,255,0.35)]"
                                : "bg-white/5 text-white/60 hover:text-white"
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {loading && <div className="text-sm text-white/60">Loading stats…</div>}

            {!loading && err && <div className="text-sm text-white/60">{err}</div>}

            {!loading && !err && stats && (
                <>
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-white">{stats.host}</p>
                            <p className="text-xs text-white/50">{stats.platform}</p>
                        </div>

                        <div className="text-xs text-white/50 flex items-center gap-2">
                            <span className="capitalize">{active}</span>
                            <span className="inline-block h-2 w-2 rounded-full bg-[#B06EFF] shadow-[0_0_8px_rgba(176,110,255,0.8)]" />
                        </div>
                    </div>

                    {/* CPU / MEM / DISK */}
                    <div className="grid gap-3 md:grid-cols-3">
                        <Panel
                            title="CPU"
                            value={fmtPct(stats.cpu.load)}
                            sub={stats.cpu.model}
                            bar={stats.cpu.load ?? 0}
                        />
                        <Panel
                            title="MEM"
                            value={fmtPct(stats.mem.percent)}
                            sub={`${fmtBytes(stats.mem.used)} / ${fmtBytes(stats.mem.total)}`}
                            bar={stats.mem.percent ?? 0}
                        />
                        <Panel
                            title="DISK"
                            value={fmtPct(stats.disk?.percent)}
                            sub={
                                stats.disk
                                    ? `${fmtBytes(stats.disk.used)} / ${fmtBytes(
                                        stats.disk.size
                                    )} (${stats.disk.mount})`
                                    : "no disk"
                            }
                            bar={stats.disk?.percent ?? 0}
                        />
                    </div>

                    {/* Per-core bars */}
                    {stats.cpu.cores?.length > 0 && (
                        <div>
                            <p className="mb-2 text-[10px] font-semibold tracking-widest text-white/50">
                                CORES
                            </p>
                            <div className="grid grid-cols-8 gap-1">
                                {stats.cpu.cores.map((c, i) => (
                                    <div
                                        key={i}
                                        className="h-10 rounded-md bg-black/40 border border-white/10 flex items-end"
                                        title={`Core ${i}: ${fmtPct(c)}`}
                                    >
                                        <div
                                            className="w-full rounded-md bg-[#B06EFF] shadow-[0_0_8px_rgba(176,110,255,0.6)] transition-all"
                                            style={{
                                                height: `${Math.min(100, Math.max(0, c ?? 0))}%`,
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* NET */}
                    <div className="grid gap-3 md:grid-cols-2">
                        <Panel
                            title="NET RX"
                            value={
                                stats.net?.rx_sec != null
                                    ? `${fmtBytes(stats.net.rx_sec)}/s`
                                    : "n/a"
                            }
                            bar={0}
                        />
                        <Panel
                            title="NET TX"
                            value={
                                stats.net?.tx_sec != null
                                    ? `${fmtBytes(stats.net.tx_sec)}/s`
                                    : "n/a"
                            }
                            bar={0}
                        />
                    </div>

                    {/* Processes */}
                    <div>
                        <p className="mb-2 text-[10px] font-semibold tracking-widest text-white/50">
                            TOP PROCESSES
                        </p>

                        <div className="space-y-2">
                            {stats.procs.top.map((p) => (
                                <div
                                    key={p.pid}
                                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs"
                                >
                                    <span className="truncate text-white/80">{p.name}</span>
                                    <span className="text-white/60">
                    CPU {fmtPct(p.cpu)} • MEM {fmtPct(p.mem)}
                  </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-2 text-xs text-white/50">
                            {(stats.procs.all ?? 0)} processes •{" "}
                            {(stats.procs.running ?? 0)} running •{" "}
                            {(stats.procs.blocked ?? 0)} blocked
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function Panel({
                   title,
                   value,
                   sub,
                   bar,
               }: {
    title: string;
    value: string;
    sub?: string;
    bar: number;
}) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold tracking-widest text-white/50">
                    {title}
                </p>
                <p className="text-sm font-semibold text-white">{value}</p>
            </div>

            {sub && <p className="mt-1 text-xs text-white/50 truncate">{sub}</p>}

            <div className="mt-2 h-2 w-full rounded-full bg-black/40">
                <div
                    className="h-2 rounded-full bg-[#B06EFF] shadow-[0_0_10px_rgba(176,110,255,0.6)] transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, bar))}%` }}
                />
            </div>
        </div>
    );
}
