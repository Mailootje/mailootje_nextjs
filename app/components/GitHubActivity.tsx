"use client";

import { GitHubCalendar } from "react-github-calendar";

export default function GitHubActivity({ username }: { username: string }) {
    return (
        <div className="rounded-xl border border-white/10 bg-black/20 p-3 overflow-x-auto">
            <GitHubCalendar
                username={username}
                blockSize={9}
                blockMargin={3}
                fontSize={12}
                colorScheme="dark"
                theme={{
                    dark: [
                        "rgba(255,255,255,0.06)", // 0 contributions
                        "#2a163f",
                        "#4b1f6e",
                        "#6a2aa1",
                        "#B06EFF",               // max contributions
                    ],
                }}
            />
        </div>
    );
}
