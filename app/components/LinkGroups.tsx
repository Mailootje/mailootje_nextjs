import Card from "./Card";
import { LINK_GROUPS } from "../data/links";

export default function LinkGroups() {
    return (
        <Card>
            <p className="mb-3 text-[10px] font-semibold tracking-widest text-white/50">
                LINKS
            </p>

            <div className="space-y-5">
                {LINK_GROUPS.map((group) => (
                    <div key={group.title}>
                        <p className="mb-2 text-xs font-semibold text-white/70">
                            {group.title}
                        </p>

                        <div className="space-y-2">
                            {group.items.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    className="
                    flex items-center gap-3
                    rounded-xl border border-white/10 bg-white/5
                    px-3 py-2 text-sm text-white/80
                    hover:text-white hover:shadow-[0_0_10px_rgba(176,110,255,0.35)]
                    transition
                  "
                                >
                                    <img
                                        src={item.iconSrc}
                                        className="h-5 w-5 rounded-sm opacity-90"
                                    />

                                    <span className="flex-1">{item.label}</span>
                                    <span className="text-white/40 text-xs">↗</span>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
