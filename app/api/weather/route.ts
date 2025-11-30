// /app/api/weather/route.ts

export async function GET() {
    const lat = process.env.WEATHER_LAT || "51.9851";
    const lon = process.env.WEATHER_LON || "5.8987";

    // Open-Meteo current + hourly
    const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,apparent_temperature` +
        `&hourly=precipitation_probability` +
        `&timezone=auto`;

    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
            return new Response("Weather upstream error", { status: 502 });
        }

        const data = await res.json();

        const current = data.current;
        const hourly = data.hourly;

        let rainProbNow = null;
        const currentTime = current?.time ?? null;

        if (
            currentTime &&
            Array.isArray(hourly?.time) &&
            Array.isArray(hourly?.precipitation_probability)
        ) {
            const idx = hourly.time.indexOf(currentTime);
            if (idx !== -1) {
                rainProbNow = hourly.precipitation_probability[idx] ?? null;
            }
        }

        if (rainProbNow == null) {
            rainProbNow = hourly?.precipitation_probability?.[0] ?? null;
        }

        return Response.json({
            temp: current?.temperature_2m ?? null,
            feels: current?.apparent_temperature ?? null,
            humidity: current?.relative_humidity_2m ?? null,
            wind: current?.wind_speed_10m ?? null,
            weatherCode: current?.weather_code ?? null,
            rainProb: rainProbNow,
            time: current?.time ?? null,
        });
    } catch {
        return new Response("Failed to load weather", { status: 500 });
    }
}
