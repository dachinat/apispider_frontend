import { useRef, useCallback } from "preact/hooks";
import { io, Socket } from "socket.io-client";
import { Tab } from "../types";

export const useRealtimeRequest = (
    activeTab: Tab | undefined,
    updateCurrentTab: (updates: Partial<Tab>) => void,
    ensureVisibility: () => void,
    replaceVariables: (s: string) => string,
    getBaseUrl: () => string
) => {
    const wsConnectionsRef = useRef<Record<string | number, WebSocket | Socket>>({});

    const handleWebSocketConnect = useCallback(() => {
        if (!activeTab || !activeTab.url) return;

        ensureVisibility();

        let url = activeTab.url.trim();
        if (!url.startsWith("ws://") && !url.startsWith("wss://")) {
            const baseUrl = getBaseUrl();
            if (baseUrl) {
                let wsBaseUrl = baseUrl.replace(/^https?:\/\//, (match) =>
                    match === "https://" ? "wss://" : "ws://"
                );
                url = wsBaseUrl.replace(/\/$/, "") + "/" + url.replace(/^\//, "");
            }
        }

        url = replaceVariables(url);

        try {
            const ws = new WebSocket(url);
            wsConnectionsRef.current[activeTab.id] = ws;

            ws.onopen = () => {
                updateCurrentTab({
                    wsConnected: true,
                    wsConnectionTime: Date.now(),
                    wsMessages: [
                        ...(activeTab.wsMessages || []),
                        {
                            type: "connection",
                            direction: "system",
                            data: `Connected to ${url}`,
                            timestamp: new Date().toLocaleTimeString(),
                        },
                    ],
                });
            };

            ws.onmessage = (event) => {
                // Handle message logic
            };

            ws.onclose = (event) => {
                updateCurrentTab({
                    wsConnected: false,
                });
            };

        } catch (error) {
            console.error("Failed to connect:", error);
        }
    }, [activeTab, updateCurrentTab, ensureVisibility, replaceVariables, getBaseUrl]);

    const handleWebSocketDisconnect = useCallback(() => {
        if (!activeTab) return;
        const ws = wsConnectionsRef.current[activeTab.id];
        if (ws && "close" in ws) {
            ws.close();
        }
        updateCurrentTab({ wsConnected: false });
    }, [activeTab, updateCurrentTab]);

    const handleSendMessage = useCallback(() => {
        if (!activeTab || !activeTab.wsMessage) return;
        const ws = wsConnectionsRef.current[activeTab.id];
        if (ws && "send" in ws) {
            ws.send(activeTab.wsMessage);
            updateCurrentTab({
                wsMessages: [
                    ...(activeTab.wsMessages || []),
                    {
                        type: "message",
                        direction: "sent",
                        data: activeTab.wsMessage,
                        timestamp: new Date().toLocaleTimeString(),
                    },
                ],
            });
        }
    }, [activeTab, updateCurrentTab]);

    return {
        handleWebSocketConnect,
        handleWebSocketDisconnect,
        handleSendMessage,
    };
};
