export default function Section({ title, children }) {
    return (
        <div className="space-y-4">
            <h1 className="text-lg font-semibold">{title}</h1>
            {children}
        </div>
    );
}