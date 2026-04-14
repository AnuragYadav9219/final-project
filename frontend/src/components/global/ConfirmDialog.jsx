import { useDispatch, useSelector } from "react-redux";
import { closeConfirm } from "@/features/ui/uiSlice";
import { Button } from "@/components/ui/button";

export default function ConfirmDialog() {
    const dispatch = useDispatch();
    const { open, message, onConfirm } = useSelector(
        (state) => state.ui.confirm
    );

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50">
            <div className="bg-card p-6 rounded-xl w-80 space-y-4">
                <p>{message}</p>

                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => dispatch(closeConfirm())}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="bg-red-500 text-white"
                        onClick={() => {
                            onConfirm?.();
                            dispatch(closeConfirm());
                        }}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    );
}