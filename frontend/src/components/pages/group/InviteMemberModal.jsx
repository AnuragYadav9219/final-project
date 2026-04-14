import { useState } from "react";
import { useSendInviteMutation } from "@/features/group/groupApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function InviteMemberModal({ open, onClose, groupId }) {
    const [email, setEmail] = useState("");
    const [inviteLink, setInviteLink] = useState("");

    const [sendInvite, { isLoading }] = useSendInviteMutation();

    if (!open) return null;

    const handleInvite = async () => {
        if (!email) return alert("Enter email");

        try {
            const res = await sendInvite({
                email,
                group: groupId,
            }).unwrap();

            // Backend should return token ideally
            if (res?.token) {
                const link = `${window.location.origin}/join/${res.token}`;
                setInviteLink(link);
            }

            setEmail("");
        } catch (err) {
            alert("Failed to send invite");
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        alert("Link copied!");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

            <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-4">

                <h2 className="text-lg font-semibold">
                    Invite Member
                </h2>

                <Input
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Button onClick={handleInvite} disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Invite"}
                </Button>

                {inviteLink && (
                    <div className="mt-3 p-3 bg-black/30 rounded-lg">
                        <p className="text-xs mb-2">Invite Link:</p>
                        <div className="flex gap-2">
                            <input
                                value={inviteLink}
                                readOnly
                                className="flex-1 bg-transparent text-xs"
                            />
                            <Button size="sm" onClick={copyLink}>
                                Copy
                            </Button>
                        </div>
                    </div>
                )}

                <Button variant="ghost" onClick={onClose}>
                    Close
                </Button>

            </div>
        </div>
    );
}