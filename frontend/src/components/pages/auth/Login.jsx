import { useState } from "react";
import { useLoginMutation } from "@/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });

    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await login(form).unwrap();

            localStorage.setItem("access", res.access);
            dispatch(setCredentials({ access: res.access }));
            
            navigate("/dashboard");
        } catch (err) {
            alert("Invalid credentials");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            <Input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                }
                className="bg-white/5 border-white/10 focus:ring-indigo-500"
            />

            <Input
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                }
                className="bg-white/5 border-white/10"
            />

            <Button
                type="submit"
                className="w-full bg-linear-to-r from-indigo-500 to-cyan-500 hover:opacity-90"
                disabled={isLoading}
            >
                {isLoading ? "Logging in..." : "Login"}
            </Button>
        </form>
    );
}