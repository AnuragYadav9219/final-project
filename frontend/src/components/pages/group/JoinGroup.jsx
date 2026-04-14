// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import { useAcceptInviteMutation } from "@/features/group/groupApi";

// export default function JoinGroup() {
//     const { token } = useParams();
//     const navigate = useNavigate();

//     const [acceptInvite] = useAcceptInviteMutation();

//     useEffect(() => {
//         const join = async () => {
//             try {
//                 await acceptInvite(token).unwrap();
//                 alert("Joined successfully!");
//                 navigate("/dashboard");
//             } catch {
//                 alert("Invalid or expired invite");
//             }
//         };

//         join();
//     }, [token]);

//     return (
//         <div className="h-screen flex items-center justify-center">
//             <p>Joining group...</p>
//         </div>
//     );
// }














import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAcceptInviteMutation } from "@/features/group/groupApi";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function JoinGroup() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [acceptInvite] = useAcceptInviteMutation();
    const [status, setStatus] = useState("loading"); // loading | success | error

    useEffect(() => {
        const join = async () => {
            try {
                await acceptInvite(token).unwrap();
                setStatus("success");

                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000);
            } catch {
                setStatus("error");
            }
        };

        join();
    }, [token]);

    return (
        <div className="h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-gray-900 to-black text-white">
            
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-8 w-87.5 text-center">
                
                {/* LOADING */}
                {status === "loading" && (
                    <>
                        <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-400" />
                        <h2 className="mt-4 text-xl font-semibold">Joining Group...</h2>
                        <p className="text-sm text-gray-400 mt-2">
                            Please wait while we add you to the group.
                        </p>
                    </>
                )}

                {/* SUCCESS */}
                {status === "success" && (
                    <>
                        <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
                        <h2 className="mt-4 text-xl font-semibold">Welcome 🎉</h2>
                        <p className="text-sm text-gray-400 mt-2">
                            You have successfully joined the group.
                        </p>
                        <p className="text-xs text-gray-500 mt-3">
                            Redirecting to dashboard...
                        </p>
                    </>
                )}

                {/* ERROR */}
                {status === "error" && (
                    <>
                        <XCircle className="mx-auto h-12 w-12 text-red-400" />
                        <h2 className="mt-4 text-xl font-semibold">Invalid Invite</h2>
                        <p className="text-sm text-gray-400 mt-2">
                            This invite link is expired or incorrect.
                        </p>

                        <button
                            onClick={() => navigate("/")}
                            className="mt-5 w-full bg-red-500 hover:bg-red-600 transition rounded-lg py-2 text-sm font-medium"
                        >
                            Go Home
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}