import { useState } from "react";
import {
    useGetExpensesQuery,
    useDeleteExpenseMutation,
} from "@/features/expense/expenseApi";
import { useGetGroupsQuery } from "@/features/group/groupApi";

import { Plus, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/global/Loader";
import AppCard from "@/components/common/AppCard";
import ExpenseList from "./ExpenseList";
import EmptyState from "@/components/common/EmptyState";
import Section from "@/components/common/Section";
import ExpenseModal from "./ExpenseModal";

export default function Expenses() {
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const { data = [], isLoading, isError } = useGetExpensesQuery(null);
    const { data: groupsData = [] } = useGetGroupsQuery();

    const [deleteExpense] = useDeleteExpenseMutation();

    // Flatten members
    const members = groupsData.flatMap((g) => g.members || []);
    const groups = groupsData;

    if (isLoading) return <Loader />;

    if (isError) {
        return (
            <div className="text-center py-10 text-red-400">
                Failed to load expenses
            </div>
        );
    }

    // Format helpers
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
        });

    const hasData = data.length > 0;

    // DELETE
    const handleDelete = async (id) => {
        if (!confirm("Delete this expense?")) return;

        try {
            setDeletingId(id);
            await deleteExpense(id).unwrap();
        } catch {
            alert("Delete failed");
        } finally {
            setDeletingId(null);
        }
    };

    // EDIT
    const handleEdit = (expense) => {
        setEditData(expense);
        setOpen(true);
    };

    // CLOSE MODAL
    const handleClose = () => {
        setOpen(false);
        setEditData(null);
    };

    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Expenses</h1>
                    <p className="text-sm text-muted-foreground">
                        View and manage all your expenses
                    </p>
                </div>

                <Button
                    onClick={() => {
                        setEditData(null);
                        setOpen(true);
                    }}
                    className="bg-linear-to-r from-indigo-500 to-cyan-500 flex items-center gap-2"
                >
                    <Plus size={16} />
                    Add Expense
                </Button>
            </div>

            {/* LIST */}
            <Section>
                <AppCard>
                    {hasData ? (
                        <ExpenseList
                            data={data}
                            formatCurrency={formatCurrency}
                            formatDate={formatDate}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ) : (
                        <EmptyState
                            icon={Receipt}
                            title="No expenses yet"
                            description="Start tracking your expenses by adding your first one."
                            actionText="Add Expense"
                            onAction={() => {
                                setEditData(null);
                                setOpen(true);
                            }}
                        />
                    )}
                </AppCard>
            </Section>

            {/* MODAL */}
            <ExpenseModal
                open={open}
                onClose={handleClose}
                editData={editData}
                members={members}
                groups={groups}
            />
        </div>
    );
}