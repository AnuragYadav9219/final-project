import { useParams } from "react-router-dom";
import {
    useGetGroupByIdQuery,
    useGetBalancesQuery,
} from "@/features/group/groupApi";
import { useGetExpensesQuery } from "@/features/expense/expenseApi";

import { useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
    Plus,
    Users,
    Wallet,
    ArrowUpRight,
    UserPlus,
} from "lucide-react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    Tooltip,
} from "recharts";

import ExpenseModal from "../expense/ExpenseModal";
import Loader from "@/components/global/Loader";
import InviteMemberModal from "./InviteMemberModal";
import StatCard from "@/components/common/StatCard";
import { useCreateSettlementMutation } from "@/features/group/settlementApi";
import { toast } from "sonner";

export default function GroupDetails() {
    const { id } = useParams();
    const [open, setOpen] = useState(false);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [optimize, setOptimize] = useState(false);

    const { data: group, isLoading } = useGetGroupByIdQuery(id);
    const { data: balances = [] } = useGetBalancesQuery({
        groupId: id,
        optimize,
    });
    const { data: expenses = [] } = useGetExpensesQuery(id);
    const [settle, { isLoading: settling }] = useCreateSettlementMutation();

    if (isLoading) return <Loader />;

    const handleSettle = async (b) => {
        try {
            await settle({
                from_member: b.from_id,
                to_member: b.to_id,
                group: group.id,
                amount: b.amount,
            }).unwrap();
        } catch (err) {
            console.log(err);
            toast.alert("Settlement failed");
        }
    }

    const chartData = expenses.map((e) => ({
        name: new Date(e.created_at).toLocaleDateString(),
        amount: Number(e.amount),
    }));

    const totalExpenses = expenses.reduce(
        (sum, e) => sum + Number(e.amount),
        0
    );

    return (
        <div className="space-y-6 md:space-y-8 pb-24">

            <div className="backdrop-blur-xl bg-black/40 border-b border-white/10 px-2 py-3 md:p-0 md:bg-transparent md:border-none">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    {/* LEFT */}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            {group?.name}
                        </h1>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            {group?.members?.length} members
                        </p>
                    </div>

                    {/* RIGHT BUTTONS */}
                    <div className="flex gap-2 flex-wrap">

                        <Button
                            onClick={() => setInviteOpen(true)}
                            variant="outline"
                            className="flex items-center gap-2 bg-white/5 border-white/10 hover:bg-white/10"
                        >
                            <UserPlus size={16} />
                            <span className="hidden sm:inline">Invite</span>
                        </Button>

                        <Button
                            onClick={() => setOpen(true)}
                            className="bg-linear-to-r from-indigo-500 to-cyan-500 flex items-center gap-2 shadow-lg"
                        >
                            <Plus size={16} />
                            <span className="hidden sm:inline">Add Expense</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard
                    title="Total Expenses"
                    value={`₹${totalExpenses}`}
                    icon={Wallet}
                    change={12.5}
                    changeLabel="this month"
                />

                <StatCard
                    title="Members"
                    value={group?.members?.length || 0}
                    icon={Users}
                    change={0}
                    changeLabel="group size"
                />

                <StatCard
                    title="Transactions"
                    value={balances.length}
                    icon={ArrowUpRight}
                    change={8}
                    changeLabel="activity"
                />
            </div>

            {/* CHART */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 md:p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
                <h2 className="mb-4 font-semibold text-sm md:text-base">
                    Spending Trend
                </h2>

                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={chartData}>
                        <XAxis dataKey="name" hide={window.innerWidth < 500} />
                        <Tooltip />
                        <Line type="monotone" dataKey="amount" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>

            {/* 👥 MEMBERS */}
            <div className="p-4 md:p-5 rounded-2xl bg-white/5 border border-white/10">
                <h2 className="mb-4 font-semibold">Members</h2>

                <div className="flex flex-wrap gap-3">
                    {group?.members?.map((m) => (
                        <motion.div key={m.id} whileHover={{ scale: 1.08 }}>
                            <Avatar className="bg-linear-to-br from-indigo-500 to-cyan-500 text-white">
                                <AvatarFallback>
                                    {m.username[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* BALANCES */}
            <div className="p-4 md:p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex justify-between items-center mb-4">

                    <h2 className="font-semibold">Balances</h2>

                    <div className="flex items-center gap-2 text-xs">
                        <span>Optimize</span>
                        <input
                            type="checkbox"
                            checked={optimize}
                            onChange={() => setOptimize(!optimize)}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    {balances.map((b, i) => (
                        <div
                            key={i}
                            className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-xl"
                        >
                            <div>
                                <p className="text-sm">
                                    <strong>{b.from}</strong> owes{" "}
                                    <strong>{b.to}</strong>
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    {b.optimized ? "Optimized debt" : "Direct debt"}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-red-400 font-semibold">
                                    ₹{b.amount}
                                </span>

                                <Button
                                    size="sm"
                                    onClick={() => handleSettle(b)}
                                    disabled={settling}
                                    className="bg-green-500 hover:bg-green-600"
                                >
                                    Settle
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* EXPENSES */}
            <div className="p-4 md:p-5 rounded-2xl bg-white/5 border border-white/10">
                <h2 className="mb-4 font-semibold">Recent Expenses</h2>

                <div className="space-y-3">
                    {expenses.map((e) => (
                        <motion.div
                            key={e.id}
                            whileHover={{ scale: 1.02 }}
                            className="p-3 rounded-lg bg-black/30 flex justify-between items-center"
                        >
                            <div className="max-w-[60%]">
                                <p className="font-medium truncate">{e.title}</p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(e.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-sm font-semibold">
                                    ₹{e.amount}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {e.paid_by_name}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* FLOATING ACTION BUTTON (Mobile Only) */}
            <div className="fixed bottom-5 right-5 md:hidden">
                <Button
                    onClick={() => setOpen(true)}
                    className="rounded-full h-14 w-14 shadow-xl bg-linear-to-r from-indigo-500 to-cyan-500"
                >
                    <Plus />
                </Button>
            </div>

            {/* MODALS */}
            <ExpenseModal
                open={open}
                onClose={() => setOpen(false)}
                groups={[group]}
                members={group?.members || []}
            />

            <InviteMemberModal
                open={inviteOpen}
                onClose={() => setInviteOpen(false)}
                groupId={group.id}
            />
        </div>
    );
}