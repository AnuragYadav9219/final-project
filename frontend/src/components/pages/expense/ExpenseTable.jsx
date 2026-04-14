import AppTable from "@/components/common/AppTable";
import { Pencil, Trash2 } from "lucide-react";

export default function ExpenseTable({
    data,
    formatCurrency,
    formatDate,
    onEdit,
    onDelete,
}) {
    const columns = [
        {
            header: "Expense",
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.title}</span>
                    <span className="text-xs text-muted-foreground">
                        {row.group_name}   
                    </span>
                </div>
            ),
        },
        {
            header: "Paid By",
            render: (row) => (
                <span className="text-sm">
                    {row.paid_by_name}
                </span>
            ),
        },
        {
            header: "Amount",
            render: (row) => (
                <span className="text-indigo-400 font-semibold">
                    {formatCurrency(row.amount)}
                </span>
            ),
        },
        {
            header: "Date",
            render: (row) => (
                <span className="text-xs text-muted-foreground">
                    {formatDate(row.created_at)}
                </span>
            ),
        },
        {
            header: "Actions",
            render: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(row)}
                        className="p-1 hover:text-indigo-400"
                    >
                        <Pencil size={16} />
                    </button>

                    <button
                        onClick={() => onDelete(row.id)}
                        className="p-1 hover:text-red-400"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return <AppTable columns={columns} data={data} />;
}