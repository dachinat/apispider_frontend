import CommonLayout from "../../components/CommonLayout";
import ConfirmModal from "../../components/ConfirmModal";
import SpiderSpinner from "../../components/SpiderSpinner";
import TabsBar from "../../components/TabsBar";
import SaveButton from "../../components/SaveButton";
import MockSaveAsButton, {
  Popover as SaveAsPopover,
} from "../../components/MockSaveAsButton";
import AvatarMembers from "../../components/AvatarMembers";
import { useMocks } from "./hooks/useMocks";

// Components
import MocksSidebar from "./components/MocksSidebar";
import MocksHeader from "./components/MocksHeader";
import EndpointsSection from "./components/EndpointsSection";
import EmptyState from "./components/EmptyState";

export default function Mocks() {
  const {
    mocks,
    loading,
    deleteModalOpen,
    setDeleteModalOpen,
    editingMockId,
    editingName,
    setEditingName,
    mockToDelete,
    sidebarInputRef,
    saveOnBlur,
    sidebarWidth,
    isResizingSidebar,
    tabs,
    activeTabId,
    setActiveTabId,
    showSavePopover,
    setShowSavePopover,
    saveRequestName,
    setSaveRequestName,
    saveAsError,
    setSaveAsError,
    savePopoverRef,
    saveButtonRef,
    mockConfig,
    currentTab,
    getMockBaseUrl,
    startResizingSidebar,
    addNewTab,
    closeTab,
    updateCurrentTab,
    handleSelectMock,
    handleAddEndpoint,
    handleRemoveEndpoint,
    handleEndpointChange,
    handleSave,
    handleSaveAsClick,
    handleSaveAs,
    startEditing,
    saveEdit,
    cancelEdit,
    handleDeleteClick,
    handleDeleteConfirm,
    handleSaveToEnv,
  } = useMocks();

  const buttons = (
    <div className="flex items-center gap-4">
      <AvatarMembers />
      <div className="flex items-center bg-base-200 rounded-lg p-1 border border-base-300 gap-1">
        <button
          onClick={addNewTab}
          className="btn btn-ghost btn-sm h-8 rounded-md px-3 gap-2 text-xs font-bold hover:bg-base-100 transition-colors"
        >
          <svg
            className="w-4 h-4 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Mock
        </button>
        <div className="w-px h-4 bg-base-300 mx-1"></div>
        <SaveButton
          onClick={handleSave}
          className="btn btn-ghost btn-sm h-8 rounded-md px-3 gap-2 text-xs font-bold hover:bg-base-100 transition-colors"
          disabled={loading || !currentTab}
        >
          Save
        </SaveButton>
        <div className="w-px h-4 bg-base-300 mx-1"></div>
        <div className="relative">
          <MockSaveAsButton
            ref={saveButtonRef}
            className="btn btn-ghost btn-sm h-8 rounded-md px-3 gap-2 text-xs font-bold hover:bg-base-100 transition-colors"
            onClick={handleSaveAsClick}
            disabled={loading || !currentTab}
          />
          <SaveAsPopover
            showSavePopover={showSavePopover}
            savePopoverRef={savePopoverRef}
            saveRequestName={saveRequestName}
            saveAsError={saveAsError}
            handleSaveAs={handleSaveAs}
            setShowSavePopover={setShowSavePopover}
            setSaveRequestName={setSaveRequestName}
            setSaveAsError={setSaveAsError}
          />
        </div>
      </div>
    </div>
  );

  return (
    <CommonLayout activeActivity="mocks" buttons={buttons}>
      <div className="h-full flex bg-base-100 overflow-hidden">
        <MocksSidebar
          width={sidebarWidth}
          mocks={mocks}
          currentMockId={currentTab?.mockId || null}
          editingMockId={editingMockId}
          editingName={editingName}
          inputRef={sidebarInputRef}
          onSelectMock={handleSelectMock}
          onAddNewTab={addNewTab}
          onStartEditing={startEditing}
          onSaveEdit={saveEdit}
          onCancelEdit={cancelEdit}
          onDeleteClick={handleDeleteClick}
          setEditingName={setEditingName}
          saveOnBlur={saveOnBlur}
        />

        <div
          onMouseDown={startResizingSidebar}
          className={`group w-px hover:w-1 cursor-col-resize z-20 transition-all flex items-center justify-center bg-base-300 hover:bg-primary ${isResizingSidebar ? "bg-primary w-1" : ""}`}
        />

        <div className="flex-1 flex flex-col h-full overflow-hidden bg-base-100 relative">
          {loading && (
            <div className="absolute inset-0 bg-base-100/60 z-50 flex flex-col items-center justify-center">
              <SpiderSpinner className="w-12 h-12" />
              <span className="text-xs text-base-content/40 mt-4 font-bold uppercase tracking-widest">
                Provisioning...
              </span>
            </div>
          )}
          <TabsBar
            tabs={tabs}
            activeTabId={activeTabId}
            setActiveTabId={setActiveTabId}
            addNewTab={addNewTab}
            closeTab={closeTab}
          />

          <div className="flex-1 overflow-y-auto relative bg-base-100">
            {currentTab ? (
              <div className="max-w-6xl mx-auto p-12">
                <MocksHeader
                  currentTab={currentTab}
                  mockConfig={mockConfig}
                  getMockBaseUrl={getMockBaseUrl}
                  updateCurrentTab={updateCurrentTab}
                  onSaveToEnv={handleSaveToEnv}
                  onDeleteClick={() => handleDeleteClick()}
                />

                <EndpointsSection
                  endpoints={currentTab.endpoints}
                  mockConfig={mockConfig}
                  onAdd={handleAddEndpoint}
                  onRemove={handleRemoveEndpoint}
                  onChange={handleEndpointChange}
                />
              </div>
            ) : (
              <EmptyState onAddNewTab={addNewTab} />
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Mock Server"
        message={`Are you sure you want to delete "${mockToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Server"
        confirmClass="btn-error"
      />
    </CommonLayout>
  );
}
