import "./globals.css";

export const metadata = {
    title: "Mailootje",
    description: "Personal site inspired by eva.pink, themed in purple.",
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
