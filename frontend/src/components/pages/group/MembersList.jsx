export default function MembersList({ members }) {
    return (
        <div className="flex flex-wrap gap-2">
            {members.map((m) => (
                <div
                    key={m.id}
                    className="px-3 py-1 bg-white/5 rounded-lg text-sm"
                >
                    {m.username}
                </div>
            ))}
        </div>
    );
}