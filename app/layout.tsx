import "./globals.css";

export const metadata = {
    title: "Mailootje — Developer, Streamer & Photographer",
    description:
        "Mailo is a full-stack developer, streamer, photographer and community moderator. Passionate about servers, automation, Linux, and building things that scale.",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="min-h-screen bg-[#0d0b12] text-white">
        {children}
        </body>
        </html>
    );
}
