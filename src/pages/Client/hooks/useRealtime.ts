import { useRef, useCallback } from "preact/hooks";
import { Tab } from "../types";
import { useEnvironment } from "../../../context/EnvironmentContext";
import { historyService } from "../../../services/history";
import { io } from "socket.io-client";

export const useRealtime = (
    activeWorkspaceId: string | number | null,
    isAuthenticated: boolean,
    tabs: Tab[],
    setTabs: (tabs: Tab[] | ((prev: Tab[]) => Tab[])) => void,
    setActiveTabId: (id: number | null) => void,
    ensureResponsePanelVisibility: () => void
) => {
    const { replaceVariables } = useEnvironment();
    const wsConnectionsRef = useRef<Record<string | number, any>>({});

    const handleWebSocketConnect = useCallback((currentTab: Tab) => {
        if (!currentTab || currentTab.wsConnected) return;

        ensureResponsePanelVisibility();



        let url = currentTab.url.trim();
        url = replaceVariables(url);

        try {
            const ws = new WebSocket(url);
            wsConnectionsRef.current[currentTab.id] = ws;

            ws.onopen = () => {
                setTabs((prev) => prev.map((t) => t.id === currentTab.id ? {
                    ...t,
                    wsConnected: true,
                    wsConnectionTime: Date.now(),
                    wsMessages: [...(t.wsMessages || []), {
                        type: "connection",
                        direction: "system",
                        data: `Connected to ${url}`,
                        timestamp: new Date().toLocaleTimeString(),
                    }]
                } : t));
            };

            ws.onmessage = (event) => {
                setTabs((prev) => prev.map((t) => t.id === currentTab.id ? {
                    ...t,
                    wsMessageCount: (t.wsMessageCount || 0) + 1,
                    wsMessages: [...(t.wsMessages || []), {
                        type: "message",
                        direction: "received",
                        data: event.data,
                        timestamp: new Date().toLocaleTimeString(),
                    }]
                } : t));
            };

            ws.onclose = async (event) => {
                const currentWsMessages = wsConnectionsRef.current[currentTab.id]?.messages || [];
                delete wsConnectionsRef.current[currentTab.id];

                setTabs((prev) => prev.map((t) => t.id === currentTab.id ? {
                    ...t,
                    wsConnected: false,
                    wsMessages: [...(t.wsMessages || []), {
                        type: "connection",
                        direction: "system",
                        data: `Disconnected (${event.code})`,
                        timestamp: new Date().toLocaleTimeString(),
                    }]
                } : t));

                // Save to history on disconnect if session was active
                if (event.code !== 1001) { // 1001 is going away
                    try {
                        await historyService.save({
                            request_type: "websocket",
                            method: "WEBSOCKET",
                            url: url,
                            status: 101,
                            status_text: "Switching Protocols",
                            body_meta: JSON.stringify({
                                wsMessages: currentTab.wsMessages // Note: currentTab might be stale here due to closure
                            }),
                            workspace_id: activeWorkspaceId ? (typeof activeWorkspaceId === 'string' ? parseInt(activeWorkspaceId, 10) : activeWorkspaceId) : undefined,
                        });
                    } catch (e) {
                        console.error("Failed to save WS history:", e);
                    }
                }
            };
        } catch (error: any) {
            console.error("WebSocket connection failed:", error);
        }
    }, [isAuthenticated, replaceVariables, setTabs, ensureResponsePanelVisibility]);

    const handleWebSocketSendMessage = useCallback((currentTab: Tab) => {
        const ws = wsConnectionsRef.current[currentTab.id];
        if (ws && ws.readyState === WebSocket.OPEN) {
            const message = replaceVariables(currentTab.wsMessage || "");
            ws.send(message);
            setTabs((prev) => prev.map((t) => t.id === currentTab.id ? {
                ...t,
                wsMessages: [...(t.wsMessages || []), {
                    type: "message",
                    direction: "sent",
                    data: message,
                    timestamp: new Date().toLocaleTimeString(),
                }]
            } : t));
        }
    }, [replaceVariables, setTabs]);

    const handleSocketIOConnect = useCallback((currentTab: Tab) => {
        if (!currentTab || currentTab.wsConnected) return;

        ensureResponsePanelVisibility();

        let url = replaceVariables(currentTab.url.trim());
        try {
            const socket = io(url, { transports: ["websocket", "polling"], autoConnect: false });
            wsConnectionsRef.current[currentTab.id] = socket;

            socket.on("connect", () => {
                setTabs((prev) => prev.map((t) => t.id === currentTab.id ? {
                    ...t,
                    wsConnected: true,
                    wsConnectionTime: Date.now(),
                    wsMessages: [...(t.wsMessages || []), {
                        type: "connection",
                        direction: "system",
                        data: `Connected (Socket.IO)`,
                        timestamp: new Date().toLocaleTimeString(),
                    }]
                } : t));

                // Register event listeners from Events tab
                const enabledEvents = currentTab.socketioEvents?.filter((e) => e.enabled && e.name) || [];
                enabledEvents.forEach((event) => {
                    const eventName = replaceVariables(event.name || "");
                    socket.on(eventName, (...args: any[]) => {
                        setTabs((prev) => prev.map((t) => t.id === currentTab.id ? {
                            ...t,
                            wsMessageCount: (t.wsMessageCount || 0) + 1,
                            wsMessages: [...(t.wsMessages || []), {
                                type: "event",
                                direction: "received",
                                event: event.name,
                                data: args.length === 1 ? args[0] : args,
                                timestamp: new Date().toLocaleTimeString(),
                            }]
                        } : t));
                    });
                });
            });

            socket.on("disconnect", (reason) => {
                delete wsConnectionsRef.current[currentTab.id];

                setTabs((prev) => prev.map((t) => t.id === currentTab.id ? {
                    ...t,
                    wsConnected: false,
                    wsMessages: [...(t.wsMessages || []), {
                        type: "connection",
                        direction: "system",
                        data: `Disconnected (${reason})`,
                        timestamp: new Date().toLocaleTimeString(),
                    }]
                } : t));
            });

            socket.on("connect_error", (error: any) => {
                setTabs((prev) => prev.map((t) => t.id === currentTab.id ? {
                    ...t,
                    wsMessages: [...(t.wsMessages || []), {
                        type: "error",
                        direction: "system",
                        data: `Connection error: ${error.message}`,
                        timestamp: new Date().toLocaleTimeString(),
                    }]
                } : t));
            });

            socket.connect();
        } catch (error: any) {
            console.error("Socket.IO connection failed:", error);
        }
    }, [replaceVariables, setTabs, ensureResponsePanelVisibility]);

    const handleSocketIODisconnect = useCallback(async (currentTab: Tab) => {
        const socket = wsConnectionsRef.current[currentTab.id];
        if (socket) {
            socket.disconnect();
            delete wsConnectionsRef.current[currentTab.id];
        }

        // Calculate session duration and response size
        const sessionDuration = currentTab.wsConnectionTime ? Date.now() - currentTab.wsConnectionTime : 0;
        const responseSize = JSON.stringify(currentTab.wsMessages || []).length;

        // Save Socket.IO session to history
        if (isAuthenticated) {
            try {
                await historyService.save({
                    request_type: "socketio",
                    method: "SOCKETIO",
                    url: currentTab.url,
                    headers: JSON.stringify(currentTab.headers || {}),
                    params: JSON.stringify(currentTab.params || {}),
                    auth_type: currentTab.authType || "none",
                    auth_data: JSON.stringify(currentTab.authData || {}),
                    body_type: "json",
                    body_meta: JSON.stringify({
                        socketioEvents: currentTab.socketioEvents || [],
                        socketioArgs: currentTab.socketioArgs || [],
                        socketioEventName: currentTab.socketioEventName || "",
                        socketioSelectedArgIndex: currentTab.socketioSelectedArgIndex || 0,
                        wsMessages: currentTab.wsMessages || [],
                        messageCount: currentTab.wsMessageCount || 0,
                        connectionTime: currentTab.wsConnectionTime,
                        disconnectionTime: Date.now(),
                    }),
                    body: JSON.stringify(currentTab.socketioArgs || []),
                    status: 200,
                    status_text: "OK",
                    response_headers: JSON.stringify({}),
                    response_body: JSON.stringify({
                        messageCount: currentTab.wsMessageCount || 0,
                        sessionDuration: sessionDuration,
                        events: currentTab.wsMessages || [],
                    }),
                    response_time: sessionDuration,
                    response_size: responseSize,
                    workspace_id: activeWorkspaceId ? (typeof activeWorkspaceId === 'string' ? parseInt(activeWorkspaceId, 10) : activeWorkspaceId) : undefined,
                });
            } catch (error) {
                console.error("Failed to save Socket.IO session to history:", error);
            }
        }
    }, [isAuthenticated, activeWorkspaceId]);

    const handleSocketIOEmit = useCallback((currentTab: Tab) => {
        const socket = wsConnectionsRef.current[currentTab.id];
        if (socket && socket.connected) {
            const eventName = currentTab.socketioEventName || "message";
            const args = (currentTab.socketioArgs || []).map(arg => {
                if (arg.format === 'json') {
                    try { return JSON.parse(replaceVariables(arg.value)); } catch { return replaceVariables(arg.value); }
                }
                return replaceVariables(arg.value);
            });

            socket.emit(eventName, ...args);
            setTabs((prev) => prev.map((t) => t.id === currentTab.id ? {
                ...t,
                wsMessages: [...(t.wsMessages || []), {
                    type: "event",
                    direction: "sent",
                    event: eventName,
                    data: args.length === 1 ? args[0] : args,
                    timestamp: new Date().toLocaleTimeString(),
                }]
            } : t));
        }
    }, [replaceVariables, setTabs]);

    const handleWebSocketToggle = useCallback((currentTab: Tab) => {
        if (currentTab.wsConnected) {
            const conn = wsConnectionsRef.current[currentTab.id];
            if (conn) {
                if (currentTab.requestType === "socketio") handleSocketIODisconnect(currentTab);
                else conn.close();
            }
        } else {
            if (currentTab.requestType === "socketio") handleSocketIOConnect(currentTab);
            else handleWebSocketConnect(currentTab);
        }
    }, [handleSocketIOConnect, handleWebSocketConnect, handleSocketIODisconnect]);

    return {
        handleWebSocketToggle,
        handleWebSocketSendMessage,
        handleSocketIODisconnect,
        handleSocketIOEmit,
    };
};
