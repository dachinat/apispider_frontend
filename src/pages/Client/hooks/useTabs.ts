import { useState, useCallback, useMemo } from "preact/hooks";
import { Tab, RequestType, BodyType } from "../types";
import { DEFAULT_HEADERS, WEBSOCKET_HEADERS, SOCKETIO_HEADERS } from "../constants";

export const useTabs = () => {
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [activeTabId, setActiveTabId] = useState<number | null>(null);

    const currentTab = useMemo(() => tabs.find((t) => t.id === activeTabId) || null, [tabs, activeTabId]);

    const addNewTab = useCallback((requestType: RequestType = null) => {
        const getHeadersForType = (type: RequestType) => {
            if (type === "websocket") return { ...WEBSOCKET_HEADERS };
            if (type === "socketio") return { ...SOCKETIO_HEADERS };
            return { ...DEFAULT_HEADERS };
        };

        const newTab: Tab = {
            id: Date.now(),
            name: requestType ? `New ${requestType.toUpperCase()} Request` : "New Request",
            method: requestType === "http" ? "GET" : null,
            url: "",
            activeTab: requestType === "http" ? "params" : "message",
            saved: false,
            requestType,
            params: {},
            headers: getHeadersForType(requestType),
            bodyType: "none",
        };
        setTabs((prev) => [...prev, newTab]);
        setActiveTabId(newTab.id as number);
    }, []);

    const closeTab = useCallback((id: number, e?: MouseEvent) => {
        if (e) e.stopPropagation();
        setTabs((prev) => {
            const index = prev.findIndex((t) => t.id === id);
            if (index === -1) return prev;

            const newTabs = prev.filter((t) => t.id !== id);
            if (activeTabId === id) {
                if (newTabs.length > 0) {
                    const nextTab = newTabs[Math.max(0, index - 1)];
                    setActiveTabId(nextTab.id as number);
                } else {
                    setActiveTabId(null);
                }
            }
            return newTabs;
        });
    }, [activeTabId]);

    const updateTab = useCallback((id: number | string, updates: Partial<Tab>) => {
        setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    }, []);

    const updateCurrentTab = useCallback((updates: Partial<Tab>) => {
        if (activeTabId) {
            updateTab(activeTabId, updates);
        }
    }, [activeTabId, updateTab]);

    return {
        tabs,
        setTabs,
        activeTabId,
        setActiveTabId,
        currentTab,
        addNewTab,
        closeTab,
        updateTab,
        updateCurrentTab,
    };
};
