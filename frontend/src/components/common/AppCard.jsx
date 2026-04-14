export default function AppCard({ title, children, action }) {
    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg hover:shadow-xl transition">

            {/* Header */}
            {(title || action) && (
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-muted-foreground">
                        {title}
                    </h2>

                    {action && <div>{action}</div>}
                </div>
            )}

            {/* Content */}
            <div>{children}</div>
        </div>
    );
}