import HttpRequestPanel from "../../../components/HttpRequestPanel";
import WebSocketRequestPanel from "../../../components/WebSocketRequestPanel";
import SocketIORequestPanel from "../../../components/SocketIORequestPanel";
import SelectionScreen from "../../../components/SelectionScreen";
import { Tab, RequestType } from "../types";
import { DEFAULT_HEADERS, WEBSOCKET_HEADERS, SOCKETIO_HEADERS } from "../constants";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

interface RequestPanelSwitcherProps {
    currentTab: Tab | null;
    updateCurrentTab: (updates: Partial<Tab>) => void;
    updateTab: (id: string | number, updates: Partial<Tab>) => void;
    handleSendRequest: () => void;
    generateHTTPPreview: () => string;
    debouncedUpdateBodyJson: (val: string) => void;
    debouncedUpdateBodyXml: (val: string) => void;
    debouncedUpdateBodyText: (val: string) => void;
    handleWebSocketToggle: (currentTab: Tab) => void;
    handleWebSocketSendMessage: (currentTab: Tab) => void;
    handleSocketIOEmit: (currentTab: Tab) => void;
    parseUrlParams: (url: string) => any;
    buildUrlWithParams: (url: string, params: any) => string;
}

export default function RequestPanelSwitcher({
    currentTab,
    updateCurrentTab,
    updateTab,
    handleSendRequest,
    generateHTTPPreview,
    debouncedUpdateBodyJson,
    debouncedUpdateBodyXml,
    debouncedUpdateBodyText,
    handleWebSocketToggle,
    handleWebSocketSendMessage,
    handleSocketIOEmit,
    parseUrlParams,
    buildUrlWithParams,
}: RequestPanelSwitcherProps) {
    if (!currentTab || !currentTab.requestType) {
        return (
            <SelectionScreen
                onSelect={(type) => {
                    if (type === "graphql") {
                        updateCurrentTab({
                            name: "New GraphQL Request",
                            requestType: "http",
                            method: "POST",
                            url: "https://graphqlplaceholder.vercel.app/graphql",
                            activeTab: "body",
                            bodyType: "graphql",
                            headers: {
                                ...DEFAULT_HEADERS,
                                "Content-Type": "application/json",
                            },
                        });
                    } else {
                        const getHeadersForType = (reqType: string) => {
                            if (reqType === "websocket") return { ...WEBSOCKET_HEADERS };
                            if (reqType === "socketio") return { ...SOCKETIO_HEADERS };
                            return { ...DEFAULT_HEADERS };
                        };

                        updateCurrentTab({
                            requestType: type as RequestType,
                            activeTab: type === "http" ? "params" : "message",
                            headers: getHeadersForType(type),
                        });
                    }
                }}
            />
        );
    }

    return (
        <div className="">
            {currentTab.requestType === "http" && (
                <HttpRequestPanel
                    currentTab={currentTab}
                    isLoading={false}
                    methods={METHODS}
                    updateCurrentTab={updateCurrentTab}
                    parseUrlParams={parseUrlParams}
                    buildUrlWithParams={buildUrlWithParams}
                    handleSendRequest={handleSendRequest}
                    generateHTTPPreview={generateHTTPPreview}
                    debouncedUpdateBodyJson={debouncedUpdateBodyJson}
                    debouncedUpdateBodyXml={debouncedUpdateBodyXml}
                    debouncedUpdateBodyText={debouncedUpdateBodyText}
                />
            )}
            {currentTab.requestType === "websocket" && (
                <WebSocketRequestPanel
                    currentTab={currentTab}
                    updateCurrentTab={updateCurrentTab}
                    parseUrlParams={parseUrlParams}
                    buildUrlWithParams={buildUrlWithParams}
                    handleWebSocketToggle={() => handleWebSocketToggle(currentTab)}
                    handleWebSocketSendMessage={() => handleWebSocketSendMessage(currentTab)}
                    handleWsMessageChange={(val) =>
                        updateTab(currentTab.id, { wsMessage: val, saved: false })
                    }
                />
            )}
            {currentTab.requestType === "socketio" && (
                <SocketIORequestPanel
                    currentTab={currentTab}
                    updateCurrentTab={updateCurrentTab}
                    parseUrlParams={parseUrlParams}
                    buildUrlWithParams={buildUrlWithParams}
                    handleWebSocketToggle={() => handleWebSocketToggle(currentTab)}
                    handleSocketIOEmit={() => handleSocketIOEmit(currentTab)}
                    handleSocketIOArgChange={(val) => {
                        const selectedIndex = currentTab.socketioSelectedArgIndex || 0;
                        const args = [...(currentTab.socketioArgs || [])];
                        if (args.length === 0) {
                            args.push({
                                id: Date.now(),
                                value: val,
                                format: "json",
                            });
                        } else if (args[selectedIndex]) {
                            args[selectedIndex] = {
                                ...args[selectedIndex],
                                value: val,
                            };
                        }
                        updateTab(currentTab.id, {
                            socketioArgs: args,
                            saved: false,
                        });
                    }}
                />
            )}
        </div>
    );
}
