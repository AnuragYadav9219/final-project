// import { useNavigate } from "react-router-dom";
// import { useGetGroupsQuery } from "@/features/group/groupApi";

// import { Plus, Users } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Loader from "@/components/global/Loader";
// import { useState } from "react";
// import CreateGroupModal from "./CreateGroupModal";

// export default function Groups() {
//     const navigate = useNavigate();

//     const [open, setOpen] = useState(false);

//     const { data = [], isLoading } = useGetGroupsQuery();

//     if (isLoading) return <Loader />;

//     return (
//         <div className="space-y-8">

//             {/* HEADER */}
//             <div className="flex justify-between items-center">
//                 <div>
//                     <h1 className="text-2xl font-bold">Groups</h1>
//                     <p className="text-sm text-muted-foreground">
//                         Manage your shared groups
//                     </p>
//                 </div>

//                 <Button
//                     onClick={() => setOpen(true)}
//                     className="bg-linear-to-r from-indigo-500 to-cyan-500"
//                 >
//                     <Plus size={16} />
//                     Create Group
//                 </Button>
//             </div>

//             {/* GROUP LIST */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {data.map((group) => (
//                     <div
//                         key={group.id}
//                         onClick={() => navigate(`/groups/${group.id}`)}
//                         className="cursor-pointer p-5 rounded-2xl bg-white/5 border border-white/10 hover:scale-[1.02] transition"
//                     >
//                         <div className="flex items-center gap-3">
//                             <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
//                                 <Users size={18} />
//                             </div>

//                             <div>
//                                 <h2 className="font-semibold">{group.name}</h2>
//                                 <p className="text-xs text-muted-foreground">
//                                     {group.members?.length || 0} members
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             <CreateGroupModal
//                 open={open}
//                 onClose={() => setOpen(false)}
//             />

//             {data.length === 0 && (
//                 <p className="text-center text-muted-foreground">
//                     No groups yet. Create one
//                 </p>
//             )}
//         </div>
//     );
// }













import { useNavigate } from "react-router-dom";
import { useGetGroupsQuery } from "@/features/group/groupApi";

import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/global/Loader";
import { useState } from "react";
import CreateGroupModal from "./CreateGroupModal";

export default function Groups() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const { data = [], isLoading } = useGetGroupsQuery();

    if (isLoading) return <Loader />;

    return (
        <div className="space-y-10">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Your Groups
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Track expenses, split bills, and manage groups easily
                    </p>
                </div>

                <Button
                    onClick={() => setOpen(true)}
                    className="bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:opacity-90 transition shadow-lg"
                >
                    <Plus size={16} />
                    Create Group
                </Button>
            </div>

            {/* EMPTY STATE */}
            {data.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                    <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-400 mb-4">
                        <Users size={28} />
                    </div>

                    <h2 className="text-lg font-semibold">No Groups Yet</h2>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                        Start by creating a group to split expenses with friends,
                        roommates, or trips.
                    </p>

                    <Button
                        onClick={() => setOpen(true)}
                        className="mt-5 bg-linear-to-r from-indigo-500 to-cyan-500"
                    >
                        <Plus size={16} />
                        Create Your First Group
                    </Button>
                </div>
            )}

            {/* GROUP GRID */}
            {data.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                    {data.map((group) => (
                        <div
                            key={group.id}
                            onClick={() => navigate(`/groups/${group.id}`)}
                            className="group relative cursor-pointer p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Glow Effect */}
                            <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-indigo-500/0 via-indigo-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition" />

                            <div className="relative flex items-center gap-4">
                                
                                {/* ICON */}
                                <div className="p-3 rounded-xl bg-linear-to-br from-indigo-500/20 to-cyan-500/20 text-indigo-400">
                                    <Users size={20} />
                                </div>

                                {/* CONTENT */}
                                <div className="flex-1">
                                    <h2 className="font-semibold text-base group-hover:text-indigo-400 transition">
                                        {group.name}
                                    </h2>

                                    <p className="text-xs text-muted-foreground mt-1">
                                        {group.members?.length || 0} members
                                    </p>
                                </div>
                            </div>

                            {/* FOOTER */}
                            <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
                                <span>View details →</span>
                            </div>
                        </div>
                    ))}

                </div>
            )}

            {/* MODAL */}
            <CreateGroupModal
                open={open}
                onClose={() => setOpen(false)}
            />
        </div>
    );
}