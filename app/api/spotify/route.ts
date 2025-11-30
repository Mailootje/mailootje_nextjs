// /app/api/spotify/route.ts

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=10";
const CACHE_TTL_MS = 3000;

type SpotifyPayload = {
    isPlaying: boolean;
    isPaused: boolean;
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

let cache: { timestamp: number; value: SpotifyPayload } | null = null;
let inflight: Promise<SpotifyPayload> | null = null;

// refresh access token using refresh token
async function getAccessToken() {
    const client_id = process.env.SPOTIFY_CLIENT_ID!;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
    const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN!;

    const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

    const res = await fetch(TOKEN_URL, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${basic}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token,
        }),
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to refresh Spotify token");
    return res.json() as Promise<{ access_token: string }>;
}

async function fetchSpotifyData(): Promise<SpotifyPayload> {
    const { access_token } = await getAccessToken();

    // currently playing
    const nowRes = await fetch(NOW_PLAYING_URL, {
        headers: { Authorization: `Bearer ${access_token}` },
        cache: "no-store",
    });

    // Spotify returns 204 if nothing is playing
    let nowPlaying: any = null;
    if (nowRes.status !== 204 && nowRes.ok) {
        nowPlaying = await nowRes.json();
    }

    // recently played
    const recentRes = await fetch(RECENTLY_PLAYED_URL, {
        headers: { Authorization: `Bearer ${access_token}` },
        cache: "no-store",
    });

    const recentJson = recentRes.ok ? await recentRes.json() : null;

    const recentTracks =
        recentJson?.items?.map((x: any) => ({
            title: x.track?.name,
            artist: x.track?.artists?.map((a: any) => a.name).join(", "),
            albumArt: x.track?.album?.images?.[0]?.url,
            url: x.track?.external_urls?.spotify,
        })) ?? [];

    if (!nowPlaying?.item) {
        return {
            isPlaying: false,
            isPaused: false,
            recent: recentTracks,
        };
    }

    const item = nowPlaying.item;
    const isPlaying = Boolean(nowPlaying?.is_playing);
    const isPaused = Boolean(nowPlaying?.item && nowPlaying?.is_playing === false);

    return {
        isPlaying,
        isPaused,
        title: item.name,
        artist: item.artists?.map((a: any) => a.name).join(", "),
        albumArt: item.album?.images?.[0]?.url,
        url: item.external_urls?.spotify,
        progressMs: nowPlaying.progress_ms,
        durationMs: item.duration_ms,
        recent: recentTracks,
    };
}

async function getSpotifyData(): Promise<SpotifyPayload> {
    const now = Date.now();
    if (cache && now - cache.timestamp < CACHE_TTL_MS) {
        return cache.value;
    }
    if (inflight) {
        return inflight;
    }

    inflight = fetchSpotifyData()
        .then((data) => {
            cache = { timestamp: Date.now(), value: data };
            inflight = null;
            return data;
        })
        .catch((err) => {
            inflight = null;
            throw err;
        });

    return inflight;
}

export async function GET() {
    try {
        const data = await getSpotifyData();
        return Response.json(data);
    } catch {
        return new Response("Spotify error", { status: 500 });
    }
}
