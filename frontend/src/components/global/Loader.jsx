import { useSelector } from "react-redux";

export default function Loader() {
    const { loading } = useSelector((state) => state.ui);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}