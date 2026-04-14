import { useState, useEffect } from "react";
import {
    useCreateExpenseMutation,
    useUpdateExpenseMutation,
} from "@/features/expense/expenseApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

export default function ExpenseModal({
    open,
    onClose,
    editData = null,
    members = [],
    groups = [],
}) {
    const [form, setForm] = useState({
        title: "",
        amount: "",
        group: "",
        paid_by: [],
        paid_splits: {},
        split_between: [],
    });

    const [paidType, setPaidType] = useState("single"); // 🔥 NEW
    const [splitType, setSplitType] = useState("equal");
    const [customSplits, setCustomSplits] = useState({});
    const [filteredMembers, setFilteredMembers] = useState([]);

    const [createExpense, { isLoading: creating }] =
        useCreateExpenseMutation();
    const [updateExpense, { isLoading: updating }] =
        useUpdateExpenseMutation();

    const isLoading = creating || updating;

    // Reset / Prefill
    useEffect(() => {
        if (!editData) {
            setForm({
                title: "",
                amount: "",
                group: "",
                paid_by: [],
                paid_splits: {},
                split_between: [],
            });
            setPaidType("single");
            setSplitType("equal");
            setCustomSplits({});
        }
    }, [editData]);

    // Filter members by group
    useEffect(() => {
        if (!form.group) return;

        const selectedGroup = groups.find(
            (g) => String(g.id) === String(form.group)
        );

        setFilteredMembers(selectedGroup?.members || []);
    }, [form.group, groups]);

    if (!open) return null;

    // Equal split
    const equalAmount =
        form.split_between.length > 0
            ? (Number(form.amount) / form.split_between.length).toFixed(2)
            : 0;

    // Toggle split members
    const toggleMember = (id) => {
        setForm((prev) => ({
            ...prev,
            split_between: prev.split_between.includes(id)
                ? prev.split_between.filter((m) => m !== id)
                : [...prev.split_between, id],
        }));
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.split_between.length) {
            alert("Select members to split");
            return;
        }

        // SPLITS
        let splits = [];

        if (splitType === "equal") {
            const equal =
                Number(form.amount) / form.split_between.length;

            splits = form.split_between.map((id) => ({
                member: Number(id),
                amount: Number(equal.toFixed(2)),
            }));
        } else {
            splits = form.split_between.map((id) => ({
                member: Number(id),
                amount: Number(customSplits[id] || 0),
            }));

            const total = splits.reduce((s, x) => s + x.amount, 0);

            if (total !== Number(form.amount)) {
                alert("Split must match total amount");
                return;
            }
        }

        // PAID VALIDATION
        let payload = {};

        if (paidType === "single") {
            if (form.paid_by.length !== 1) {
                alert("Select who paid");
                return;
            }

            payload.paid_by = Number(form.paid_by[0]);
        } else {
            const totalPaid = Object.values(form.paid_splits).reduce(
                (sum, val) => sum + Number(val || 0),
                0
            );

            if (totalPaid !== Number(form.amount)) {
                alert("Paid amounts must equal total");
                return;
            }

            payload.paid_by = form.paid_by.map(Number);
            payload.paid_splits = Object.entries(form.paid_splits).map(
                ([member, amount]) => ({
                    member: Number(member),
                    amount: Number(amount),
                })
            );
        }

        payload = {
            ...payload,
            title: form.title,
            amount: Number(form.amount),
            group: Number(form.group),
            splits,
        };

        try {
            if (editData) {
                await updateExpense({
                    id: editData.id,
                    ...payload,
                }).unwrap();
            } else {
                await createExpense(payload).unwrap();
            }

            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to save expense");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3">

            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-5">

                <h2 className="text-lg font-semibold">
                    Add Expense
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <Input
                        placeholder="Title"
                        value={form.title}
                        onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                        }
                    />

                    <Input
                        type="number"
                        placeholder="Amount"
                        value={form.amount}
                        onChange={(e) =>
                            setForm({ ...form, amount: e.target.value })
                        }
                    />

                    {/* GROUP */}
                    <Select
                        value={form.group}
                        onValueChange={(value) =>
                            setForm({ ...form, group: value })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Group" />
                        </SelectTrigger>
                        <SelectContent>
                            {groups.map((g) => (
                                <SelectItem key={g.id} value={String(g.id)}>
                                    {g.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* 🔥 PAID TYPE */}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setPaidType("single")}
                            className={`px-3 py-1 rounded ${paidType === "single"
                                    ? "bg-indigo-500 text-white"
                                    : "bg-white/5"
                                }`}
                        >
                            Single
                        </button>

                        <button
                            type="button"
                            onClick={() => setPaidType("multiple")}
                            className={`px-3 py-1 rounded ${paidType === "multiple"
                                    ? "bg-indigo-500 text-white"
                                    : "bg-white/5"
                                }`}
                        >
                            Multiple
                        </button>
                    </div>

                    {/* 🔥 PAID BY */}
                    {paidType === "single" ? (
                        <Select
                            value={form.paid_by[0] || ""}
                            onValueChange={(value) =>
                                setForm({
                                    ...form,
                                    paid_by: [value],
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Paid By" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredMembers.map((m) => (
                                    <SelectItem
                                        key={m.id}
                                        value={String(m.id)}
                                    >
                                        {m.username}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <div className="space-y-2">
                            {filteredMembers.map((m) => {
                                const id = String(m.id);
                                const selected =
                                    form.paid_by.includes(id);

                                return (
                                    <div
                                        key={id}
                                        className="flex justify-between items-center"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    paid_by: selected
                                                        ? prev.paid_by.filter(
                                                            (x) => x !== id
                                                        )
                                                        : [
                                                            ...prev.paid_by,
                                                            id,
                                                        ],
                                                }))
                                            }
                                            className={`px-3 py-1 rounded border ${selected
                                                    ? "bg-green-500 text-white"
                                                    : "border-white/10"
                                                }`}
                                        >
                                            {m.username}
                                        </button>

                                        {selected && (
                                            <Input
                                                type="number"
                                                placeholder="₹"
                                                value={
                                                    form.paid_splits[id] || ""
                                                }
                                                onChange={(e) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        paid_splits: {
                                                            ...prev.paid_splits,
                                                            [id]: Number(
                                                                e.target.value
                                                            ),
                                                        },
                                                    }))
                                                }
                                                className="w-24"
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* SPLIT TYPE */}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setSplitType("equal")}
                            className={`px-3 py-1 rounded ${splitType === "equal"
                                    ? "bg-indigo-500 text-white"
                                    : "bg-white/5"
                                }`}
                        >
                            Equal
                        </button>

                        <button
                            type="button"
                            onClick={() => setSplitType("custom")}
                            className={`px-3 py-1 rounded ${splitType === "custom"
                                    ? "bg-indigo-500 text-white"
                                    : "bg-white/5"
                                }`}
                        >
                            Custom
                        </button>
                    </div>

                    {/* SPLIT MEMBERS */}
                    <div className="space-y-2">
                        {filteredMembers.map((m) => {
                            const id = String(m.id);
                            const selected =
                                form.split_between.includes(id);

                            return (
                                <div
                                    key={id}
                                    className="flex justify-between items-center"
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleMember(id)}
                                        className={`px-3 py-1 rounded border ${selected
                                                ? "bg-indigo-500 text-white"
                                                : "border-white/10"
                                            }`}
                                    >
                                        {m.username}
                                    </button>

                                    {selected &&
                                        (splitType === "equal" ? (
                                            <span>₹{equalAmount}</span>
                                        ) : (
                                            <Input
                                                type="number"
                                                value={
                                                    customSplits[id] || ""
                                                }
                                                onChange={(e) =>
                                                    setCustomSplits((prev) => ({
                                                        ...prev,
                                                        [id]: Number(
                                                            e.target.value
                                                        ),
                                                    }))
                                                }
                                                className="w-24"
                                            />
                                        ))}
                                </div>
                            );
                        })}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>

                        <Button disabled={isLoading}>
                            {isLoading ? "Saving..." : "Add"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}