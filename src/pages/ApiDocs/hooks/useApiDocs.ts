import { useState, useEffect, useCallback, useRef } from "preact/hooks";
import { apidocsAPI, collectionsAPI } from "../../../services/api";
import { useWorkspace } from "../../../context/WorkspaceContext";
import { ApiDocTab, ApiDocument, Collection, DocConfig } from "../types";

export function useApiDocs() {
  const { activeWorkspaceId } = useWorkspace();
  const [docs, setDocs] = useState<ApiDocument[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<ApiDocument | null>(null);

  // Save As state
  const [showSavePopover, setShowSavePopover] = useState(false);
  const [saveRequestName, setSaveRequestName] = useState("");
  const [saveAsError, setSaveAsError] = useState("");
  const savePopoverRef = useRef<HTMLDivElement>(null);
  const saveButtonRef = useRef<HTMLButtonElement>(null);

  // Tabs state
  const [tabs, setTabs] = useState<ApiDocTab[]>([
    {
      id: Date.now(),
      name: "New API Documentation",
      docId: null,
      summary: "",
      collection_ids: [],
      theme: "apispider-light",
      logo_url_light: "",
      logo_url_dark: "",
      footer_text: "",
      is_published: false,
      saved: true, // Start as saved for a fresh "New" state
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<number>(tabs[0].id);

  // Sidebar state
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const sidebarInputRef = useRef<HTMLInputElement>(null);
  const saveOnBlur = useRef(true);

  // Sidebar resize state
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    try {
      const saved = localStorage.getItem("apispider_apidocs_sidebar_width");
      return saved ? parseInt(saved, 10) : 320;
    } catch (e) {
      return 320;
    }
  });
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);

  const API_BASE_URL =
    (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:8080";
  const [docConfig, setDocConfig] = useState<DocConfig | null>(null);

  const currentTab = tabs.find((tab) => tab.id === activeTabId);

  const fetchCollections = async () => {
    if (!activeWorkspaceId) return;
    try {
      const data = await collectionsAPI.getAll(String(activeWorkspaceId));
      setCollections(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch collections:", err);
    }
  };

  const fetchDocConfig = async () => {
    try {
      const config = await apidocsAPI.getConfig();
      setDocConfig(config as DocConfig);
    } catch (err) {
      setDocConfig({ format: "path" });
    }
  };

  const fetchDocs = async () => {
    if (!activeWorkspaceId) return;
    setLoading(true);
    try {
      const data = await apidocsAPI.getAll(String(activeWorkspaceId));
      setDocs(Array.isArray(data) ? (data as ApiDocument[]) : []);
    } catch (err) {
      //showToast("Failed to fetch API docs", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeWorkspaceId) {
      fetchDocs();
      fetchDocConfig();
      fetchCollections();
    } else {
      setDocs([]);
      setCollections([]);
    }
  }, [activeWorkspaceId]);

  const updateCurrentTab = useCallback(
    (updates: Partial<ApiDocTab>) => {
      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTabId ? { ...tab, ...updates } : tab,
        ),
      );
    },
    [activeTabId],
  );

  const getDocUrl = (slug?: string) => {
    if (!slug) return "";
    if (docConfig?.format === "subdomain" && docConfig?.base_url) {
      const protocol = API_BASE_URL.startsWith("https") ? "https" : "http";
      const prefix = docConfig?.prefix || "";
      return `${protocol}://${prefix}${slug}.${docConfig.base_url}`;
    }
    return `${API_BASE_URL}/doc/${slug}`;
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
        "apispider_apidocs_sidebar_width",
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

  const handleNewDoc = () => {
    const newTabId = Date.now();
    const newTab: ApiDocTab = {
      id: newTabId,
      name: "New API Documentation",
      docId: null,
      summary: "",
      collection_ids: [],
      theme: "apispider-light",
      logo_url_light: "",
      logo_url_dark: "",
      footer_text: "",
      is_published: false,
      saved: true,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTabId);
  };

  const handleSelectDoc = async (doc: ApiDocument) => {
    const existingTab = tabs.find((t) => t.docId === doc.id);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      return;
    }

    setLoading(true);
    try {
      const fullDoc = await apidocsAPI.getById(doc.id);
      let collectionIds: string[] = [];
      if ((fullDoc as any).collection_ids) {
        try {
          const parsed = JSON.parse((fullDoc as any).collection_ids);
          collectionIds = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          collectionIds = [];
        }
      }

      const newTabId = Date.now();
      const newTab: ApiDocTab = {
        id: newTabId,
        docId: (fullDoc as any).id,
        name: (fullDoc as any).name || "",
        summary: (fullDoc as any).summary || "",
        collection_ids: collectionIds,
        theme: (fullDoc as any).theme || "apispider-light",
        logo_url_light: (fullDoc as any).logo_url_light || "",
        logo_url_dark: (fullDoc as any).logo_url_dark || "",
        footer_text: (fullDoc as any).footer_text || "",
        is_published: (fullDoc as any).is_published || false,
        slug: (fullDoc as any).slug,
        saved: true,
      };

      setTabs([...tabs, newTab]);
      setActiveTabId(newTabId);
    } catch (err) {
      //showToast("Failed to fetch doc details", "error");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!currentTab || !activeWorkspaceId) return;
    if (!currentTab.name.trim()) {
      //showToast("Name is required", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: currentTab.name,
        summary: currentTab.summary,
        collection_ids: JSON.stringify(currentTab.collection_ids),
        theme: currentTab.theme,
        logo_url_light: currentTab.logo_url_light,
        logo_url_dark: currentTab.logo_url_dark,
        footer_text: currentTab.footer_text,
        is_published: currentTab.is_published,
        workspace_id: Number(activeWorkspaceId),
      };

      if (currentTab.docId) {
        const updated = await apidocsAPI.update(currentTab.docId, payload);
        updateCurrentTab({
          docId: (updated as any).id,
          name: (updated as any).name,
          slug: (updated as any).slug,
          is_published: (updated as any).is_published,
          saved: true,
        });
        // showToast("API documentation updated", "success");
      } else {
        const created = await apidocsAPI.create(payload);
        updateCurrentTab({
          docId: (created as any).id,
          name: (created as any).name,
          slug: (created as any).slug,
          is_published: (created as any).is_published,
          saved: true,
        });
        //showToast("API documentation created", "success");
      }
      fetchDocs();
    } catch (err) {
      //showToast("Failed to save API documentation", "error");
    }
    setLoading(false);
  };

  const handleRefreshSnapshot = async () => {
    if (!currentTab?.docId || !activeWorkspaceId) return;

    setLoading(true);
    try {
      const payload = {
        name: currentTab.name,
        summary: currentTab.summary,
        collection_ids: JSON.stringify(currentTab.collection_ids),
        theme: currentTab.theme,
        logo_url_light: currentTab.logo_url_light,
        logo_url_dark: currentTab.logo_url_dark,
        footer_text: currentTab.footer_text,
        workspace_id: Number(activeWorkspaceId),
        is_published: true,
      };

      const updated = await apidocsAPI.update(currentTab.docId, payload);
      updateCurrentTab({
        docId: (updated as any).id,
        name: (updated as any).name,
        slug: (updated as any).slug,
        is_published: (updated as any).is_published,
        saved: true,
      });
      //showToast("Snapshot refreshed successfully", "success");
      fetchDocs();
    } catch (err) {
      //showToast("Failed to refresh snapshot", "error");
    }
    setLoading(false);
  };

  const closeTab = (tabId: number, e?: MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (tabs.length === 1) {
      setTabs([
        {
          id: Date.now(),
          name: "New API Documentation",
          docId: null,
          summary: "",
          collection_ids: [],
          theme: "apispider-light",
          logo_url_light: "",
          logo_url_dark: "",
          footer_text: "",
          is_published: false,
          saved: true,
        },
      ]);
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

  const handleDeleteClick = (doc: ApiDocument) => {
    setDocToDelete(doc);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!docToDelete) return;
    setLoading(true);
    try {
      await apidocsAPI.delete(docToDelete.id);
      //showToast("API documentation deleted", "success");
      const tabToClose = tabs.find((t) => t.docId === docToDelete.id);
      if (tabToClose) closeTab(tabToClose.id);
      setDeleteModalOpen(false);
      setDocToDelete(null);
      fetchDocs();
    } catch (err) {
      //showToast("Failed to delete documentation", "error");
    }
    setLoading(false);
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
        summary: currentTab.summary,
        collection_ids: JSON.stringify(currentTab.collection_ids),
        theme: currentTab.theme,
        logo_url_light: currentTab.logo_url_light,
        logo_url_dark: currentTab.logo_url_dark,
        footer_text: currentTab.footer_text,
        is_published: false,
        workspace_id: Number(activeWorkspaceId),
      };

      const created = await apidocsAPI.create(payload);
      const newTabId = Date.now();
      const newTab: ApiDocTab = {
        id: newTabId,
        docId: (created as any).id,
        name: (created as any).name,
        summary: (created as any).summary || "",
        collection_ids: currentTab.collection_ids,
        theme: (created as any).theme || "apispider-light",
        logo_url_light: (created as any).logo_url_light || "",
        logo_url_dark: (created as any).logo_url_dark || "",
        footer_text: (created as any).footer_text || "",
        slug: (created as any).slug,
        is_published: (created as any).is_published,
        saved: true,
      };

      setTabs([...tabs, newTab]);
      setActiveTabId(newTabId);
      setShowSavePopover(false);
      //showToast("API documentation saved as copy", "success");
      fetchDocs();
    } catch (err) {
      //showToast("Failed to save as copy", "error");
    }
    setLoading(false);
  };

  const handleDocRename = async (docId: string, newName: string) => {
    if (!newName.trim() || !activeWorkspaceId) return;
    try {
      const doc = docs.find((d) => d.id === docId);
      if (!doc) return;

      const payload = {
        ...doc,
        name: newName,
        workspace_id: Number(activeWorkspaceId),
      };
      const updated = await apidocsAPI.update(docId, payload);
      setDocs(docs.map((d) => (d.id === docId ? (updated as any) : d)));
      setTabs((prevTabs) =>
        prevTabs.map((t) =>
          t.docId === docId ? { ...t, name: (updated as any).name } : t,
        ),
      );
      //showToast("Documentation renamed", "success");
    } catch (err) {
      //showToast("Failed to rename documentation", "error");
    }
  };

  const startEditing = (doc: ApiDocument, e?: any) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    saveOnBlur.current = true;
    setEditingDocId(doc.id);
    setEditingName(doc.name);
  };

  const saveEdit = async (docId: string, nameOverride?: string) => {
    const nameToSave = nameOverride !== undefined ? nameOverride : editingName;
    if (nameOverride === undefined && !saveOnBlur.current) return;
    if (nameToSave.trim()) await handleDocRename(docId, nameToSave.trim());
    setEditingDocId(null);
    setEditingName("");
  };

  const cancelEdit = () => {
    setEditingDocId(null);
    setEditingName("");
    saveOnBlur.current = true;
  };

  const handleLogoUpload = (e: any, theme: "light" | "dark") => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        //showToast("Please select an image file", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const field = theme === "light" ? "logo_url_light" : "logo_url_dark";
        updateCurrentTab({ [field]: reader.result as string, saved: false });
      };
      reader.readAsDataURL(file);
    }
  };

  return {
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
    setTabs,
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
  };
}
