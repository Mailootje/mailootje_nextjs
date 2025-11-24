// /app/data/links.ts

export type LinkItem = {
    label: string;
    href: string;
    iconSrc: string;   // stored inside /public/links/
    note?: string;
};

export type LinkGroup = {
    title: string;
    items: LinkItem[];
};

export const LINK_GROUPS: LinkGroup[] = [
    //----------------------------------------------------------------------
    // WEBSITES
    //----------------------------------------------------------------------
    {
        title: "Websites",
        items: [
            {
                label: "mailobedo.nl",
                href: "https://mailobedo.nl",
                iconSrc: "/links/website.webp",
            },
            {
                label: "zeuser.net",
                href: "https://zeuser.net",
                iconSrc: "/links/zeusernet.webp",
            },
            {
                label: "solaudio.io",
                href: "https://solaudio.io",
                iconSrc: "/links/solaudio.webp",
            },
        ],
    },

    //----------------------------------------------------------------------
    // SOCIAL ACCOUNTS
    //----------------------------------------------------------------------
    {
        title: "Socials",
        items: [
            {
                label: "Instagram",
                href: "https://instagram.com/mailootje",
                iconSrc: "/links/instagram.webp",
            },
            {
                label: "TikTok",
                href: "https://tiktok.com/@mailootje",
                iconSrc: "/links/tiktok.webp",
            },
            {
                label: "YouTube",
                href: "https://youtube.com/@mailootje",
                iconSrc: "/links/youtube.webp",
            },
            {
                label: "Twitch",
                href: "https://twitch.tv/mailootje",
                iconSrc: "/links/twitch.webp",
            },
            {
                label: "Twitter / X",
                href: "https://x.com/mailootje",
                iconSrc: "/links/twitter.webp",
            },
            {
                label: "LinkedIn",
                href: "https://linkedin.com/in/mailobedo",
                iconSrc: "/links/linkedin.webp",
            },
            {
                label: "Discord",
                href: "https://discord.gg/your-invite",
                iconSrc: "/links/discord.webp",
            },
            {
                label: "Reddit",
                href: "https://reddit.com/u/mailootje",
                iconSrc: "/links/reddit.webp",
            },
            {
                label: "Spotify (Personal)",
                href: "https://open.spotify.com/user/31bp7ujn7mo5h9ru5nlvwjgq35wy",
                iconSrc: "/links/spotify.webp",
            },
            {
                label: "Spotify (Artist)",
                href: "https://open.spotify.com/artist/6BSfRASvo5696oRZ4ozPqQ",
                iconSrc: "/links/spotify.webp",
            },
        ],
    },

    //----------------------------------------------------------------------
    // GAMING PROFILES
    //----------------------------------------------------------------------
    {
        title: "Gaming",
        items: [
            {
                label: "Steam",
                href: "https://steamcommunity.com/id/mailootje/",
                iconSrc: "/links/steam.webp",
            },
            {
                label: "Xbox",
                href: "https://account.xbox.com/",
                iconSrc: "/links/xbox.webp",
            },
            {
                label: "Epic Games",
                href: "https://store.epicgames.com/u/mailootje",
                iconSrc: "/links/epicgames.webp",
            },
        ],
    },

    //----------------------------------------------------------------------
    // DEVELOPMENT
    //----------------------------------------------------------------------
    {
        title: "Coding",
        items: [
            {
                label: "GitHub",
                href: "https://github.com/Mailootje",
                iconSrc: "/links/github.webp",
            },
            {
                label: "CodePen",
                href: "https://codepen.io/mailootje",
                iconSrc: "/links/codepen.webp",
            },
        ],
    },

    //----------------------------------------------------------------------
    // REFERRAL / AFFILIATES
    //----------------------------------------------------------------------
    {
        title: "Referral Codes",
        items: [
            {
                label: "Pitaka Referral",
                href: "https://pitaka.com/?ref=mailootje",
                iconSrc: "/links/pitaka.webp",
            },
            {
                label: "DistroKid Referral",
                href: "https://distrokid.com/vip/m3/123456",
                iconSrc: "/links/distrokid.webp",
            },
            {
                label: "KuCoin Referral",
                href: "https://www.kucoin.com/r/12345",
                iconSrc: "/links/kucoin.webp",
            },
            {
                label: "World of Tanks Referral",
                href: "https://worldoftanks.eu/invite/xyz",
                iconSrc: "/links/wargaming.webp",
            },
            {
                label: "Revolut Referral",
                href: "https://revolut.me/mailootje",
                iconSrc: "/links/revolut.webp",
            },
        ],
    },

    //----------------------------------------------------------------------
    // SERVERS & PROJECTS
    //----------------------------------------------------------------------
    {
        title: "Servers & Projects",
        items: [
            {
                label: "Zeuser Network",
                href: "https://zeuser.net",
                iconSrc: "/links/zeusersmp.webp",
            },
            {
                label: "NightrexRP",
                href: "https://nightrexrp.com",
                iconSrc: "/links/nightrexrp.webp",
            },
        ],
    },

    //----------------------------------------------------------------------
    // CRYPTO & WEB3
    //----------------------------------------------------------------------
    {
        title: "Crypto",
        items: [
            {
                label: "Grass Referral",
                href: "https://app.getgrass.io/register?ref=mailootje",
                iconSrc: "/links/getgrass.webp",
            },
            {
                label: "NATIX Referral",
                href: "https://natix.com/ref/mailootje",
                iconSrc: "/links/natix.webp",
            },
            {
                label: "SolAudio",
                href: "https://solaudio.io",
                iconSrc: "/links/solaudio.webp",
            },
        ],
    },
];
