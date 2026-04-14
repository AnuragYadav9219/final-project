import { useGetDashboardQuery } from "@/features/dashboard/dashboardApi";
import { Wallet, Users, Receipt, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import Section from "@/components/common/Section";
import StatCard from "@/components/common/StatCard";
import AppCard from "@/components/common/AppCard";
import AppTable from "@/components/common/AppTable";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/global/Loader";

export default function Dashboard() {
    const { data, isLoading, isError } = useGetDashboardQuery();

    if (isLoading) return <Loader />;

    if (isError || !data) {
        return (
            <div className="text-center py-10 text-red-400">
                Failed to load dashboard
            </div>
        );
    }

    // 🔹 Format
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount || 0);

    const formatDate = (date) =>
        date
            ? new Date(date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
            })
            : "-";

    // 🔥 FIXED STATS
    const stats = [
        {
            title: "Total Spent",
            value: formatCurrency(data.total_spent),
            icon: Wallet,
            change: 12,
        },
        {
            title: "Groups",
            value: data.total_groups,
            icon: Users, // ✅ FIXED
            changeLabel: `${data.total_groups} active`,
        },
        {
            title: "Expenses",
            value: data.total_expenses,
            icon: Receipt,
            change: -3,
        },
    ];

    // 🔹 Table
    const columns = [
        {
            header: "Expense",
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.title}</span>
                    <span className="text-xs text-muted-foreground">
                        Group #{row.group}
                    </span>
                </div>
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
    ];

    const hasExpenses =
        Array.isArray(data.recent_expenses) &&
        data.recent_expenses.length > 0;

    return (
        <div className="space-y-8 animate-fadeIn">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Track, manage and split your expenses easily
                    </p>
                </div>

                <Button className="bg-linear-to-r from-indigo-500 to-cyan-500 hover:opacity-90 flex items-center gap-2">
                    <Plus size={16} />
                    Add Expense
                </Button>
            </div>

            {/* STATS */}
            <Section>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {stats.map((item, i) => (
                        <StatCard key={i} {...item} />
                    ))}
                </div>
            </Section>

            {/* RECENT EXPENSES */}
            <Section title="Recent Expenses">
                <AppCard>
                    {hasExpenses ? (
                        <AppTable
                            columns={columns}
                            data={data.recent_expenses}
                        />
                    ) : (
                        <EmptyState
                            icon={Receipt}
                            title="No expenses yet"
                            description="Start tracking your expenses by adding your first one."
                            actionText="Add Expense"
                            onAction={() => console.log("open modal")}
                        />
                    )}
                </AppCard>
            </Section>
        </div>
    );
}