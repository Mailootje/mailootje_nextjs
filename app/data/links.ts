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
                href: "https://mailobedo.nl/",
                iconSrc: "/links/website.webp",
            },
            {
                label: "zeuser.net",
                href: "https://zeuser.net/",
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
                href: "https://www.instagram.com/mailootje/",
                iconSrc: "/links/instagram.webp",
            },
            {
                label: "TikTok",
                href: "https://www.tiktok.com/@mailootje/",
                iconSrc: "/links/tiktok.webp",
            },
            {
                label: "YouTube",
                href: "https://youtube.com/@Mailootje",
                iconSrc: "/links/youtube.webp",
            },
            {
                label: "Twitch",
                href: "https://twitch.tv/mailootje",
                iconSrc: "/links/twitch.webp",
            },
            {
                label: "Twitch (Admin)",
                href: "https://twitch.tv/zeuser",
                iconSrc: "/links/twitch.webp",
            },
            {
                label: "Twitter / X",
                href: "https://x.com/_mailootje_",
                iconSrc: "/links/twitter.webp",
            },
            {
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/mailobed%C3%B6/",
                iconSrc: "/links/linkedin.webp",
            },
            {
                label: "Discord",
                href: "https://discord.com/users/315483127751507970",
                iconSrc: "/links/discord.webp",
            },
            {
                label: "Reddit",
                href: "https://www.reddit.com/user/Mailootje",
                iconSrc: "/links/reddit.webp",
            },
            {
                label: "Spotify (Personal)",
                href: "https://open.spotify.com/user/mailo18-10?si=5564e4b49c484cda",
                iconSrc: "/links/spotify.webp",
            },
            {
                label: "Spotify (Artist)",
                href: "https://open.spotify.com/artist/6BSfRASvo5696oRZ4ozPqQ",
                iconSrc: "/links/spotify_artists.webp",
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
                href: "https://steamcommunity.com/id/Mailootje/",
                iconSrc: "/links/steam.webp",
            },
            {
                label: "Xbox",
                href: "https://account.xbox.com/en-US/Profile?xr=socialtwistnav&csrf=ikVOjd7Yp0CCVGXxMbaKQsz8FRnDafnT0Yv9b5EmtbSNdaMtp7n231hK4frQhqbNpE41OTxQVUNhtfwtxtbiXxxKA-41&wa=wsignin1.0",
                iconSrc: "/links/xbox.webp",
            },
            {
                label: "Epic Games",
                href: "https://store.epicgames.com/u/735235dc63f24cebaeadde1fda7d667e",
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
                href: "https://github.com/mailootje",
                iconSrc: "/links/github.webp",
            },
            {
                label: "CodePen",
                href: "https://codepen.io/Mailootje",
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
                href: "https://refrr.app/ngw7y3VNzl/137652",
                iconSrc: "/links/pitaka.webp",
            },
            {
                label: "DistroKid Referral",
                href: "https://distrokid.com/vip/seven/6996600",
                iconSrc: "/links/distrokid.webp",
            },
            {
                label: "KuCoin Referral",
                href: "https://www.kucoin.com/r/rf/QBAVP9MJ",
                iconSrc: "/links/kucoin.webp",
            },
            {
                label: "World of Tanks Referral",
                href: "https://worldoftanks.eu/referral/444036fbed624e24a5ea1c358bf1196c",
                iconSrc: "/links/wargaming.webp",
            },
            {
                label: "Revolut Referral",
                href: "https://revolut.com/referral/?referral-code=mailoagmc!AUG2-25-AR-RPB-L2-REVPRO&geo-redirect",
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
                href: "https://store.zeuser.net/",
                iconSrc: "/links/zeusersmp.webp",
            },
            {
                label: "NightrexRP",
                href: "https://nightrex.com/",
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
                href: "https://app.grass.io/register?referralCode=moBKwPSrP5PIMPa",
                iconSrc: "/links/getgrass.webp",
            },
            {
                label: "NATIX Referral",
                href: "https://drive.natix.network/app-open?unlockCode=YazyRjC1QA",
                iconSrc: "/links/natix.webp",
            },
            {
                label: "SolAudio",
                href: "https://solaudio.io/",
                iconSrc: "/links/solaudio.webp",
            },
        ],
    },
];
