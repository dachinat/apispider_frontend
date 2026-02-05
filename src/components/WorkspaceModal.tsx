import { useState, useEffect } from "preact/hooks";
import { useWorkspace } from "../context/WorkspaceContext";

interface WorkspaceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface EditingWorkspace {
    id: string | number;
    name: string;
    description?: string;
    role?: string;
}

export default function WorkspaceModal({ isOpen, onClose }: WorkspaceModalProps) {
    const {
        workspaces,
        createWorkspace,
        updateWorkspace,
        deleteWorkspace,
        activeWorkspaceId,
        refreshWorkspaces
    } = useWorkspace();

    const [editingWorkspaces, setEditingWorkspaces] = useState<EditingWorkspace[]>([]);
    const [originalWorkspaces, setOriginalWorkspaces] = useState<EditingWorkspace[]>([]);
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize editing state when modal opens
    useEffect(() => {
        if (isOpen) {
            const nextEditing = workspaces.map(ws => ({ ...ws }));
            setEditingWorkspaces(nextEditing);
            setOriginalWorkspaces(nextEditing);
            setError(null);

            const hasActive = nextEditing.some(ws => ws.id === activeWorkspaceId);
            const nextSelected = hasActive
                ? activeWorkspaceId
                : nextEditing.length > 0
                    ? nextEditing[0].id
                    : null;

            setSelectedWorkspaceId(prev => {
                if (prev !== null && nextEditing.some(ws => ws.id === prev)) {
                    return prev;
                }
                return nextSelected;
            });
        }
    }, [isOpen, workspaces, activeWorkspaceId]);

    const handleAddWorkspace = () => {
        const newWorkspace: EditingWorkspace = {
            id: `new-${Date.now()}`,
            name: "New Workspace",
            description: "",
            role: "admin",
        };
        setEditingWorkspaces([...editingWorkspaces, newWorkspace]);
        setSelectedWorkspaceId(newWorkspace.id);
    };

    const handleUpdateField = (id: string | number, field: keyof EditingWorkspace, value: string) => {
        setEditingWorkspaces(prev =>
            prev.map(ws => (ws.id === id ? { ...ws, [field]: value } : ws))
        );
    };

    const handleDelete = async (id: string | number) => {
        // Check if it's a new unsaved workspace
        if (typeof id === 'string' && id.startsWith('new-')) {
            setEditingWorkspaces(prev => {
                const next = prev.filter(ws => String(ws.id) !== String(id));
                setSelectedWorkspaceId(prevSelected =>
                    String(prevSelected) === String(id)
                        ? (next.length > 0 ? next[0].id : null)
                        : prevSelected
                );
                return next;
            });
            return;
        }

        // Delete from backend
        try {
            setLoading(true);
            setError(null);
            await deleteWorkspace(String(id));
            setEditingWorkspaces(prev => {
                const next = prev.filter(ws => String(ws.id) !== String(id));
                setSelectedWorkspaceId(prevSelected =>
                    String(prevSelected) === String(id)
                        ? (next.length > 0 ? next[0].id : null)
                        : prevSelected
                );
                return next;
            });
        } catch (err: any) {
            setError(err.message || "Failed to delete workspace");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            setError(null);

            const originalById = new Map<string, EditingWorkspace>(
                originalWorkspaces
                    .filter(ws => typeof ws.id !== 'string' || !ws.id.startsWith('new-'))
                    .map(ws => [String(ws.id), ws])
            );

            let didMutate = false;

            // Process each workspace
            for (const ws of editingWorkspaces) {
                const workspaceData = {
                    name: ws.name,
                    description: ws.description || "",
                };

                // Check if new or existing
                if (typeof ws.id === 'string' && ws.id.startsWith('new-')) {
                    // Create new workspace
                    await createWorkspace(workspaceData);
                    didMutate = true;
                } else {
                    const original = originalById.get(String(ws.id));
                    if (!original) {
                        continue;
                    }

                    const canEdit = !ws.role || ws.role === "admin";
                    const nameChanged = (ws.name || "") !== (original.name || "");
                    const descriptionChanged = (ws.description || "") !== (original.description || "");
                    const shouldUpdate = canEdit && (nameChanged || descriptionChanged);

                    if (shouldUpdate) {
                        await updateWorkspace(String(ws.id), workspaceData);
                        didMutate = true;
                    }
                }
            }

            if (!didMutate) {
                onClose();
                return;
            }

            // Refresh workspaces from server
            await refreshWorkspaces();
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to save workspaces");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const selectedWorkspace =
        editingWorkspaces.find(ws => ws.id === selectedWorkspaceId) ||
        editingWorkspaces[0] ||
        null;

    const canEditSelected =
        !selectedWorkspace?.role || selectedWorkspace.role === "admin";

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-5xl w-full">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Manage Workspaces</h2>
                        <p className="text-sm opacity-70 mt-1">Organize and configure your workspaces</p>
                    </div>
                    <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose} disabled={loading}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="alert alert-error mb-4">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="md:col-span-2">
                        <div className="border border-base-300 rounded-xl bg-base-100 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-base-300 bg-base-200/40">
                                <div className="text-xs font-bold uppercase tracking-widest opacity-60">
                                    Workspaces
                                </div>
                                <button
                                    className="btn btn-outline btn-xs gap-2"
                                    onClick={handleAddWorkspace}
                                    disabled={loading}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add
                                </button>
                            </div>

                            {editingWorkspaces.length === 0 ? (
                                <div className="p-6 text-center">
                                    <p className="text-sm opacity-60 mb-4">No workspaces yet</p>
                                    <button
                                        className="btn btn-sm btn-outline"
                                        onClick={handleAddWorkspace}
                                        disabled={loading}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Workspace
                                    </button>
                                </div>
                            ) : (
                                <div className="max-h-96 overflow-y-auto no-scrollbar">
                                    {editingWorkspaces.map((workspace) => {
                                        const isActive = workspace.id === activeWorkspaceId;
                                        const isSelected = workspace.id === selectedWorkspace?.id;

                                        return (
                                            <button
                                                key={workspace.id}
                                                className={`w-full text-left px-4 py-3 border-b border-base-300 last:border-b-0 transition-colors ${isSelected
                                                    ? "bg-primary/10"
                                                    : "hover:bg-base-200/40"
                                                    }`}
                                                onClick={() => setSelectedWorkspaceId(workspace.id)}
                                                disabled={loading}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-2 h-2 rounded-full flex-shrink-0 ${isSelected
                                                            ? "bg-primary"
                                                            : "bg-base-300"
                                                            }`}
                                                    ></div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div className="truncate font-semibold text-sm">
                                                                {workspace.name}
                                                            </div>
                                                            {workspace.role && (
                                                                <span
                                                                    className={`badge badge-sm flex-shrink-0 ${workspace.role === "admin"
                                                                        ? "badge-primary"
                                                                        : workspace.role === "editor"
                                                                            ? "badge-accent"
                                                                            : "badge-ghost opacity-70"
                                                                        }`}
                                                                >
                                                                    {workspace.role}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                            {isActive && (
                                                                <span className="badge badge-accent badge-sm">Active</span>
                                                            )}
                                                            {!isActive && (
                                                                <span className="badge badge-ghost badge-sm opacity-60">Workspace</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        {!selectedWorkspace ? (
                            <div className="border border-dashed border-base-300 rounded-xl p-10 text-center bg-base-200/30">
                                <p className="text-sm opacity-60">Select a workspace to edit its details</p>
                            </div>
                        ) : (
                            <div className="card border border-base-300 bg-base-100">
                                <div className="card-body p-5">
                                    <div className="flex items-start gap-4">
                                        {/* Workspace Icon */}
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${selectedWorkspace.id === activeWorkspaceId
                                            ? "bg-primary/20 text-primary"
                                            : "bg-base-200 text-base-content/60"
                                            }`}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>

                                        {/* Main Content */}
                                        <div className="flex-1 space-y-4 min-w-0">
                                            {/* Name Field */}
                                            <div>
                                                <label className="label py-1">
                                                    <span className="label-text text-xs font-semibold opacity-70">Workspace Name</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="input input-bordered w-full input-sm"
                                                    value={selectedWorkspace.name}
                                                    onInput={(e) => handleUpdateField(selectedWorkspace.id, "name", (e.target as HTMLInputElement).value)}
                                                    disabled={loading || !canEditSelected}
                                                    placeholder="Enter workspace name"
                                                />
                                            </div>

                                            {/* Description Field */}
                                            <div>
                                                <label className="label py-1">
                                                    <span className="label-text text-xs font-semibold opacity-70">Description</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="input input-bordered w-full input-sm"
                                                    value={selectedWorkspace.description || ""}
                                                    onInput={(e) => handleUpdateField(selectedWorkspace.id, "description", (e.target as HTMLInputElement).value)}
                                                    disabled={loading || !canEditSelected}
                                                    placeholder="Optional description"
                                                />
                                            </div>

                                            {/* Status Badges and Actions */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {/* Status Badges */}
                                                <div className="flex items-center gap-2 flex-1">
                                                    {selectedWorkspace.id === activeWorkspaceId && (
                                                        <span className="badge badge-accent badge-sm gap-1.5">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                            Active
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                                                        onClick={() => handleDelete(selectedWorkspace.id)}
                                                        disabled={
                                                            loading ||
                                                            !canEditSelected ||
                                                            editingWorkspaces.length === 1
                                                        }
                                                        title={
                                                            !canEditSelected
                                                                ? "Insufficient permissions"
                                                                :
                                                                editingWorkspaces.length === 1
                                                                    ? "Cannot delete your only workspace"
                                                                    : "Delete workspace"
                                                        }
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="modal-action mt-6">
                    <button className="btn btn-ghost" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={loading || editingWorkspaces.length === 0}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
