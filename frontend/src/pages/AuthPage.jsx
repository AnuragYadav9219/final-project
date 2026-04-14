import Login from "@/components/pages/auth/Login";
import Register from "@/components/pages/auth/Register";
import { useState } from "react";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-linear-to-br from-[#0a0a12] via-[#0f172a] to-[#020617]">

            {/* Glow Effects (same as layout) */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500 opacity-20 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500 opacity-20 blur-3xl rounded-full"></div>

            {/* Glass Card */}
            <div className="relative w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">

                {/* Logo */}
                <h1 className="text-3xl font-bold text-center mb-6 bg-linear-to-r from-indigo-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
                    SpendWise
                </h1>

                {/* Toggle */}
                <div className="flex mb-6 bg-white/5 rounded-xl p-1">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${isLogin
                                ? "bg-indigo-500 text-white"
                                : "text-muted-foreground"
                            }`}
                    >
                        Login
                    </button>

                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${!isLogin
                                ? "bg-cyan-500 text-white"
                                : "text-muted-foreground"
                            }`}
                    >
                        Register
                    </button>
                </div>

                {/* Form */}
                {isLogin ? <Login /> : <Register />}
            </div>
        </div>
    );
}