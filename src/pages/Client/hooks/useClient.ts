import { useState, useCallback, useEffect, useRef, useMemo } from "preact/hooks";
import { useWorkspace } from "../../../context/WorkspaceContext";
import { useAuth } from "../../../context/AuthContext";
import { useEnvironment } from "../../../context/EnvironmentContext";
import { agentService } from "../../../services/agent";
import { historyService } from "../../../services/history";
import { requestsAPI } from "../../../services/api";
import { useTabs } from "./useTabs";
import { useCollections } from "./useCollections";
import { useHttpRequest } from "./useHttpRequest";
import { useRealtime } from "./useRealtime";
import { usePanelResizing } from "./usePanelResizing";
import { mapRequestToTab, mapTabToRequest } from "../utils/tabMapper";
import { generateHTTPPreview as generatePreviewUtil } from "../utils/codeGen";
import { Tab, RequestType } from "../types";

export function useClient(id?: string, type?: "request" | "history") {
    const { activeWorkspaceId, workspaces, activeWorkspace, switchWorkspace } = useWorkspace();
    const { isAuthenticated } = useAuth();
    const {
        tabs,
        setTabs,
        activeTabId,
        setActiveTabId,
        currentTab,
        addNewTab,
        closeTab,
        updateTab,
        updateCurrentTab,
    } = useTabs();

    const {
        collections,
        collectionsLoading,
        handleCollectionRename,
        handleCollectionDelete,
        handleRequestRename,
        handleRequestDelete,
        handleAddCollection: addCollectionApi,
        handleRequestMove,
        saveRequest,
        saveRequestAs,
        setCollections,
    } = useCollections(activeWorkspaceId);

    const {
        sidebarWidth,
        responsePosition,
        setResponsePosition,
        panelSize,
        setPanelSize,
        isResizingSidebar,
        isResizingPanel,
        startResizingSidebar,
        startResizingPanel,
    } = usePanelResizing();

    const [showAddPopover, setShowAddPopover] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState("");
    const [addCollectionError, setAddCollectionError] = useState("");
    const [showEnvironmentModal, setShowEnvironmentModal] = useState(false);
    const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
    const [draggedItem, setDraggedItem] = useState<any>(null);

    // Share modal state
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareUrl, setShareUrl] = useState("");

    const handleAddCollection = useCallback(
        async (name: string) => {
            if (!name.trim()) {
                setAddCollectionError("Name is required");
                return;
            }
            const success = await addCollectionApi(name);
            if (success) {
                setShowAddPopover(false);
                setNewCollectionName("");
                setAddCollectionError("");
            } else {
                setAddCollectionError("Failed to create collection");
            }
        },
        [addCollectionApi],
    );

    // Environment context
    const {
        environments,
        globalVariables,
        activeEnvironmentId,
        updateEnvironments,
        replaceVariables,
    } = useEnvironment();

    // Agent availability state
    const [agentAvailable, setAgentAvailable] = useState(false);
    const [checkingAgent, setCheckingAgent] = useState(true);
    const [agentPermissionNeeded, setAgentPermissionNeeded] = useState(false);

    // Save As state
    const [showSavePopover, setShowSavePopover] = useState(false);
    const [saveRequestName, setSaveRequestName] = useState("");
    const [selectedCollectionId, setSelectedCollectionId] = useState<string | number | null>(null);
    const [saveAsError, setSaveAsError] = useState("");
    const savePopoverRef = useRef<HTMLDivElement>(null);

    const handleSave = useCallback(async () => {
        if (!currentTab || !currentTab.savedRequestId) return;
        try {
            const data = mapTabToRequest(currentTab);
            await saveRequest(currentTab.savedRequestId, data);
            updateCurrentTab({ saved: true });
        } catch (error) {
            console.error("Failed to save request:", error);
        }
    }, [currentTab, saveRequest, updateCurrentTab]);

    const handleShare = useCallback(() => {
        if (!currentTab || !currentTab.url) return;

        const requestData = {
            method: currentTab.method || "GET",
            url: currentTab.url || "",
            headers: JSON.stringify(
                Object.entries(currentTab.headers || {}).map(([key, value]) => ({
                    key,
                    value,
                })),
            ),
            params: JSON.stringify(
                Object.entries(currentTab.params || {}).map(([key, value]) => ({
                    key,
                    value,
                })),
            ),
            auth_type: currentTab.authType || "",
            auth_data: JSON.stringify(currentTab.authData || {}),
            body_json: currentTab.bodyJson || "",
            body_text: currentTab.bodyText || "",
            body_xml: currentTab.bodyXml || "",
            body_type: currentTab.bodyType || "",
            form_data: JSON.stringify(currentTab.formData || []),
            url_encoded: JSON.stringify(
                Object.entries(currentTab.urlEncodedData || {}).map(([key, value]) => ({
                    key,
                    value,
                })),
            ),
            body_graphql_query: currentTab.bodyGraphQLQuery || "",
            body_graphql_variables: currentTab.bodyGraphQLVariables || "",
        };

        const encoded = btoa(encodeURIComponent(JSON.stringify(requestData)));
        const url = `${window.location.origin}/client?data=${encoded}`;
        setShareUrl(url);
        setShowShareModal(true);
    }, [currentTab]);

    const handleSaveAs = useCallback(async () => {
        if (!currentTab || !saveRequestName.trim() || !selectedCollectionId) return;
        try {
            const data = {
                ...mapTabToRequest(currentTab),
                name: saveRequestName.trim(),
            };
            const newRequest = await saveRequestAs(
                String(selectedCollectionId),
                data,
            );
            setShowSavePopover(false);
            setSaveRequestName("");
            updateCurrentTab({
                saved: true,
                name: newRequest.name,
                savedRequestId: newRequest.id,
            });
        } catch (error) {
            setSaveAsError("Failed to save request");
            console.error("Failed to save request as:", error);
        }
    }, [
        currentTab,
        saveRequestName,
        selectedCollectionId,
        saveRequestAs,
        updateCurrentTab,
    ]);

    const openSaveAsPopover = useCallback(() => {
        if (currentTab) {
            setSaveRequestName(currentTab.name || "");
            setShowSavePopover(true);
        }
    }, [currentTab]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                savePopoverRef.current &&
                !savePopoverRef.current.contains(event.target as Node)
            ) {
                setShowSavePopover(false);
            }
        }
        if (showSavePopover) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSavePopover]);

    // Check agent availability
    const checkAgentAvailability = useCallback(async (silent = false) => {
        if (!silent) setCheckingAgent(true);
        try {
            const available = await agentService.checkAvailability();
            setAgentAvailable(available);
            return available;
        } catch (e) {
            setAgentAvailable(false);
            return false;
        } finally {
            if (!silent) setCheckingAgent(false);
        }
    }, []);

    useEffect(() => {
        checkAgentAvailability();
        // Periodic check every 30 seconds
        const interval = setInterval(() => checkAgentAvailability(true), 30000);
        return () => clearInterval(interval);
    }, [checkAgentAvailability]);

    useEffect(() => {
        if (!id || !type) return;

        const loadItem = async () => {
            try {
                let data;
                if (type === "history") {
                    data = await historyService.getById(id);
                } else {
                    data = await requestsAPI.getById(id);
                }

                if (data) {
                    const newTab = mapRequestToTab(data, type);

                    // Check if already open
                    const existingTab = tabs.find(
                        (t) =>
                            (type === "history" &&
                                t.name === newTab.name &&
                                t.url === newTab.url) ||
                            (type === "request" && t.savedRequestId === id),
                    );

                    if (existingTab) {
                        setActiveTabId(existingTab.id as number);
                    } else {
                        setTabs((prev) => [...prev, newTab]);
                        setActiveTabId(newTab.id as number);
                    }
                }
            } catch (error) {
                console.error(`Failed to load ${type}:`, error);
            }
        };

        loadItem();
    }, [id, type]);

    const handleDragStart = useCallback(
        (e: DragEvent, item: any, type: string) => {
            setDraggedItem({ ...item, type });
            if (e.dataTransfer) {
                e.dataTransfer.setData(
                    "application/json",
                    JSON.stringify({ ...item, type }),
                );
                e.dataTransfer.effectAllowed = "move";
            }
        },
        [],
    );

    const handleDragEnd = useCallback(() => {
        setDraggedItem(null);
    }, []);

    const ensureResponsePanelVisibility = useCallback(() => {
        if (panelSize < 100) setPanelSize(350);
    }, [panelSize]);

    const { handleSendRequest: sendHttp, prepareHttpRequest } = useHttpRequest(
        activeWorkspaceId,
        updateTab,
        ensureResponsePanelVisibility,
    );

    const generateHTTPPreview = useCallback(() => {
        return generatePreviewUtil(
            currentTab!,
            prepareHttpRequest,
            replaceVariables,
        );
    }, [currentTab, prepareHttpRequest, replaceVariables]);

    const debouncedUpdateBodyJson = useMemo(() => {
        let timeout: any;
        return (val: string) => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(
                () => updateCurrentTab({ bodyJson: val, saved: false }),
                300,
            );
        };
    }, [updateCurrentTab]);

    const debouncedUpdateBodyXml = useMemo(() => {
        let timeout: any;
        return (val: string) => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(
                () => updateCurrentTab({ bodyXml: val, saved: false }),
                300,
            );
        };
    }, [updateCurrentTab]);

    const debouncedUpdateBodyText = useMemo(() => {
        let timeout: any;
        return (val: string) => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(
                () => updateCurrentTab({ bodyText: val, saved: false }),
                300,
            );
        };
    }, [updateCurrentTab]);

    const {
        handleWebSocketToggle,
        handleWebSocketSendMessage,
        handleSocketIODisconnect,
        handleSocketIOEmit,
    } = useRealtime(
        activeWorkspaceId,
        isAuthenticated,
        tabs,
        setTabs,
        setActiveTabId,
        ensureResponsePanelVisibility,
    );

    const handleSendRequest = useCallback(async () => {
        if (!currentTab) return;
        if (currentTab.requestType === "http") {
            // Check if agent is needed
            const needsAgent = agentService.requiresAgent(currentTab.url || "");
            if (needsAgent && !agentAvailable) {
                // Try one quick re-check
                const nowAvailable = await checkAgentAvailability(true);
                if (!nowAvailable) {
                    updateTab(currentTab.id, {
                        error:
                            "Local request detected but agent is offline. Please start the ApiSpider agent to make requests to localhost or private IPs.",
                    });
                    return;
                }
            }
            sendHttp(currentTab);
        } else {
            handleWebSocketToggle(currentTab);
        }
    }, [
        currentTab,
        sendHttp,
        handleWebSocketToggle,
        agentAvailable,
        checkAgentAvailability,
        updateTab,
    ]);

    // Handle initial tab
    useEffect(() => {
        if (tabs.length === 0) addNewTab();
    }, [tabs.length, addNewTab]);

    return {
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
        handleSocketIODisconnect,
        handleSocketIOEmit,
        environments,
        globalVariables,
        activeEnvironmentId,
        updateEnvironments,
        handleDragStart,
        handleDragEnd,
    };
}
