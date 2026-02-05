import { useRef } from "preact/hooks";
import EnvironmentSwitcher from "./EnvironmentSwitcher";
import AddCollectionButton, { Popover as AddCollectionPopover } from "./AddCollectionButton";
import Collections from "./Collections";
import { Tab, Workspace, Collection } from "../pages/Client/types";

interface ClientSidebarProps {
    sidebarWidth: number;
    activeWorkspace: Workspace | null;
    activeWorkspaceId: string | number | null;
    workspaces: Workspace[];
    switchWorkspace: (id: string | number) => void;
    setShowWorkspaceModal: (show: boolean) => void;
    setShowEnvironmentModal: (show: boolean) => void;
    showAddPopover: boolean;
    setShowAddPopover: (show: boolean) => void;
    newCollectionName: string;
    setNewCollectionName: (name: string) => void;
    addCollectionError: string;
    setAddCollectionError: (error: string) => void;
    handleAddCollection: (name: string) => void;
    collections: Collection[];
    collectionsLoading: boolean;
    handleDragEnd: (e: DragEvent) => void;
    handleDragStart: (e: DragEvent, item: any, type: string) => void;
    handleCollectionRename: (id: string, name: string) => Promise<boolean>;
    handleCollectionDelete: (id: string) => void;
    handleRequestRename: (id: string, name: string) => Promise<boolean>;
    handleRequestDelete: (id: string) => void;
    tabs: Tab[];
    setActiveTabId: (id: number) => void;
    setTabs: (tabs: Tab[]) => void;
    setCollections: (collections: Collection[]) => void;
    draggedItem: any;
    handleRequestMove: (requestId: string, targetCollectionId: string, sourceCollectionId?: string) => Promise<void>;
    activeTabId: number;
}

export default function ClientSidebar({
    sidebarWidth,
    activeWorkspace,
    activeWorkspaceId,
    workspaces,
    switchWorkspace,
    setShowWorkspaceModal,
    setShowEnvironmentModal,
    showAddPopover,
    setShowAddPopover,
    newCollectionName,
    setNewCollectionName,
    addCollectionError,
    setAddCollectionError,
    handleAddCollection,
    collections,
    collectionsLoading,
    handleDragEnd,
    handleDragStart,
    handleCollectionRename,
    handleCollectionDelete,
    handleRequestRename,
    handleRequestDelete,
    tabs,
    setActiveTabId,
    setTabs,
    setCollections,
    draggedItem,
    handleRequestMove,
    activeTabId,
}: ClientSidebarProps) {
    const addButtonRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    return (
        <div className="bg-base-100 border-r border-base-300 flex flex-col" style={{ width: `${sidebarWidth}px`, minWidth: `${sidebarWidth}px` }}>
            <div className="flex flex-col h-full overflow-hidden">
                <div className="p-4 pb-0 flex flex-col gap-4">
                    <div>
                        <div className="dropdown dropdown-bottom w-full">
                            <div tabIndex={0} role="button" className="btn btn-ghost w-full justify-between h-auto py-2 px-4 border border-base-300 hover:border-primary/50 bg-base-100/50 hover:bg-base-200">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col items-start overflow-hidden">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 ml-1">Workspace</span>
                                        <span className="truncate font-semibold text-sm max-w-[140px]">{activeWorkspace?.name || "Select Workspace"}</span>
                                    </div>
                                </div>
                                <svg className="w-4 h-4 opacity-50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4 4 4-4" />
                                </svg>
                            </div>
                            <ul tabIndex={0} className="dropdown-content z-[20] menu p-2 shadow-2xl bg-base-100 rounded-xl w-full mt-2 border border-base-300">
                                <div className="px-3 py-2 text-[10px] font-bold text-base-content/40 uppercase tracking-widest">Switch Workspace</div>
                                <div className="max-h-60 overflow-y-auto no-scrollbar px-1">
                                    {workspaces.map((workspace) => (
                                        <li key={workspace.id}>
                                            <button className={`flex items-center gap-3 py-3 px-3 rounded-lg ${activeWorkspaceId === workspace.id ? "bg-primary/10 text-primary font-bold" : ""}`} onClick={() => switchWorkspace(workspace.id)}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${activeWorkspaceId === workspace.id ? "bg-primary" : "bg-base-300"}`} />
                                                <span className="flex-1 truncate text-sm">{workspace.name}</span>
                                                {workspace.role && <span className="badge badge-sm">{workspace.role}</span>}
                                            </button>
                                        </li>
                                    ))}
                                </div>
                                <div className="divider my-1 opacity-50" />
                                <li>
                                    <button className="flex items-center gap-3 py-3 px-3 hover:bg-base-200 text-sm font-semibold rounded-lg" onClick={() => setShowWorkspaceModal(true)}>
                                        Manage Workspaces...
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <EnvironmentSwitcher onManageClick={() => setShowEnvironmentModal(true)} />
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 py-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-[10px] text-base-content/40 uppercase tracking-widest px-1">Collections</h3>
                        <div className="relative">
                            <AddCollectionButton
                                ref={addButtonRef}
                                onClick={() => {
                                    const next = !showAddPopover;
                                    setShowAddPopover(next);
                                    if (next) setAddCollectionError("");
                                }}
                                className="btn btn-ghost btn-xs btn-square"
                                title="Add Collection"
                            />
                            <AddCollectionPopover
                                showAddPopover={showAddPopover}
                                popoverRef={popoverRef}
                                sidebarWidth={sidebarWidth}
                                newCollectionName={newCollectionName}
                                handleAddCollection={handleAddCollection}
                                setShowAddPopover={setShowAddPopover}
                                setNewCollectionName={setNewCollectionName}
                                addCollectionError={addCollectionError}
                                setAddCollectionError={setAddCollectionError}
                            />
                        </div>
                    </div>
                    <Collections
                        collections={collections}
                        collectionsLoading={collectionsLoading}
                        handleDragEnd={handleDragEnd}
                        handleDragStart={handleDragStart}
                        handleCollectionRename={handleCollectionRename}
                        handleCollectionDelete={handleCollectionDelete}
                        handleRequestRename={handleRequestRename}
                        handleRequestDelete={handleRequestDelete}
                        tabs={tabs}
                        setActiveTabId={setActiveTabId}
                        setTabs={setTabs}
                        setCollections={setCollections}
                        draggedItem={draggedItem}
                        handleRequestMove={handleRequestMove}
                        activeTabId={activeTabId}
                    />
                </div>
            </div>
        </div>
    );
}
