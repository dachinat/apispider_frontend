import CommonLayout from "../../components/CommonLayout";
import ConfirmModal from "../../components/ConfirmModal";
import SpiderSpinner from "../../components/SpiderSpinner";
import TabsBar from "../../components/TabsBar";
import AvatarMembers from "../../components/AvatarMembers";
import { useApiDocs } from "./hooks/useApiDocs";

// Components
import ApiDocsSidebar from "./components/ApiDocsSidebar";
import ApiDocsHeader from "./components/ApiDocsHeader";
import BasicInfoSection from "./components/BasicInfoSection";
import CollectionsSection from "./components/CollectionsSection";
import AppearanceSection from "./components/AppearanceSection";
import SaveAsPopover from "./components/SaveAsPopover";
import EmptyState from "./components/EmptyState";

export default function ApiDocs() {
    const {
        docs,
        collections,
        loading,
        deleteModalOpen,
        setDeleteModalOpen,
        docToDelete,
        showSavePopover,
        setShowSavePopover,
        saveRequestName,
        setSaveRequestName,
        saveAsError,
        setSaveAsError,
        savePopoverRef,
        saveButtonRef,
        tabs,
        activeTabId,
        setActiveTabId,
        editingDocId,
        editingName,
        setEditingName,
        sidebarInputRef,
        saveOnBlur,
        sidebarWidth,
        isResizingSidebar,
        currentTab,
        getDocUrl,
        updateCurrentTab,
        handleNewDoc,
        handleSelectDoc,
        handleSave,
        handleRefreshSnapshot,
        closeTab,
        handleDeleteClick,
        handleDeleteConfirm,
        handleSaveAs,
        startEditing,
        saveEdit,
        cancelEdit,
        startResizingSidebar,
        handleLogoUpload,
    } = useApiDocs();

    const handlePreview = () => {
        if (currentTab?.slug) {
            window.open(getDocUrl(currentTab.slug), "_blank");
        }
    };

    const buttons = (
        <div className="flex items-center gap-4">
            <AvatarMembers />
            <div className="relative flex items-center bg-base-200/50 rounded-lg p-1 border border-base-300 gap-1">
                <button
                    onClick={handleNewDoc}
                    className="btn btn-ghost btn-sm h-8 min-h-0 px-3 gap-2 text-xs font-bold hover:bg-base-100"
                    title="Create New API Doc"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Doc
                </button>

                <div className="w-px h-4 bg-base-300 mx-1"></div>

                <button
                    onClick={handleSave}
                    className="btn btn-ghost btn-sm h-8 min-h-0 px-3 gap-2 text-xs font-bold hover:bg-base-100"
                    disabled={loading || !currentTab}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Doc
                </button>

                <button
                    ref={saveButtonRef}
                    onClick={() => setShowSavePopover(!showSavePopover)}
                    className="btn btn-ghost btn-sm h-8 min-h-0 px-3 gap-2 text-xs font-bold hover:bg-base-100"
                    title="Save Doc As"
                    disabled={loading || !currentTab}
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Doc As
                </button>

                {showSavePopover && (
                    <SaveAsPopover
                        popoverRef={savePopoverRef}
                        name={saveRequestName}
                        onNameChange={setSaveRequestName}
                        onSave={handleSaveAs}
                        onCancel={() => setShowSavePopover(false)}
                        error={saveAsError}
                        loading={loading}
                    />
                )}
            </div>
        </div>
    );

    return (
        <CommonLayout activeActivity="api" buttons={buttons}>
            <div className="h-full flex bg-base-100 overflow-hidden">
                <ApiDocsSidebar
                    width={sidebarWidth}
                    docs={docs}
                    currentDocId={currentTab?.docId || null}
                    editingDocId={editingDocId}
                    editingName={editingName}
                    inputRef={sidebarInputRef}
                    onSelectDoc={handleSelectDoc}
                    onNewDoc={handleNewDoc}
                    onStartEditing={startEditing}
                    onSaveEdit={saveEdit}
                    onCancelEdit={cancelEdit}
                    onDeleteClick={handleDeleteClick}
                    onInputChange={setEditingName}
                    saveOnBlur={saveOnBlur}
                />

                {/* Sidebar Resizer */}
                <div
                    onMouseDown={startResizingSidebar}
                    className={`group w-1.5 hover:w-2 cursor-col-resize z-20 transition-all flex items-center justify-center ${isResizingSidebar ? "bg-primary/20 w-2" : "bg-transparent"}`}
                >
                    <div
                        className={`w-0.5 h-8 rounded-full transition-all ${isResizingSidebar
                            ? "bg-primary"
                            : "bg-base-300 group-hover:bg-primary/50"
                            }`}
                    />
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                    {loading && (
                        <div className="absolute inset-0 bg-base-100/60 z-50 flex flex-col items-center justify-center">
                            <SpiderSpinner className="w-12 h-12" />
                            <span className="text-xs text-base-content/40 mt-4 font-bold uppercase tracking-widest">
                                Processing Doc...
                            </span>
                        </div>
                    )}
                    <TabsBar
                        tabs={tabs}
                        activeTabId={activeTabId}
                        setActiveTabId={setActiveTabId}
                        addNewTab={handleNewDoc}
                        closeTab={closeTab}
                    />

                    <div className="flex-1 overflow-y-auto relative bg-base-100">
                        {currentTab ? (
                            <div className="max-w-[1000px] mx-auto p-12 lg:p-16">
                                <ApiDocsHeader
                                    currentTab={currentTab}
                                    loading={loading}
                                    onUpdateTab={updateCurrentTab}
                                    onPreview={handlePreview}
                                    onRefreshSnapshot={handleRefreshSnapshot}
                                    getDocUrl={getDocUrl}
                                />

                                <div className="space-y-8">
                                    <BasicInfoSection
                                        currentTab={currentTab}
                                        onUpdateTab={updateCurrentTab}
                                    />

                                    <CollectionsSection
                                        currentTab={currentTab}
                                        collections={collections}
                                        onUpdateTab={updateCurrentTab}
                                    />

                                    <AppearanceSection
                                        currentTab={currentTab}
                                        onUpdateTab={updateCurrentTab}
                                        handleLogoUpload={handleLogoUpload}
                                    />
                                </div>
                            </div>
                        ) : (
                            <EmptyState onNewDoc={handleNewDoc} />
                        )}
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Documentation"
                message={`Are you sure you want to delete "${docToDelete?.name}"? This will permanently remove the public documentation.`}
                confirmClass="btn-error"
                confirmText="Delete"
            />
        </CommonLayout>
    );
}
