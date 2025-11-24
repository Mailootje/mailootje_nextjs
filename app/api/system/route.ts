import si from "systeminformation";

const REMOTES: Record<string, string> = process.env.REMOTE_SERVERS
    ? JSON.parse(process.env.REMOTE_SERVERS)
    : {};

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const server = searchParams.get("server") || "local";

    // If requesting a remote server, proxy it
    if (server !== "local") {
        const url = REMOTES[server];
        if (!url) return new Response("Unknown server", { status: 404 });

        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${process.env.STATS_TOKEN}`,
            },
            cache: "no-store",
        });

        if (!res.ok) {
            return new Response("Remote server error", { status: 502 });
        }

        const data = await res.json();
        return Response.json({ ...data, source: server });
    }

    // Otherwise read local stats (same as before)
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
                load: load.currentLoad,
                cores: load.cpus?.map(c => c.load) ?? [],
            },
            mem: {
                used: mem.used,
                total: mem.total,
                percent: (mem.used / mem.total) * 100,
            },
            disk: mainDisk
                ? {
                    used: mainDisk.used,
                    size: mainDisk.size,
                    percent: mainDisk.use,
                    mount: mainDisk.mount,
                }
                : null,
            net: net?.[0]
                ? { rx_sec: net[0].rx_sec, tx_sec: net[0].tx_sec }
                : null,
            procs: {
                all: proc.all,
                running: proc.running,
                blocked: proc.blocked,
                top: proc.list.slice(0, 5).map(p => ({
                    pid: p.pid,
                    name: p.name,
                    cpu: p.cpu,
                    mem: p.mem,
                })),
            },
            time: Date.now(),
            source: "local",
        });
    } catch {
        return new Response("Failed to read system stats", { status: 500 });
    }
}
