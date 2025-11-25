// /app/api/system/route.ts
import si from "systeminformation";

function parseRemoteServers(): Record<string, string> {
    const raw = process.env.REMOTE_SERVERS;
    if (!raw) return {};

    let s = raw.trim();

    // If Coolify wrapped the JSON in quotes, strip them
    if (
        (s.startsWith("'") && s.endsWith("'")) ||
        (s.startsWith('"') && s.endsWith('"'))
    ) {
        s = s.slice(1, -1);
    }

    // If Coolify injected escaped quotes like { \"nebula\": ... }
    s = s.replace(/\\"/g, '"');

    try {
        const parsed = JSON.parse(s);
        if (parsed && typeof parsed === "object") return parsed;
        return {};
    } catch (e) {
        console.error("REMOTE_SERVERS env is invalid JSON:", raw);
        return {}; // never crash build
    }
}

const REMOTES = parseRemoteServers();

function safeNum(v: any): number | null {
    return typeof v === "number" && !Number.isNaN(v) ? v : null;
}

/**
 * Normalize the JSON coming from the stats-agent /metrics endpoint
 * into the simple Stats shape that SystemMonitor.tsx expects.
 */
function normalizeRemoteMetrics(data: any, source: string) {
    const cpuUsage = data?.cpu?.usage ?? {};
    const cpuTemp = data?.cpu?.temp ?? data?.sensors?.cpu ?? data?.sensors?.cpuTemp ?? {};
    const cpuSpeed = data?.cpu?.speed ?? {};

    const memData = data?.mem ?? {};
    const diskData = data?.disk ?? null;
    const netData = data?.net ?? null;
    const procsData = data?.procs ?? {};
    const sensorsData = data?.sensors ?? {};

    const used = safeNum(memData.used);
    const total = safeNum(memData.total);

    let memPercent: number | null = null;
    if (typeof memData.percentUsed === "number" && !Number.isNaN(memData.percentUsed)) {
        memPercent = memData.percentUsed;
    } else if (total && used) {
        memPercent = (used / total) * 100;
    }

    const disk = diskData
        ? {
            used: safeNum(diskData.used),
            size: safeNum(diskData.size),
            percent:
                safeNum(diskData.percent) ??
                safeNum(diskData.use) ??
                null,
            mount: diskData.mount ?? "",
        }
        : null;

    const net = netData
        ? {
            rx_sec: safeNum(netData.rx_sec),
            tx_sec: safeNum(netData.tx_sec),
            iface: netData.iface ?? undefined,
        }
        : null;

    const topProcsArray = Array.isArray(procsData.top) ? procsData.top : [];
    const gpuControllers = Array.isArray(sensorsData.gpus) ? sensorsData.gpus : [];

    return {
        host: data?.host ?? "unknown",
        platform: data?.platform ?? "",
        cpu: {
            model: data?.cpu?.model ?? "Unknown CPU",
            load: safeNum(cpuUsage.total),
            cores: Array.isArray(cpuUsage.perCore)
                ? cpuUsage.perCore.map((c: any) => safeNum(c))
                : [],
            temp: {
                main: safeNum(cpuTemp.main),
                max: safeNum(cpuTemp.max),
                perCore: Array.isArray(cpuTemp.perCore)
                    ? cpuTemp.perCore.map((v: any) => safeNum(v))
                    : [],
            },
            speed: {
                avg: safeNum(cpuSpeed.avg),
                min: safeNum(cpuSpeed.min),
                max: safeNum(cpuSpeed.max),
                perCore: Array.isArray(cpuSpeed.cores)
                    ? cpuSpeed.cores.map((v: any) => safeNum(v))
                    : [],
            },
        },
        mem: {
            used,
            total,
            percent: memPercent,
            free: safeNum(memData.free),
            available: safeNum(memData.available),
            cache: safeNum(memData.cache),
        },
        disk,
        net,
        procs: {
            all: safeNum(procsData.all),
            running: safeNum(procsData.running),
            blocked: safeNum(procsData.blocked),
            top: topProcsArray.slice(0, 5).map((p: any) => ({
                pid: p.pid ?? 0,
                name: p.name ?? "unknown",
                cpu: safeNum(p.cpu),
                mem: safeNum(p.mem),
            })),
        },
        sensors: {
            cpu: {
                main: safeNum(cpuTemp.main),
                max: safeNum(cpuTemp.max),
                perCore: Array.isArray(cpuTemp.perCore)
                    ? cpuTemp.perCore.map((v: any) => safeNum(v))
                    : [],
            },
            gpus: gpuControllers.map((g: any) => ({
                model: g.model ?? "Unknown GPU",
                vendor: g.vendor ?? undefined,
                temperature: safeNum(g.temperatureGpu),
                fanSpeed: safeNum(g.fanSpeed),
            })),
        },
        time: typeof data?.time === "number" ? data.time : Date.now(),
        source,
    };
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const server = searchParams.get("server") || "local";

    // ---- Remote proxy mode ----
    if (server !== "local") {
        const url = REMOTES[server];
        if (!url) {
            return new Response(`Unknown server "${server}"`, { status: 404 });
        }

        try {
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${process.env.STATS_TOKEN || ""}`,
                },
                cache: "no-store",
            });

            if (!res.ok) {
                return new Response(
                    `Remote server "${server}" error: ${res.status}`,
                    { status: 502 }
                );
            }

            const data = await res.json();
            const normalized = normalizeRemoteMetrics(data, server);
            return Response.json(normalized);
        } catch (e) {
            console.error(`Failed fetching remote stats for "${server}":`, e);
            return new Response(`Failed fetching "${server}"`, { status: 502 });
        }
    }

    // ---- Local stats mode (safe fallback) ----
    try {
        const [load, mem, disks, net, proc, os, cpu] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.fsSize(),
            si.networkStats(),
            si.processes(),
            si.osInfo(),
            si.cpu(),
        ]);

        const mainDisk = disks?.[0];
        const mainNet = net?.[0];

        return Response.json({
            host: os.hostname,
            platform: `${os.distro} ${os.release}`,
            cpu: {
                model: cpu.manufacturer + " " + cpu.brand,
                load: load.currentLoad ?? null,
                cores: load.cpus?.map((c) => c.load ?? null) ?? [],
            },
            mem: {
                used: mem.used ?? null,
                total: mem.total ?? null,
                percent:
                    mem.total && mem.used
                        ? (mem.used / mem.total) * 100
                        : null,
            },
            disk: mainDisk
                ? {
                    used: mainDisk.used ?? null,
                    size: mainDisk.size ?? null,
                    percent: mainDisk.use ?? null,
                    mount: mainDisk.mount,
                }
                : null,
            net: mainNet
                ? {
                    rx_sec: mainNet.rx_sec ?? null,
                    tx_sec: mainNet.tx_sec ?? null,
                }
                : null,
            procs: {
                all: proc.all ?? null,
                running: proc.running ?? null,
                blocked: proc.blocked ?? null,
                top: proc.list.slice(0, 5).map((p) => ({
                    pid: p.pid,
                    name: p.name,
                    cpu: p.cpu ?? null,
                    mem: p.mem ?? null,
                })),
            },
            time: Date.now(),
            source: "local",
        });
    } catch (e) {
        console.error("Failed to read local system stats:", e);
        return new Response("Failed to read local system stats", { status: 500 });
    }
}
