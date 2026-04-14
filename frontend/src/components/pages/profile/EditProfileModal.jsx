import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail } from "lucide-react";

export default function EditProfileModal({
    open,
    onClose,
    user,
    onSave,
    isLoading,
}) {
    const [form, setForm] = useState({
        username: "",
        email: "",
    });

    useEffect(() => {
        if (user) {
            setForm({
                username: user.username || "",
                email: user.email || "",
            });
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white/5 backdrop-blur-xl border border-white/10 text-white">

                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">

                    {/* USERNAME */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-400 flex items-center gap-2">
                            <User size={14} /> Username
                        </label>
                        <Input
                            value={form.username}
                            onChange={(e) =>
                                setForm({ ...form, username: e.target.value })
                            }
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-400 flex items-center gap-2">
                            <Mail size={14} /> Email
                        </label>
                        <Input
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>

                        <Button disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}