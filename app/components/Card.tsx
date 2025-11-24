// app/components/Card.tsx
import React from "react";

export default function Card({
                                 children,
                                 className = "",
                             }: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section
            className={`
        min-w-0
        rounded-[18px]
        border border-white/[0.05]
        bg-[rgba(30,22,45,0.55)]
        shadow-[inset_0_0_0_1px_rgba(176,110,255,0.05)]
        backdrop-blur-xl
        p-4 sm:p-6
        ${className}
      `}
        >
            {children}
        </section>
    );
}
