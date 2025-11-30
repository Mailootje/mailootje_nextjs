"use client";

import { useEffect, useMemo, useState, cloneElement } from "react";
import { ActivityCalendar, type Activity } from "react-activity-calendar";

type Payload = {
    total: number;
    contributions: Activity[];
};

export default function GitHubActivity({ username }: { username: string }) {
    const [data, setData] = useState<Payload | null>(null);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;

        const load = async () => {
            try {
                const res = await fetch(`/api/github-activity?user=${encodeURIComponent(username)}`, {
                    cache: "no-store",
                });
                if (!res.ok) {
                    const message = await res.text();
                    throw new Error(message || `Request failed (${res.status})`);
                }
                const json = (await res.json()) as Payload;
                if (alive) {
                    setData(json);
                    setErr(null);
                }
            } catch (e) {
                if (alive) setErr("GitHub activity unavailable. Check GITHUB_TOKEN and network.");
            }
        };

        load();
        return () => {
            alive = false;
        };
    }, [username]);

    return (
        <div className="rounded-xl border border-white/10 bg-black/20 p-3 overflow-x-auto">
            <style jsx global>{`
                @keyframes gh-fade-in {
                    from {
                        opacity: 0;
                        transform: translateX(-6px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                .gh-fade-block {
                    opacity: 0;
                    animation: gh-fade-in 0.35s ease forwards;
                }
            `}</style>

            {err && (
                <p className="text-sm text-red-300/80">
                    {err}
                </p>
            )}

            {!err && !data && (
                <ActivityCalendar data={[]} loading />
            )}

            {!err && data && (
                <ActivityCalendar
                    data={data.contributions}
                    blockSize={9}
                    blockMargin={3}
                    fontSize={12}
                    colorScheme="dark"
                    labels={{
                        totalCount: `${data.total} contributions in the last year`,
                    }}
                    theme={{
                        dark: [
                            "rgba(255,255,255,0.06)", // 0 contributions
                            "#2a163f",
                            "#4b1f6e",
                            "#6a2aa1",
                            "#B06EFF", // max contributions
                        ],
                    }}
                    tooltips={{
                        activity: {
                            text: (value) => {
                                if (!value || !value.date) return "No data";
                                const date = new Date(value.date);
                                const day = date.toLocaleDateString(undefined, {
                                    weekday: "long",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                });
                                const count = value.count ?? 0;
                                return `${count} contribution${count === 1 ? "" : "s"} on ${day}`;
                            },
                            hoverRestMs: 0,
                        },
                    }}
                    renderBlock={(block, activity) => {
                        const idx = data.contributions.findIndex((d) => d.date === activity.date);
                        const delay = idx >= 0 ? `${idx * 12}ms` : "0ms";
                        return cloneElement(block, {
                            className: `${block.props.className ?? ""} gh-fade-block`,
                            style: { ...(block.props.style || {}), animationDelay: delay },
                        });
                    }}
                />
            )}
        </div>
    );
}
