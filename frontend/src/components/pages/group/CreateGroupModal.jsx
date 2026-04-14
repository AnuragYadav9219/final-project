import { useState } from "react";
import { useCreateGroupMutation } from "@/features/group/groupApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateGroupModal({ open, onClose }) {
    const [name, setName] = useState("");
    const [createGroup, { isLoading }] = useCreateGroupMutation();

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Group name is required");
            return;
        }

        try {
            await createGroup({ name }).unwrap();
            setName("");
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to create group");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-5">

                <h2 className="text-lg font-semibold">
                    Create New Group
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <Input
                        placeholder="Enter group name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>

                        <Button disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create"}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}