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

        /* smoother animation */
        transition-all duration-300 ease-[cubic-bezier(.25,.1,.25,1)]

        /* hover effects */
        hover:-translate-y-1.5
        hover:scale-[1.015]
        hover:border-white/[0.10]
        hover:shadow-[0_15px_35px_rgba(0,0,0,0.45),inset_0_0_0_1px_rgba(176,110,255,0.12),0_0_25px_rgba(176,110,255,0.18)]

        active:scale-[1.005] active:translate-y-0

        ${className}
      `}
        >
            {children}
        </section>
    );
}
