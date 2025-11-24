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
        rounded-[18px]
        border border-white/[0.05]
        bg-[rgba(30,22,45,0.55)]
        shadow-[inset_0_0_0_1px_rgba(176,110,255,0.05)]
        backdrop-blur-xl
        p-6
        ${className}
      `}
        >
            {children}
        </section>
    );
}
