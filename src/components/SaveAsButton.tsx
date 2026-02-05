import { forwardRef } from "preact/compat";
import { Collection } from "../pages/Client/types";

interface SaveButtonProps {
    [key: string]: any;
}

const SaveButton = forwardRef<HTMLButtonElement, SaveButtonProps>(({ ...props }, ref) => {
    return (
        <button ref={ref} {...props}>
            <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
            Save As
        </button>
    );
});

export default SaveButton;

interface PopoverProps {
    showSavePopover: boolean;
    savePopoverRef: any;
    saveRequestName: string;
    selectedCollectionId: string | number | null;
    saveAsError: string;
    handleSaveAs: () => void;
    setShowSavePopover: (show: boolean) => void;
    setSaveRequestName: (name: string) => void;
    setSelectedCollectionId: (id: string | number | null) => void;
    setSaveAsError: (error: string) => void;
    collections: Collection[];
}

export function Popover({
    showSavePopover,
    savePopoverRef,
    saveRequestName,
    selectedCollectionId,
    saveAsError,
    handleSaveAs,
    setShowSavePopover,
    setSaveRequestName,
    setSelectedCollectionId,
    setSaveAsError,
    collections,
}: PopoverProps) {
    if (showSavePopover) {
        return (
            <div
                ref={savePopoverRef}
                className="absolute right-0 top-12 z-50 bg-base-100 border border-base-300 rounded-lg shadow-lg p-4 w-80"
            >
                <h4 className="font-semibold text-sm mb-3">Save Request As</h4>

                {saveAsError && (
                    <div className="alert alert-error py-2 mb-3">
                        <span className="text-xs">{saveAsError}</span>
                    </div>
                )}

                <div className="space-y-3">
                    <div>
                        <label className="label py-1">
                            <span className="label-text text-xs">Request Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="My API Request"
                            className="input input-bordered input-sm w-full"
                            value={saveRequestName}
                            onChange={(e: any) => {
                                setSaveRequestName(e.target.value);
                                if (saveAsError) setSaveAsError("");
                            }}
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Enter" &&
                                    saveRequestName.trim() &&
                                    selectedCollectionId
                                ) {
                                    handleSaveAs();
                                } else if (e.key === "Escape") {
                                    setShowSavePopover(false);
                                    setSaveRequestName("");
                                    setSelectedCollectionId(null);
                                    setSaveAsError("");
                                }
                            }}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="label py-1">
                            <span className="label-text text-xs">Select Collection</span>
                        </label>
                        <select
                            className="select select-bordered select-sm w-full"
                            value={selectedCollectionId || ""}
                            onChange={(e: any) => {
                                setSelectedCollectionId(e.target.value);
                                if (saveAsError) setSaveAsError("");
                            }}
                        >
                            <option value="" disabled>
                                Choose a collection
                            </option>
                            {collections.map((collection) => (
                                <option key={collection.id} value={collection.id}>
                                    {collection.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleSaveAs}
                            className="btn btn-primary btn-sm flex-1"
                            disabled={!saveRequestName.trim() || !selectedCollectionId}
                        >
                            Save
                        </button>
                        <button
                            onClick={() => {
                                setShowSavePopover(false);
                                setSaveRequestName("");
                                setSelectedCollectionId(null);
                                setSaveAsError("");
                            }}
                            className="btn btn-ghost btn-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    return null;
}
