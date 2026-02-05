import { useState, useEffect, useCallback, useRef } from "preact/hooks";
import { mocksAPI } from "../../../services/api";
import { useEnvironment } from "../../../context/EnvironmentContext";
import { useWorkspace } from "../../../context/WorkspaceContext";
import { Endpoint, Mock, MockTab, MockConfig } from "../types";

export function useMocks() {
  const { activeWorkspaceId } = useWorkspace();
  const { environments, globalVariables, updateEnvironments } =
    useEnvironment();
  const [mocks, setMocks] = useState<Mock[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Sidebar actions state
  const [editingMockId, setEditingMockId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [mockToDelete, setMockToDelete] = useState<any>(null);
  const sidebarInputRef = useRef<HTMLInputElement>(null);
  const saveOnBlur = useRef(true);

  // Sidebar resize state
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    try {
      const saved = localStorage.getItem("apispider_mocks_sidebar_width");
      return saved ? parseInt(saved, 10) : 320;
    } catch (e) {
      return 320;
    }
  });
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);

  // Tabs state
  const [tabs, setTabs] = useState<MockTab[]>([
    {
      id: Date.now(),
      name: "New Mock Server",
      mockId: null,
      endpoints: [
        {
          method: "GET",
          path: "/hello",
          response_code: 200,
          response_body: '{"message": "Hello World"}',
          delay: 0,
        },
      ],
      is_published: false,
      saved: false,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<number>(tabs[0].id);

  // Save As state
  const [showSavePopover, setShowSavePopover] = useState(false);
  const [saveRequestName, setSaveRequestName] = useState("");
  const [saveAsError, setSaveAsError] = useState("");
  const savePopoverRef = useRef<HTMLDivElement>(null);
  const saveButtonRef = useRef<HTMLButtonElement>(null);

  const API_BASE_URL =
    (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:8080";
  const [mockConfig, setMockConfig] = useState<MockConfig | null>(null);

  const currentTab = tabs.find((t) => t.id === activeTabId);

  const fetchMockConfig = async () => {
    try {
      const config = await mocksAPI.getConfig();
      setMockConfig(config as MockConfig);
    } catch (err) {
      setMockConfig({ format: "path" });
    }
  };

  const fetchMocks = async () => {
    if (!activeWorkspaceId) return;
    setLoading(true);
    try {
      const data = await mocksAPI.getAll(
        activeWorkspaceId ? String(activeWorkspaceId) : null,
      );
      setMocks(data as any as Mock[]);
    } catch (err) {
      //showToast("Failed to fetch mocks", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeWorkspaceId) {
      fetchMocks();
      fetchMockConfig();
    } else {
      setMocks([]);
    }
  }, [activeWorkspaceId]);

  const getMockBaseUrl = (slug?: string) => {
    if (!slug) return "";
    if (mockConfig?.format === "subdomain" && mockConfig?.base_url) {
      const protocol = API_BASE_URL.startsWith("https") ? "https" : "http";
      const prefix = mockConfig?.prefix || "";
      return `${protocol}://${prefix}${slug}.${mockConfig.base_url}`;
    }
    return `${API_BASE_URL}/mock/${slug}`;
  };

  const startResizingSidebar = useCallback(
    () => setIsResizingSidebar(true),
    [],
  );
  const stopResizing = useCallback(() => setIsResizingSidebar(false), []);
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizingSidebar) {
        const newWidth = e.clientX;
        if (newWidth > 250 && newWidth < 500) setSidebarWidth(newWidth);
      }
    },
    [isResizingSidebar],
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        "apispider_mocks_sidebar_width",
        sidebarWidth.toString(),
      );
    } catch (e) {}
  }, [sidebarWidth]);

  useEffect(() => {
    if (isResizingSidebar) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizingSidebar, onMouseMove, stopResizing]);

  const addNewTab = () => {
    const newTabId = Date.now();
    const newTab: MockTab = {
      id: newTabId,
      name: "New Mock Server",
      mockId: null,
      endpoints: [
        {
          method: "GET",
          path: "/hello",
          response_code: 200,
          response_body: '{"message": "Hello World"}',
          delay: 0,
        },
      ],
      is_published: false,
      saved: false,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTabId);
  };

  const closeTab = (tabId: number, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    if (tabs.length === 1) {
      addNewTab();
      setTabs((prev) => prev.filter((t) => t.id !== tabId));
      return;
    }

    const tabIndex = tabs.findIndex((t) => t.id === tabId);
    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId) {
      const newActiveTab = newTabs[Math.max(0, tabIndex - 1)];
      setActiveTabId(newActiveTab.id);
    }
  };

  const updateCurrentTab = useCallback(
    (updates: Partial<MockTab>) => {
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId ? { ...t, ...updates, saved: false } : t,
        ),
      );
    },
    [activeTabId],
  );

  const handleSelectMock = async (mock: Mock) => {
    const existingTab = tabs.find((t) => t.mockId === mock.id);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      return;
    }

    setLoading(true);
    try {
      const fullMock = await mocksAPI.getById(mock.id);
      const newTabId = Date.now();
      const newTab: MockTab = {
        id: newTabId,
        mockId: (fullMock as any).id,
        name: (fullMock as any).name,
        slug: (fullMock as any).slug,
        endpoints: (fullMock as any).endpoints || [],
        is_published: (fullMock as any).is_published,
        saved: true,
      };
      setTabs([...tabs, newTab]);
      setActiveTabId(newTabId);
    } catch (err) {
      //showToast("Failed to fetch mock details", "error");
    }
    setLoading(false);
  };

  const handleAddEndpoint = () => {
    if (!currentTab) return;
    const newEndpoints = [
      ...currentTab.endpoints,
      {
        method: "GET",
        path: "/",
        response_code: 200,
        response_body: "",
        delay: 0,
      },
    ];
    updateCurrentTab({ endpoints: newEndpoints });
  };

  const handleRemoveEndpoint = (index: number) => {
    if (!currentTab) return;
    const newEndpoints = [...currentTab.endpoints];
    newEndpoints.splice(index, 1);
    updateCurrentTab({ endpoints: newEndpoints });
  };

  const handleEndpointChange = (
    index: number,
    field: keyof Endpoint,
    value: any,
  ) => {
    if (!currentTab) return;
    const newEndpoints = [...currentTab.endpoints];
    (newEndpoints[index] as any)[field] = value;

    if (field === "path") {
      let path = value as string;
      if (path && !path.startsWith("/")) {
        path = "/" + path;
      }
      newEndpoints[index][field] = path;
    }
    if (field === "delay") {
      const val = parseInt(value) || 0;
      newEndpoints[index][field] = Math.min(Math.max(val, 0), 30000);
    }
    if (field === "response_code") {
      newEndpoints[index][field] = parseInt(value) || 200;
    }

    updateCurrentTab({ endpoints: newEndpoints });
  };

  const handleSave = async () => {
    if (!currentTab || !activeWorkspaceId) return;
    if (!currentTab.name.trim()) {
      //showToast("Server name is required", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: currentTab.name,
        endpoints: currentTab.endpoints,
        is_published: currentTab.is_published,
        workspace_id: Number(activeWorkspaceId),
      };

      if (currentTab.mockId) {
        const updated = await mocksAPI.update(currentTab.mockId, payload);
        setTabs((prev) =>
          prev.map((t) =>
            t.id === activeTabId
              ? {
                  ...t,
                  mockId: (updated as any).id,
                  name: (updated as any).name,
                  slug: (updated as any).slug,
                  endpoints: (updated as any).endpoints || [],
                  is_published: (updated as any).is_published,
                  saved: true,
                }
              : t,
          ),
        );
        // showToast("Mock server updated", "success");
      } else {
        const created = await mocksAPI.create(payload);
        setTabs((prev) =>
          prev.map((t) =>
            t.id === activeTabId
              ? {
                  ...t,
                  mockId: (created as any).id,
                  name: (created as any).name,
                  slug: (created as any).slug,
                  endpoints: (created as any).endpoints || [],
                  is_published: (created as any).is_published,
                  saved: true,
                }
              : t,
          ),
        );
        //showToast("Mock server created", "success");
      }
      fetchMocks();
    } catch (err) {
      //showToast("Failed to save mock server", "error");
    }
    setLoading(false);
  };

  const handleSaveAsClick = () => {
    if (!currentTab) return;
    setSaveRequestName(`${currentTab.name} Copy`);
    setShowSavePopover(true);
  };

  const handleSaveAs = async () => {
    if (!currentTab || !activeWorkspaceId) return;
    if (!saveRequestName.trim()) {
      setSaveAsError("Name is required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: saveRequestName,
        endpoints: currentTab.endpoints,
        is_published: false,
        workspace_id: Number(activeWorkspaceId),
      };
      const created = await mocksAPI.create(payload);
      const newTabId = Date.now();
      const newTab: MockTab = {
        id: newTabId,
        mockId: (created as any).id,
        name: (created as any).name,
        slug: (created as any).slug,
        endpoints: (created as any).endpoints || [],
        is_published: (created as any).is_published,
        saved: true,
      };
      setTabs([...tabs, newTab]);
      setActiveTabId(newTabId);
      setShowSavePopover(false);
      //showToast("Mock server saved as copy", "success");
      fetchMocks();
    } catch (err) {
      setSaveAsError("Failed to save copy");
    }
    setLoading(false);
  };

  const handleMockRename = async (mockId: string, newName: string) => {
    if (!newName.trim() || !activeWorkspaceId) return;
    try {
      const mock = mocks.find((m) => m.id === mockId);
      if (!mock) return;
      const payload = {
        name: newName,
        endpoints: mock.endpoints,
        is_published: mock.is_published,
        workspace_id: Number(activeWorkspaceId),
      };
      const updated = await mocksAPI.update(mockId, payload);
      setMocks((prev) =>
        prev.map((m) => (m.id === mockId ? (updated as any as Mock) : m)),
      );
      setTabs((prev) =>
        prev.map((t) =>
          t.mockId === mockId ? { ...t, name: (updated as any).name } : t,
        ),
      );
      //showToast("Mock renamed", "success");
    } catch (err) {
      //showToast("Failed to rename mock", "error");
    }
  };

  const startEditing = (mock: Mock, e?: any) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    saveOnBlur.current = true;
    setEditingMockId(mock.id);
    setEditingName(mock.name);
  };

  const saveEdit = async (mockId: string, nameOverride?: string) => {
    const nameToSave = nameOverride !== undefined ? nameOverride : editingName;
    if (nameOverride === undefined && !saveOnBlur.current) return;
    if (nameToSave.trim()) await handleMockRename(mockId, nameToSave.trim());
    setEditingMockId(null);
    setEditingName("");
  };

  const cancelEdit = () => {
    setEditingMockId(null);
    setEditingName("");
    saveOnBlur.current = true;
  };

  const handleDeleteClick = (mock: any = null) => {
    if (mock) {
      setMockToDelete(mock);
    } else {
      if (!currentTab?.mockId) {
        closeTab(currentTab!.id);
        return;
      }
      const mockObj = mocks.find((m) => m.id === currentTab.mockId);
      setMockToDelete(
        mockObj || { name: currentTab.name, id: currentTab.mockId },
      );
    }
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!mockToDelete) return;
    setLoading(true);
    try {
      await mocksAPI.delete(mockToDelete.id);
      //showToast("Mock server deleted", "success");
      const tabToClose = tabs.find((t) => t.mockId === mockToDelete.id);
      if (tabToClose) closeTab(tabToClose.id);
      setDeleteModalOpen(false);
      setMockToDelete(null);
      fetchMocks();
    } catch (err) {
      //showToast("Failed to delete mock server", "error");
    }
    setLoading(false);
  };

  const handleSaveToEnv = async () => {
    if (!currentTab || !currentTab.slug) return;
    const url = getMockBaseUrl(currentTab.slug);
    const varName = `MOCK_${currentTab.name.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase()}_URL`;
    try {
      const activeEnv = environments.find((e) => e.is_active);
      if (!activeEnv) {
        //showToast("No active environment selected", "error");
        return;
      }
      const updatedVariables = {
        ...(activeEnv.variables || {}),
        [varName]: url,
      };
      const updatedEnvs = environments.map((env) =>
        env.id === activeEnv.id ? { ...env, variables: updatedVariables } : env,
      );
      await updateEnvironments({
        environments: updatedEnvs,
        globalVariables: globalVariables,
      });
      //showToast(`Saved to environment as {{${varName}}}`, "success");
    } catch (err) {
      //showToast("Failed to save to environment", "error");
    }
  };

  return {
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
  };
}
