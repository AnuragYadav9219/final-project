import { useState } from "react";
import { useRegisterMutation } from "@/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [register, { isLoading }] = useRegisterMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await register(form).unwrap();

            dispatch(setCredentials({ access: res.access }));
            navigate("/dashboard");
        } catch (err) {
            console.log(err);
            alert(JSON.stringify(err?.data || err));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            <Input
                placeholder="Username"
                value={form.username}
                onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                }
                className="bg-white/5 border-white/10"
            />

            <Input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                }
                className="bg-white/5 border-white/10"
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
                className="w-full bg-linear-to-r from-cyan-500 to-indigo-500 hover:opacity-90"
                disabled={isLoading}
            >
                {isLoading ? "Creating account..." : "Register"}
            </Button>
        </form>
    );
}