import { Home, Users, Receipt, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const menu = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Groups", icon: Users, path: "/groups" },
    { name: "Expenses", icon: Receipt, path: "/expenses" },
];

export default function Sidebar({ open, setOpen }) {
    return (
        <>
            {/* DESKTOP */}
            <div className="hidden md:flex flex-col w-64 h-screen bg-white/5 backdrop-blur-xl border-r border-white/10 p-5 sticky top-0">

                <h1 className="text-2xl font-bold mb-8 bg-linear-to-r from-indigo-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
                    SpendWise
                </h1>

                <div className="space-y-2">
                    {menu.map((item, i) => (
                        <NavLink
                            key={i}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${isActive
                                    ? "bg-linear-to-r from-indigo-500 to-cyan-500 text-white shadow-lg"
                                    : "text-muted-foreground hover:text-white hover:bg-white/10"
                                }`
                            }
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={18} />
                                <span className="text-sm font-medium">
                                    {item.name}
                                </span>
                            </div>
                        </NavLink>
                    ))}
                </div>

                <div className="mt-auto text-xs text-muted-foreground">
                    © 2026 SpendWise
                </div>
            </div>

            {/* MOBILE */}
            {open && (
                <div className="fixed inset-0 z-50 flex md:hidden">

                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />

                    <div className="relative w-64 h-full bg-[#0b0f19] border-r border-white/10 p-5 animate-slideIn">

                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-xl font-bold bg-linear-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">
                                SpendWise
                            </h1>

                            <button
                                onClick={() => setOpen(false)}
                                className="p-2 rounded-lg hover:bg-white/10"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {menu.map((item, i) => (
                                <NavLink
                                    key={i}
                                    to={item.path}
                                    onClick={() => setOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2.5 rounded-xl ${isActive
                                            ? "bg-linear-to-r from-indigo-500 to-cyan-500 text-white"
                                            : "text-muted-foreground hover:text-white hover:bg-white/10"
                                        }`
                                    }
                                >
                                    <item.icon size={18} />
                                    <span className="text-sm font-medium">
                                        {item.name}
                                    </span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}