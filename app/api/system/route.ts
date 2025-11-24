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
            return Response.json({ ...data, source: server });
        } catch (e) {
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
            net: net?.[0]
                ? {
                    rx_sec: net[0].rx_sec ?? null,
                    tx_sec: net[0].tx_sec ?? null,
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
        return new Response("Failed to read local system stats", { status: 500 });
    }
}
