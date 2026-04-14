export default function BalanceList({ balances }) {
    if (!balances.length) {
        return (
            <p className="text-muted-foreground text-sm">
                No balances yet
            </p>
        );
    }

    return (
        <div className="space-y-2">
            {balances.map((b, i) => (
                <div
                    key={i}
                    className="p-3 rounded-lg bg-white/5 flex justify-between"
                >
                    <span>
                        <strong>{b.from}</strong> owes{" "}
                        <strong>{b.to}</strong>
                    </span>

                    <span className="text-red-400">
                        ₹{b.amount}
                    </span>
                </div>
            ))}
        </div>
    );
}