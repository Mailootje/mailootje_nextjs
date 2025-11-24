// app/page.tsx
import Card from "./components/Card";
import GitHubActivity from "./components/GitHubActivity";
import { Mail, Github, Disc } from "lucide-react";
import LinkGroups from "./components/LinkGroups";
import SystemMonitor from "./components/SystemMonitor";
import WeatherCard from "./components/WeatherCard";
import SpotifyCard from "./components/SpotifyCard";

export default function Home() {
    return (
        <main className="mx-auto max-w-6xl px-3 sm:px-4 py-8 sm:py-10">
            {/* Top bar */}
            <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <a
                    href="/"
                    className="text-2xl font-bold tracking-wide flex items-center gap-2 justify-center sm:justify-start"
                >
          <span className="text-[#B06EFF] drop-shadow-[0_0_12px_rgba(176,110,255,0.7)]">
            Mailootje.com
          </span>
                </a>

                <nav className="flex items-center gap-2 justify-center sm:justify-end">
                    <a
                        href="mailto:info@mailootje.com"
                        className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:shadow-[0_0_12px_rgba(176,110,255,0.35)] transition"
                        aria-label="Email"
                    >
                        <Mail className="h-5 w-5" />
                    </a>
                    <a
                        href="https://github.com/Mailootje"
                        target="_blank"
                        className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:shadow-[0_0_12px_rgba(176,110,255,0.35)] transition"
                        aria-label="GitHub"
                    >
                        <Github className="h-5 w-5" />
                    </a>
                    <a
                        href="https://discord.gg/your-invite"
                        target="_blank"
                        className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:shadow-[0_0_12px_rgba(176,110,255,0.35)] transition"
                        aria-label="Discord"
                    >
                        <Disc className="h-5 w-5" />
                    </a>
                </nav>
            </header>

            {/* Responsive eva-style layout */}
            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* ---------------- LEFT SIDE ---------------- */}
                <div className="md:col-span-2 lg:col-span-2 grid gap-6">
                    {/* PROFILE */}
                    <Card>
                        <div className="flex flex-col sm:flex-row sm:items-start items-center gap-4">
                            <img
                                src="/profile.png"
                                alt="profile"
                                className="h-20 w-20 rounded-full border border-white/10 shadow-[0_0_25px_rgba(176,110,255,0.45)]"
                            />

                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-2xl font-semibold">
                                    I&apos;m <span className="text-[#B06EFF]">Mailo</span>
                                </h1>
                                <p className="text-white/70">
                                    A developer &amp; engineer based in The Netherlands 🇳🇱
                                </p>

                                <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-sm text-white/60">
                                    <span className="text-[#C08CFF]">● Available for work</span>
                                    <a href="mailto:info@mailootje.com" className="hover:text-white">
                                        info@mailootje.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* FUN FACTS */}
                        <div className="mt-6">
                            <p className="mb-2 text-[10px] font-semibold tracking-widest text-white/50">
                                FUN FACTS:
                            </p>
                            <ul className="space-y-2 text-sm text-white/75">
                                <li>🖥️ Running Nebula, Zenith &amp; Nimbus</li>
                                <li>🎮 Builds Minecraft Folia networks</li>
                                <li>⚙️ Obsessed with Linux, servers &amp; automation</li>
                                <li>☕ Coffee-fueled coding sessions</li>
                            </ul>
                        </div>

                        {/* ABOUT + QUICK STATS */}
                        <div className="mt-8 grid gap-6 sm:grid-cols-2">
                            <div>
                                <p className="mb-2 text-[10px] font-semibold tracking-widest text-white/50">
                                    ABOUT ME
                                </p>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/5">
                                            {"</>"}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Developer</p>
                                            <p className="text-sm text-white/60">
                                                Full-stack (Next.js, TS, C#, PHP)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/5">
                                            📸
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Photography</p>
                                            <p className="text-sm text-white/60">
                                                Studio, editing &amp; events
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="mb-2 text-[10px] font-semibold tracking-widest text-white/50">
                                    QUICK STATS
                                </p>
                                <div className="space-y-3">
                                    <Stat label="Cups of Coffee" value="1–3 / day" />
                                    <Stat label="Coding Time" value="2–8 hours / day" />
                                    <Stat label="Current Goal" value="Build awesome things" />
                                </div>
                            </div>
                        </div>

                        {/* TAGS */}
                        <div className="mt-6 flex flex-wrap gap-2 sm:gap-3 text-xs text-[#C08CFF]">
                            {[
                                "React",
                                "Next.js",
                                "TypeScript",
                                "Node.js",
                                "Docker",
                                "Linux",
                            ].map((t) => (
                                <span
                                    key={t}
                                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </Card>

                    {/* GITHUB ACTIVITY */}
                    <Card className="min-h-[260px]">
                        <div className="text-[10px] font-semibold tracking-widest text-white/50">
                            GITHUB ACTIVITY
                        </div>

                        {/* prevent overflow on mobile */}
                        <div className="mt-3 overflow-x-auto">
                            <GitHubActivity username="Mailootje" />
                        </div>

                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/60">
                            <a
                                href="https://github.com/Mailootje"
                                target="_blank"
                                className="hover:text-white"
                            >
                                View Profile
                            </a>
                            <a
                                href="https://github.com/Mailootje?tab=repositories"
                                target="_blank"
                                className="hover:text-white"
                            >
                                View Repositories
                            </a>
                        </div>
                    </Card>

                    {/* LIVE SERVER BTOP-STYLE CARD */}
                    <Card className="min-h-[320px]">
                        <div className="text-[10px] font-semibold tracking-widest text-white/50 mb-3">
                            LIVE SERVER
                        </div>

                        {/* SystemMonitor has wide core bars → allow scroll on tiny screens */}
                        <div className="overflow-x-auto">
                            <SystemMonitor />
                        </div>
                    </Card>
                </div>

                {/* ---------------- RIGHT SIDE STACK ---------------- */}
                <div className="md:col-span-2 lg:col-start-3 flex flex-col gap-6">
                    {/* WEATHER */}
                    <WeatherCard />

                    {/* SPOTIFY */}
                    <SpotifyCard />

                    {/* WHAT I USE */}
                    <Card>
                        <p className="mb-3 text-[10px] font-semibold tracking-widest text-white/50">
                            WHAT I USE
                        </p>

                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="mb-2 text-white/50">Hardware</p>
                                <ul className="space-y-2 text-white/80">
                                    <li>Nebula (DL360 G9)</li>
                                    <li>Zenith (i9-14900K)</li>
                                    <li>Nimbus (DL360 G9)</li>
                                </ul>
                            </div>

                            <div>
                                <p className="mb-2 text-white/50">Software</p>
                                <ul className="space-y-2 text-white/80">
                                    <li>VS Code</li>
                                    <li>Next.js</li>
                                    <li>Docker</li>
                                    <li>Cloudflare</li>
                                </ul>
                            </div>
                        </div>
                    </Card>

                    {/* LINKS */}
                    <LinkGroups />
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-10 rounded-[18px] border border-white/[0.06] bg-[rgba(30,22,45,0.55)] px-6 py-4 text-xs text-white/50 flex flex-col sm:flex-row items-center justify-between gap-2 backdrop-blur-xl text-center sm:text-left">
                <span>Made with 💜 by Mailo</span>
                <span>mailootje.com © 2025</span>
            </footer>
        </main>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-white/70">{label}</span>
            <span className="text-white">{value}</span>
        </div>
    );
}

function MiniStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/80">
            <div className="text-xs text-white/60">{label}</div>
            <div className="text-sm">{value}</div>
        </div>
    );
}
