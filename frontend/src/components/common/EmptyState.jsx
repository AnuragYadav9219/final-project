import { Button } from "@/components/ui/button";

export default function EmptyState({
    icon: Icon,
    title = "No Data Found",
    description = "There’s nothing here yet.",
    actionText,
    onAction,
}) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-12 px-4">

            {/* Icon */}
            {Icon && (
                <div className="mb-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                    <Icon size={28} className="text-indigo-400" />
                </div>
            )}

            {/* Title */}
            <h2 className="text-lg font-semibold mb-2">
                {title}
            </h2>

            {/* Description */}
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
                {description}
            </p>

            {/* Action Button */}
            {actionText && (
                <Button
                    onClick={onAction}
                    className="bg-linear-to-r from-indigo-500 to-cyan-500 hover:opacity-90"
                >
                    {actionText}
                </Button>
            )}
        </div>
    );
}