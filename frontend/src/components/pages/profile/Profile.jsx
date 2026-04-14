import { useGetProfileQuery, useUpdateProfileMutation } from "@/features/auth/authApi";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, LogOut, Pencil } from "lucide-react";
import Loader from "@/components/global/Loader";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

export default function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();

    const { data: user, isLoading } = useGetProfileQuery();

    const handleUpdate = async (data) => {
        try {
            const payload = {};

            if (data.username !== user.username) {
                payload.username = data.username;
            }

            if (data.email !== user.email) {
                payload.email = data.email;
            }

            if (Object.keys(payload).length === 0) {
                alert("No changes made");
                return;
            }

            console.log("FINAL PAYLOAD:", payload);

            await updateProfile(payload).unwrap();

            setOpen(false);
        } catch (err) {
            console.error(err);
            alert(
                err?.data?.username ||
                err?.data?.email ||
                "Failed to update profile"
            );
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    if (isLoading) return <Loader />;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-gray-900 to-black p-4 md:p-8 text-white">

            <div className="max-w-4xl mx-auto space-y-6">

                {/* HEADER */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        My Profile
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Manage your account details
                    </p>
                </div>

                {/* PROFILE CARD */}
                <Card className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
                    <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">

                        {/* AVATAR */}
                        <div className="w-24 h-24 rounded-full bg-linear-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            {user?.username?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        {/* USER INFO */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-xl md:text-2xl font-semibold">
                                {user?.username || "User"}
                            </h2>

                            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mt-2 text-sm">
                                <Mail size={16} />
                                <span>{user?.email}</span>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-3 w-full md:w-auto">

                            <Button
                                variant="outline"
                                onClick={() => setOpen(true)}
                                className="flex-1 md:flex-none border-white/10 bg-white/5 hover:bg-white/10 text-white"
                            >
                                <Pencil size={16} />
                                <span className="hidden sm:inline">Edit</span>
                            </Button>

                            <Button
                                onClick={handleLogout}
                                className="flex-1 md:flex-none bg-red-500 hover:bg-red-600 text-white"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>

                    </CardContent>
                </Card>

            </div>

            <EditProfileModal
                open={open}
                onClose={() => setOpen(false)}
                user={user}
                onSave={handleUpdate}
                isLoading={updating}
            />
        </div>
    );
}