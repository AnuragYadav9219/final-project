import { useDispatch, useSelector } from "react-redux";
import { closeAlert } from "@/features/ui/uiSlice";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info } from "lucide-react";

export default function AlertBox() {
    const dispatch = useDispatch();
    const { open, title, message, type } = useSelector(
        (state) => state.ui.alert
    );

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50">
            <div className="bg-card p-6 rounded-xl w-80 space-y-4">

                <div className="flex items-center gap-2">
                    {type === "warning" ? (
                        <AlertTriangle className="text-yellow-400" />
                    ) : (
                        <Info className="text-blue-400" />
                    )}
                    <h2 className="font-semibold">{title}</h2>
                </div>

                <p className="text-sm text-muted-foreground">{message}</p>

                <div className="flex justify-end">
                    <Button onClick={() => dispatch(closeAlert())}>
                        OK
                    </Button>
                </div>
            </div>
        </div>
    );
}