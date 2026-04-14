import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Navbar({ toggleSidebar, user }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div className="w-full h-16 px-4 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between sticky top-0 z-40">

            {/* LEFT */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden hover:bg-white/10 rounded-lg"
                    onClick={toggleSidebar}
                >
                    <Menu size={20} />
                </Button>

                <h1 className="font-semibold text-lg">Dashboard</h1>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">

                {/* User Info */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-7 h-7 flex items-center justify-center rounded-full bg-indigo-500 text-xs font-bold">
                        {user?.username?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm">{user?.username}</span>
                </div>

                {/* Profile */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/profile")}
                >
                    <User size={18} />
                </Button>

                {/* Logout */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-red-500/20 hover:text-red-400"
                    onClick={() => {
                        dispatch(logout());
                        navigate("/");
                    }}
                >
                    <LogOut size={18} />
                </Button>
            </div>
        </div>
    );
}