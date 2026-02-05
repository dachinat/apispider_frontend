import AvatarMembers from "../../../components/AvatarMembers";
import SaveButton from "../../../components/SaveButton";
import { Popover as SaveAsPopover, default as SaveAsButton } from "../../../components/SaveAsButton";
import { Tab, Collection } from "../types";

interface ClientHeaderProps {
    currentTab: Tab | null;
    addNewTab: () => void;
    handleShare: () => void;
    handleSave: () => void;
    openSaveAsPopover: () => void;
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
    agentAvailable: boolean;
    checkingAgent: boolean;
    agentPermissionNeeded: boolean;
    checkAgentAvailability: (silent?: boolean) => void;
}

export default function ClientHeader({
    currentTab,
    addNewTab,
    handleShare,
    handleSave,
    openSaveAsPopover,
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
    agentAvailable,
    checkingAgent,
    agentPermissionNeeded,
    checkAgentAvailability,
}: ClientHeaderProps) {
    return (
        <>
            <AvatarMembers />
            <div className="flex items-center gap-1.5 p-1 bg-base-200/50 rounded-xl border border-base-300 mr-2">
                <button
                    onClick={() => addNewTab()}
                    className="btn btn-ghost btn-sm h-8 min-h-0 px-3 gap-2 text-xs font-bold hover:bg-base-200"
                    title="Start a new request"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New
                </button>

                <div className="w-px h-4 bg-base-300 mx-1"></div>

                <button
                    onClick={handleShare}
                    className="btn btn-ghost btn-sm h-8 min-h-0 px-3 gap-2 text-xs font-bold hover:bg-base-200"
                    disabled={!currentTab || !currentTab.url || !currentTab.url.trim()}
                    title="Share this request"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                </button>

                <div className="w-px h-4 bg-base-300 mx-1"></div>

                <SaveButton
                    onClick={handleSave}
                    className="btn btn-ghost btn-sm h-8 min-h-0 px-3 gap-2 text-xs font-bold hover:bg-base-200"
                    disabled={!currentTab || currentTab.saved || !currentTab.savedRequestId || !currentTab.url || !currentTab.url.trim()}
                    title={!currentTab?.url || !currentTab?.url.trim() ? "Please enter a URL to save" : "Save changes"}
                />

                <div className="w-px h-4 bg-base-300 mx-1"></div>

                <div className="relative">
                    <SaveAsButton
                        onClick={openSaveAsPopover}
                        className="btn btn-ghost btn-sm h-8 min-h-0 px-3 gap-2 text-xs font-bold hover:bg-base-200"
                        title={!currentTab?.url || !currentTab?.url.trim() ? "Please enter a URL to save the request" : "Save as new request"}
                        disabled={!currentTab || !currentTab.requestType || !currentTab.url || !currentTab.url.trim()}
                    />
                    <SaveAsPopover
                        showSavePopover={showSavePopover}
                        savePopoverRef={savePopoverRef}
                        saveRequestName={saveRequestName}
                        selectedCollectionId={selectedCollectionId}
                        saveAsError={saveAsError}
                        handleSaveAs={handleSaveAs}
                        setShowSavePopover={setShowSavePopover}
                        setSaveRequestName={setSaveRequestName}
                        setSelectedCollectionId={setSelectedCollectionId}
                        setSaveAsError={setSaveAsError}
                        collections={collections}
                    />
                </div>
            </div>

            <div className="flex items-center gap-1.5 p-1 mr-2">
                <button
                    onClick={() => checkAgentAvailability(true)}
                    disabled={checkingAgent}
                    className={`flex items-center gap-2 px-3 h-8 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all duration-300 hover:brightness-110 active:scale-95 ${agentAvailable
                        ? "bg-success/5 border-success/20 text-success"
                        : agentPermissionNeeded
                            ? "bg-warning/10 border-warning/30 text-warning"
                            : "bg-base-200/50 border-base-300 text-base-content/40"
                        }`}
                    title={agentAvailable ? "Local Agent Connected (Click to re-check)" : checkingAgent ? "Checking Agent..." : agentPermissionNeeded ? "Local network access permission needed (Click to connect)" : "Agent Offline (Click to retry)"}
                >
                    <div className={`w-1.5 h-1.5 rounded-full ${agentAvailable ? "bg-success animate-pulse" : checkingAgent ? "bg-base-content/40 animate-pulse" : agentPermissionNeeded ? "bg-warning animate-pulse" : "bg-base-content/20"}`}></div>
                    {agentAvailable ? "Agent Online" : checkingAgent ? "Checking..." : agentPermissionNeeded ? "Connect Agent" : "Agent Offline"}
                </button>
            </div>
        </>
    );
}
