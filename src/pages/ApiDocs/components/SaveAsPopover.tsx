interface SaveAsPopoverProps {
    popoverRef: any;
    name: string;
    onNameChange: (name: string) => void;
    onSave: () => void;
    onCancel: () => void;
    error: string;
    loading: boolean;
}

export default function SaveAsPopover({
    popoverRef,
    name,
    onNameChange,
    onSave,
    onCancel,
    error,
    loading
}: SaveAsPopoverProps) {
    return (
        <div
            ref={popoverRef}
            className="absolute right-0 top-full mt-2 w-80 bg-base-100 border border-base-300 rounded-xl shadow-xl z-50 p-4"
        >
            <h3 className="text-sm font-bold mb-3">Save Documentation As</h3>
            <div className="space-y-3">
                <div className="form-control">
                    <label className="label pb-1 pt-0">
                        <span className="label-text text-xs font-medium">New Name</span>
                    </label>
                    <input
                        type="text"
                        className="input input-sm input-bordered w-full"
                        value={name}
                        onInput={(e: any) => onNameChange(e.target.value)}
                        onKeyDown={(e: any) => {
                            if (e.key === "Enter") onSave();
                            if (e.key === "Escape") onCancel();
                        }}
                        placeholder="Enter documentation name"
                        autoFocus
                    />
                    {error && (
                        <p className="text-xs text-error mt-1">{error}</p>
                    )}
                </div>
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={onSave}
                        className="btn btn-primary btn-sm flex-1"
                        disabled={!name.trim() || loading}
                    >
                        Save As Copy
                    </button>
                    <button
                        onClick={onCancel}
                        className="btn btn-ghost btn-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
