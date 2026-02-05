import ClientSidebar from "../../components/ClientSidebar";
import TabsBar from "../../components/TabsBar";
import ResponsePanel from "../../components/ResponsePanel";
import CommonLayout from "../../components/CommonLayout";
import WorkspaceModal from "../../components/WorkspaceModal";
import EnvironmentModal from "../../components/EnvironmentModal";
import ShareModal from "../../components/ShareModal";
import SpiderSpinner from "../../components/SpiderSpinner";
import { useClient } from "./hooks/useClient";
import { parseUrlParams, buildUrlWithParams } from "../../utils/url";

// Components
import ClientHeader from "./components/ClientHeader";
import RequestPanelSwitcher from "./components/RequestPanelSwitcher";

export default function Client({
  id,
  type,
}: {
  disabled?: boolean;
  id?: string;
  type?: "request" | "history";
}) {
  const {
    activeWorkspaceId,
    workspaces,
    activeWorkspace,
    switchWorkspace,
    tabs,
    setTabs,
    activeTabId,
    setActiveTabId,
    currentTab,
    addNewTab,
    closeTab,
    updateTab,
    updateCurrentTab,
    collections,
    collectionsLoading,
    handleCollectionRename,
    handleCollectionDelete,
    handleRequestRename,
    handleRequestDelete,
    handleAddCollection,
    handleRequestMove,
    setCollections,
    sidebarWidth,
    responsePosition,
    setResponsePosition,
    panelSize,
    setPanelSize,
    isResizingSidebar,
    isResizingPanel,
    startResizingSidebar,
    startResizingPanel,
    showAddPopover,
    setShowAddPopover,
    newCollectionName,
    setNewCollectionName,
    addCollectionError,
    setAddCollectionError,
    showEnvironmentModal,
    setShowEnvironmentModal,
    showWorkspaceModal,
    setShowWorkspaceModal,
    draggedItem,
    showShareModal,
    setShowShareModal,
    shareUrl,
    agentAvailable,
    checkingAgent,
    agentPermissionNeeded,
    showSavePopover,
    setShowSavePopover,
    saveRequestName,
    setSaveRequestName,
    selectedCollectionId,
    setSelectedCollectionId,
    saveAsError,
    setSaveAsError,
    savePopoverRef,
    handleSave,
    handleShare,
    handleSaveAs,
    openSaveAsPopover,
    checkAgentAvailability,
    handleSendRequest,
    generateHTTPPreview,
    debouncedUpdateBodyJson,
    debouncedUpdateBodyXml,
    debouncedUpdateBodyText,
    handleWebSocketToggle,
    handleWebSocketSendMessage,
    handleSocketIOEmit,
    environments,
    globalVariables,
    activeEnvironmentId,
    updateEnvironments,
    handleDragEnd,
    handleDragStart,
  } = useClient(id, type);

  return (
    <CommonLayout
      buttons={
        <ClientHeader
          currentTab={currentTab}
          addNewTab={addNewTab}
          handleShare={handleShare}
          handleSave={handleSave}
          openSaveAsPopover={openSaveAsPopover}
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
          agentAvailable={agentAvailable}
          checkingAgent={checkingAgent}
          agentPermissionNeeded={agentPermissionNeeded}
          checkAgentAvailability={checkAgentAvailability}
        />
      }
    >
      <div className="flex h-screen bg-base-100 text-base-content overflow-hidden">
        <ClientSidebar
          sidebarWidth={sidebarWidth}
          activeWorkspace={activeWorkspace}
          activeWorkspaceId={activeWorkspaceId}
          workspaces={workspaces}
          switchWorkspace={switchWorkspace}
          setShowWorkspaceModal={setShowWorkspaceModal}
          setShowEnvironmentModal={setShowEnvironmentModal}
          showAddPopover={showAddPopover}
          setShowAddPopover={setShowAddPopover}
          newCollectionName={newCollectionName}
          setNewCollectionName={setNewCollectionName}
          addCollectionError={addCollectionError}
          setAddCollectionError={setAddCollectionError}
          handleAddCollection={handleAddCollection}
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
          activeTabId={activeTabId || 0}
        />

        <div
          onMouseDown={startResizingSidebar}
          className={`group w-1.5 hover:w-2 cursor-col-resize z-20 transition-all flex items-center justify-center ${isResizingSidebar ? "bg-primary/20 w-2" : "bg-transparent hover:bg-base-300"}`}
        >
          <div
            className={`w-0.5 h-8 rounded-full transition-all ${isResizingSidebar ? "bg-primary" : "bg-base-300 group-hover:bg-primary/50"}`}
          ></div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {collectionsLoading && (
            <div className="absolute inset-0 bg-base-100/60 z-50 flex flex-col items-center justify-center">
              <SpiderSpinner className="w-12 h-12" />
              <span className="text-xs text-base-content/40 mt-4 font-bold uppercase tracking-widest">
                Synchronizing...
              </span>
            </div>
          )}
          <TabsBar
            tabs={tabs}
            activeTabId={activeTabId || 0}
            setActiveTabId={setActiveTabId}
            closeTab={closeTab}
            addNewTab={() => addNewTab()}
          />

          <main
            className={`flex-1 flex overflow-hidden ${responsePosition === "right" ? "flex-row" : "flex-col"}`}
          >
            <div className="flex-1 flex flex-col overflow-auto custom-scrollbar p-6 min-w-0">
              <RequestPanelSwitcher
                currentTab={currentTab}
                updateCurrentTab={updateCurrentTab}
                updateTab={updateTab}
                handleSendRequest={handleSendRequest}
                generateHTTPPreview={generateHTTPPreview}
                debouncedUpdateBodyJson={debouncedUpdateBodyJson}
                debouncedUpdateBodyXml={debouncedUpdateBodyXml}
                debouncedUpdateBodyText={debouncedUpdateBodyText}
                handleWebSocketToggle={handleWebSocketToggle}
                handleWebSocketSendMessage={handleWebSocketSendMessage}
                handleSocketIOEmit={handleSocketIOEmit}
                parseUrlParams={parseUrlParams}
                buildUrlWithParams={buildUrlWithParams}
              />
            </div>

            <div
              onMouseDown={startResizingPanel}
              className={`group z-20 transition-all flex items-center justify-center ${responsePosition === "bottom"
                ? "h-1.5 hover:h-2 cursor-row-resize w-full"
                : "w-1.5 hover:w-2 cursor-col-resize h-full"
                } ${isResizingPanel ? (responsePosition === "bottom" ? "bg-primary/20 h-2" : "bg-primary/20 w-2") : "bg-transparent hover:bg-base-300"}`}
            >
              <div
                className={`${responsePosition === "bottom" ? "w-8 h-0.5" : "w-0.5 h-8"} rounded-full transition-all ${isResizingPanel ? "bg-primary" : "bg-base-300 group-hover:bg-primary/50"}`}
              ></div>
            </div>

            <ResponsePanel
              currentTab={currentTab}
              responsePosition={responsePosition}
              setResponsePosition={setResponsePosition}
              panelSize={panelSize}
              setPanelSize={setPanelSize}
              updateCurrentTab={updateCurrentTab}
            />
          </main>
        </div>
      </div>

      <WorkspaceModal
        isOpen={showWorkspaceModal}
        onClose={() => setShowWorkspaceModal(false)}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={shareUrl}
      />
      <EnvironmentModal
        isOpen={showEnvironmentModal}
        onClose={() => setShowEnvironmentModal(false)}
        environments={environments}
        globalVariables={globalVariables}
        activeEnvironmentId={activeEnvironmentId}
        onSave={updateEnvironments}
      />
    </CommonLayout>
  );
}
