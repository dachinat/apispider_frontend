import { forwardRef } from "preact/compat";
import { useRef } from "preact/hooks";
import { JSX } from "preact";

const AddCollectionButton = forwardRef<HTMLButtonElement, JSX.HTMLAttributes<HTMLButtonElement>>(({ ...props }, ref) => {
    return (
        <button ref={ref} {...props}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
        </button>
    );
});

export default AddCollectionButton;

interface PopoverProps {
    showAddPopover: boolean;
    popoverRef: any;
    sidebarWidth: number;
    newCollectionName: string;
    handleAddCollection: (name: string) => void;
    setShowAddPopover: (show: boolean) => void;
    setNewCollectionName: (name: string) => void;
    addCollectionError: string;
    setAddCollectionError: (error: string) => void;
}

export function Popover({
    showAddPopover,
    popoverRef,
    sidebarWidth,
    newCollectionName,
    handleAddCollection,
    setShowAddPopover,
    setNewCollectionName,
    addCollectionError,
    setAddCollectionError,
}: PopoverProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    if (!showAddPopover) return null;

    return (
        <div
            ref={popoverRef}
            className="absolute right-0 top-8 z-50 bg-base-100 border border-base-300 rounded-lg shadow-lg p-3"
            style={{ width: `${Math.min(sidebarWidth - 32, 280)}px` }}
        >
            <h4 className="font-semibold text-sm mb-2">New Collection</h4>

            {addCollectionError && (
                <div className="alert alert-error py-2 mb-2">
                    <span className="text-xs">{addCollectionError}</span>
                </div>
            )}

            <input
                ref={inputRef}
                type="text"
                placeholder="Collection name"
                className="input input-bordered input-sm w-full mb-2"
                value={newCollectionName}
                onInput={(e) => {
                    setNewCollectionName((e.target as HTMLInputElement).value);
                    if (addCollectionError) setAddCollectionError("");
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCollection((e.target as HTMLInputElement).value);
                    } else if (e.key === "Escape") {
                        setShowAddPopover(false);
                        setNewCollectionName("");
                        setAddCollectionError("");
                    }
                }}
                autoFocus
            />
            <div className="flex gap-2">
                <button
                    onClick={() => handleAddCollection(inputRef.current?.value || "")}
                    className="btn btn-primary btn-sm flex-1"
                >
                    Add
                </button>
                <button
                    onClick={() => {
                        setShowAddPopover(false);
                        setNewCollectionName("");
                        setAddCollectionError("");
                    }}
                    className="btn btn-ghost btn-sm"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
