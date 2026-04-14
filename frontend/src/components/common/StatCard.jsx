import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({
    title,
    value,
    icon: Icon,
    change,
    changeLabel,
}) {
    const isPositive = change > 0;
    const isNegative = change < 0;

    return (
        <div className="relative p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group transition hover:scale-[1.02]">

            {/* Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-linear-to-r from-indigo-500/10 to-cyan-500/10" />

            {/* Top */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-muted-foreground">{title}</p>
                    <h2 className="text-2xl font-bold mt-1">{value}</h2>
                </div>

                {Icon && (
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Icon size={18} />
                    </div>
                )}
            </div>

            {/* Bottom */}
            {typeof change === "number" ? (
                <div
                    className={`mt-3 flex items-center text-xs ${isPositive
                            ? "text-green-400"
                            : isNegative
                                ? "text-red-400"
                                : "text-muted-foreground"
                        }`}
                >
                    {isPositive && <ArrowUpRight size={14} />}
                    {isNegative && <ArrowDownRight size={14} />}

                    <span className="ml-1">
                        {change > 0 ? "+" : ""}
                        {change}%
                    </span>

                    <span className="ml-1 text-muted-foreground">
                        {changeLabel || "vs last period"}
                    </span>
                </div>
            ) : (
                changeLabel && (
                    <div className="mt-3 text-xs text-muted-foreground">
                        {changeLabel}
                    </div>
                )
            )}
        </div>
    );
}