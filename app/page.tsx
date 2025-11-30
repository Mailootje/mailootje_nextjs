// app/page.tsx
import Card from "./components/Card";
import GitHubActivity from "./components/GitHubActivity";
import LinkGroups from "./components/LinkGroups";
import SystemMonitor from "./components/SystemMonitor";
import WeatherCard from "./components/WeatherCard";
import SpotifyCard from "./components/SpotifyCard";
import HardwarePopup from "./components/HardwarePopup";
import Particles from "./components/Particles";

export default function Home() {
    return (
        <main className="mx-auto max-w-6xl px-3 sm:px-4 py-8 sm:py-10">
            <Particles />
            {/* Top bar */}
            <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <a
                    href="/"
                    className="text-2xl font-bold tracking-wide flex items-center gap-2 justify-center sm:justify-start"
                >
          <span className="text-[#B06EFF] drop-shadow-[0_0_12px_rgba(176,110,255,0.7)]">
            mailootje
          </span>
                </a>

                <nav className="flex items-center gap-2 justify-center sm:justify-end">
                    <a
                        href="mailto:info@mailootje.com"
                        className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:shadow-[0_0_12px_rgba(176,110,255,0.35)] transition"
                        aria-label="Email"
                    >
                        <MailIcon className="h-5 w-5" />
                    </a>
                    <a
                        href="https://github.com/Mailootje"
                        target="_blank"
                        rel="noreferrer"
                        className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:shadow-[0_0_12px_rgba(176,110,255,0.35)] transition"
                        aria-label="GitHub"
                    >
                        <GitHubIcon className="h-5 w-5" />
                    </a>
                    <a
                        href="https://discord.com/users/315483127751507970"
                        target="_blank"
                        rel="noreferrer"
                        className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:shadow-[0_0_12px_rgba(176,110,255,0.35)] transition"
                        aria-label="Discord"
                    >
                        <DiscordIcon className="h-5 w-5" />
                    </a>
                </nav>
            </header>

            {/* Responsive eva-style layout */}
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <div className="md:col-span-2 lg:col-span-1 lg:col-start-3 flex flex-col gap-6">
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
                                <HardwarePopup />
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
                </div>
            </section>

            {/* LINKS at bottom */}
            <div className="mt-8">
                <LinkGroups />
            </div>

            {/* Footer */}
            <footer className="mt-10 rounded-[18px] border border-white/[0.06] bg-[rgba(30,22,45,0.55)] px-6 py-4 text-xs text-white/50 flex flex-col sm:flex-row items-center justify-between gap-2 backdrop-blur-xl text-center sm:text-left">
                <span>Made with 💜 by Mailo</span>
                <span>mailootje.com © 2025</span>
            </footer>
        </main>
    );
}

type IconProps = { className?: string };

function MailIcon({ className }: IconProps) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
        >
            <rect x="3" y="5" width="18" height="14" rx="2.4" />
            <path d="m5 7 6.8 5a1.6 1.6 0 0 0 1.9 0L20 7" />
        </svg>
    );
}

function GitHubIcon({ className }: IconProps) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            role="img"
            aria-hidden
        >
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.762-1.605-2.665-.3-5.467-1.333-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
    );
}

function DiscordIcon({ className }: IconProps) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            role="img"
            aria-hidden
        >
            <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.375-.4447.8642-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8743-.6177-1.2495a.077.077 0 0 0-.0785-.0371 19.7363 19.7363 0 0 0-4.8852 1.5152.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.1001 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.0991.246.1981.3729.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.4198 0-1.3332.9565-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0956 2.1568 2.4198 0 1.3332-.9564 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.4198 0-1.3332.9564-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0956 2.1568 2.4198 0 1.3332-.946 2.4189-2.1568 2.4189z" />
        </svg>
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
