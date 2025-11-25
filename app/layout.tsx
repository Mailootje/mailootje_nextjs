import "./globals.css";

export const metadata = {
    title: "Mailootje — Developer, Streamer & Photographer",
    description:
        "Mailo is a full-stack developer, streamer, photographer and community moderator. Passionate about servers, automation, Linux, and building things that scale.",

    icons: {
        icon: [
            { url: "/favicon.ico", type: "image/x-icon" },
            { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
            { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        ],
        apple: "/apple-touch-icon.png",
        shortcut: "/favicon.ico",
        other: [
            {
                rel: "manifest",
                url: "/site.webmanifest",
            },
        ],
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="min-h-screen bg-[#0d0b12] text-white relative overflow-x-hidden">

        {/* Particle canvas behind everything */}
        <div
            id="particles-js"
            className="fixed inset-0 -z-10 pointer-events-none"
        />

        {children}
        </body>
        </html>
    );
}
