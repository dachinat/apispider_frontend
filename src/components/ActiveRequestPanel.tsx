import SelectionScreen from "./SelectionScreen";
import HttpRequestPanel from "./HttpRequestPanel";
import WebSocketRequestPanel from "./WebSocketRequestPanel";
import SocketIORequestPanel from "./SocketIORequestPanel";
import { Tab } from "../pages/Client/types";

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

interface ActiveRequestPanelProps {
    currentTab: Tab | null;
    handleRequestTypeSelect: (type: string) => void;
    isLoading: boolean;
    updateCurrentTab: (updates: Partial<Tab>) => void;
    parseUrlParams: (url: string) => Record<string, string>;
    buildUrlWithParams: (url: string, params: Record<string, string>) => string;
    handleSendRequest: () => void;
    generateHTTPPreview?: () => string;
    debouncedUpdateBodyJson?: (value: string) => void;
    debouncedUpdateBodyXml?: (value: string) => void;
    debouncedUpdateBodyText?: (value: string) => void;
    handleWebSocketToggle?: () => void;
    handleWebSocketSendMessage?: () => void;
    handleWsMessageChange?: (value: string) => void;
    handleSocketIOEmit?: () => void;
    handleSocketIOArgChange?: (value: string) => void;
}

export default function ActiveRequestPanel({
    currentTab,
    handleRequestTypeSelect,
    isLoading,
    updateCurrentTab,
    parseUrlParams,
    buildUrlWithParams,
    handleSendRequest,
    generateHTTPPreview,
    debouncedUpdateBodyJson,
    debouncedUpdateBodyXml,
    debouncedUpdateBodyText,
    handleWebSocketToggle,
    handleWebSocketSendMessage,
    handleWsMessageChange,
    handleSocketIOEmit,
    handleSocketIOArgChange,
}: ActiveRequestPanelProps) {
    return (
        <div className={`flex-1 ${!currentTab || currentTab.requestType === null ? "p-0" : "p-4"}`} style={{ overflow: "visible" }}>
            {!currentTab || currentTab.requestType === null ? (
                <SelectionScreen onSelect={handleRequestTypeSelect} />
            ) : currentTab.requestType === "http" ? (
                <HttpRequestPanel
                    currentTab={currentTab}
                    isLoading={isLoading}
                    methods={methods}
                    updateCurrentTab={updateCurrentTab}
                    parseUrlParams={parseUrlParams}
                    buildUrlWithParams={buildUrlWithParams}
                    handleSendRequest={handleSendRequest}
                    generateHTTPPreview={generateHTTPPreview}
                    debouncedUpdateBodyJson={debouncedUpdateBodyJson}
                    debouncedUpdateBodyXml={debouncedUpdateBodyXml}
                    debouncedUpdateBodyText={debouncedUpdateBodyText}
                />
            ) : currentTab.requestType === "websocket" ? (
                <WebSocketRequestPanel
                    currentTab={currentTab}
                    updateCurrentTab={updateCurrentTab}
                    parseUrlParams={parseUrlParams}
                    buildUrlWithParams={buildUrlWithParams}
                    handleWebSocketToggle={handleWebSocketToggle!}
                    handleWebSocketSendMessage={handleWebSocketSendMessage!}
                    handleWsMessageChange={handleWsMessageChange!}
                />
            ) : currentTab.requestType === "socketio" ? (
                <SocketIORequestPanel
                    currentTab={currentTab}
                    updateCurrentTab={updateCurrentTab}
                    parseUrlParams={parseUrlParams}
                    buildUrlWithParams={buildUrlWithParams}
                    handleWebSocketToggle={handleWebSocketToggle!}
                    handleSocketIOEmit={handleSocketIOEmit!}
                    handleSocketIOArgChange={handleSocketIOArgChange!}
                />
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-lg opacity-50">{currentTab.requestType} requests coming soon...</p>
                </div>
            )}
        </div>
    );
}
