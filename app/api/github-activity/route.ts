// /app/api/github-activity/route.ts
import { NextRequest } from "next/server";

const GITHUB_API = "https://api.github.com/graphql";
const DEFAULT_USER = process.env.GITHUB_USER || "Mailootje";

type ContributionDay = {
    date: string;
    contributionCount: number;
};

type GraphQLResponse = {
    data?: {
        user?: {
            contributionsCollection?: {
                contributionCalendar?: {
                    totalContributions: number;
                    weeks: { contributionDays: ContributionDay[] }[];
                };
            };
        };
    };
    errors?: { message: string }[];
};

function mapLevel(count: number, max: number) {
    if (count <= 0 || max <= 0) return 0;
    // map count proportionally into 1-4, keep 0 for no activity
    const ratio = count / max;
    return Math.min(4, Math.max(1, Math.ceil(ratio * 4)));
}

export async function GET(req: NextRequest) {
    const token = process.env.GITHUB_TOKEN;
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("user") || DEFAULT_USER;

    if (!token) {
        return Response.json(
            { error: "Missing GITHUB_TOKEN env var. Add a classic token with repo + read:user." },
            { status: 500 },
        );
    }

    const now = new Date();
    const from = new Date(now);
    from.setUTCDate(from.getUTCDate() - 365);

    const query = `
      query($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) {
          contributionsCollection(
            from: $from
            to: $to
          ) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    try {
        const res = await fetch(GITHUB_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                query,
                variables: {
                    login: username,
                    from: from.toISOString(),
                    to: now.toISOString(),
                },
            }),
            cache: "no-store",
        });

        const json = (await res.json()) as GraphQLResponse;

        if (!res.ok || json.errors) {
            const message = json.errors?.map((e) => e.message).join("; ") || "GitHub fetch failed";
            return Response.json({ error: message }, { status: 502 });
        }

        const weeks = json.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];
        const total =
            json.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions ?? 0;

        const days: ContributionDay[] = weeks.flatMap((w) => w.contributionDays ?? []);
        const max = days.reduce((m, d) => Math.max(m, d.contributionCount ?? 0), 0);

        const contributions = days.map((d) => ({
            date: d.date,
            count: d.contributionCount ?? 0,
            level: mapLevel(d.contributionCount ?? 0, max),
        }));

        return Response.json({ total, contributions });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load contributions";
        return Response.json({ error: message }, { status: 500 });
    }
}
