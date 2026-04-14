import { Pencil, Trash2 } from "lucide-react";

export default function ExpenseCard({
    expense,
    formatCurrency,
    formatDate,
    onEdit,
    onDelete,
}) {
    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">

            <div className="flex justify-between">
                <h3 className="font-medium">{expense.title}</h3>

                <div className="flex gap-2">
                    <button onClick={() => onEdit(expense)}>
                        <Pencil size={16} />
                    </button>
                    <button onClick={() => onDelete(expense.id)}>
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <p className="text-xs text-muted-foreground">
                {expense.group_name}
            </p>

            <p className="text-sm">
                Paid by <b>{expense.paid_by_name}</b>
            </p>

            <div className="flex justify-between">
                <span className="text-indigo-400 font-semibold">
                    {formatCurrency(expense.amount)}
                </span>

                <span className="text-xs text-muted-foreground">
                    {formatDate(expense.created_at)}
                </span>
            </div>
        </div>
    );
}