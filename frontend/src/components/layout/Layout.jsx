import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetProfileQuery } from "@/features/auth/authApi";
import { setCredentials } from "@/features/auth/authSlice";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Loader from "../global/Loader";
import AlertBox from "../global/AlertBox";
import ConfirmDialog from "../global/ConfirmDialog";

export default function Layout({ children }) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const { data, isLoading } = useGetProfileQuery();

    // 🔹 Sync user globally
    useEffect(() => {
        if (data) {
            dispatch(setCredentials({ access: localStorage.getItem("access") }));
        }
    }, [data, dispatch]);

    return (
        <div className="flex h-screen text-foreground relative overflow-hidden bg-linear-to-br from-[#0a0a12] via-[#0f172a] to-[#020617]">

            {/* Glow Effects */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500 opacity-20 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500 opacity-20 blur-3xl rounded-full"></div>

            {/* 🔹 Global UI */}
            <Loader />
            <AlertBox />
            <ConfirmDialog />

            {/* Sidebar */}
            <Sidebar open={open} setOpen={setOpen} />

            {/* Main */}
            <div className="flex flex-col flex-1">
                <Navbar toggleSidebar={() => setOpen(!open)} user={data} />

                <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-10">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        children
                    )}
                </main>
            </div>
        </div>
    );
}