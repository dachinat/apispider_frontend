import URLInput from "./URLInput";
import ParamsTable from "./ParamsTable";
import HeadersTable from "./HeadersTable";
import CodeMirrorEditor from "./CodeMirrorEditor";
import { Tab } from "../pages/Client/types";

interface WebSocketRequestPanelProps {
    currentTab: Tab;
    updateCurrentTab: (updates: Partial<Tab>) => void;
    parseUrlParams: (url: string) => Record<string, string>;
    buildUrlWithParams: (url: string, params: Record<string, string>) => string;
    handleWebSocketToggle: () => void;
    handleWebSocketSendMessage: () => void;
    handleWsMessageChange: (value: string) => void;
}

export default function WebSocketRequestPanel({
    currentTab,
    updateCurrentTab,
    parseUrlParams,
    buildUrlWithParams,
    handleWebSocketToggle,
    handleWebSocketSendMessage,
    handleWsMessageChange,
}: WebSocketRequestPanelProps) {
    return (
        <>
            <div className="overflow-hidden flex gap-0 rounded-lg border border-base-300 shadow-sm hover:shadow-md transition-all duration-200 focus-within:border-primary">
                <URLInput
                    className="input flex-1 border-0 rounded-none focus:outline-none bg-base-100"
                    placeholder="Enter WebSocket URL (ws:// or wss://)"
                    value={currentTab?.url || ""}
                    requestType="websocket"
                    onChange={(e) => {
                        const newUrl = (e.target as HTMLInputElement).value;
                        const parsedParams = parseUrlParams(newUrl);
                        updateCurrentTab({ url: newUrl, params: parsedParams, saved: false });
                    }}
                    disabled={currentTab?.wsConnected}
                />
                <button
                    type="button"
                    className={`btn border-0 rounded-none shadow-none hover:shadow-none transition-all duration-200 hover:brightness-110 active:scale-[0.98] ${currentTab?.wsConnected ? "btn-ghost" : "btn-primary"}`}
                    onClick={handleWebSocketToggle}
                    disabled={!currentTab?.url}
                >
                    {currentTab?.wsConnected ? (
                        <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            Disconnect
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            Connect
                        </>
                    )}
                </button>
            </div>

            <div className="tabs tabs-bordered mt-4 flex">
                <div className="flex-1 flex">
                    <button
                        className={`tab ${currentTab?.activeTab === "message" ? "tab-active !border-b-primary !border-b-2" : ""}`}
                        onClick={() => updateCurrentTab({ activeTab: "message" })}
                    >
                        Message
                    </button>
                    <button
                        className={`tab ${currentTab?.activeTab === "params" ? "tab-active !border-b-primary !border-b-2" : ""}`}
                        onClick={() => updateCurrentTab({ activeTab: "params" })}
                    >
                        Params
                        {currentTab?.params && Object.keys(currentTab.params).length > 0 && (
                            <span className="ml-1 opacity-60">({Object.keys(currentTab.params).length})</span>
                        )}
                    </button>
                    <button
                        className={`tab ${currentTab?.activeTab === "headers" ? "tab-active !border-b-primary !border-b-2" : ""}`}
                        onClick={() => updateCurrentTab({ activeTab: "headers" })}
                    >
                        Headers
                        {currentTab?.headers && Object.keys(currentTab.headers).length > 0 && (
                            <span className="ml-1 opacity-60">({Object.keys(currentTab.headers).length})</span>
                        )}
                    </button>
                </div>
            </div>

            <div className="mt-4 bg-base-100 rounded-lg border border-base-300 overflow-visible">
                {currentTab?.activeTab === "message" && (
                    <div className="p-4 space-y-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 ml-1">Message Format</label>
                                <div className="bg-base-200/50 p-1 rounded-lg flex items-center gap-1 w-full md:w-fit overflow-x-auto no-scrollbar">
                                    {["text", "json", "xml", "html", "base64", "hex"].map((fmt) => (
                                        <button
                                            key={fmt}
                                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 whitespace-nowrap ${currentTab?.wsMessageFormat === fmt ? "bg-primary text-primary-content shadow-sm" : "text-base-content/60 hover:text-base-content hover:bg-base-300/50"}`}
                                            onClick={() => updateCurrentTab({ wsMessageFormat: fmt as any, saved: false })}
                                        >
                                            {fmt.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-end">
                                <button
                                    className="btn btn-primary btn-sm px-6 font-bold shadow-primary/20"
                                    onClick={handleWebSocketSendMessage}
                                    disabled={!currentTab?.wsConnected || !currentTab?.wsMessage}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                    Send Message
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="label"><span className="label-text font-semibold">Message Content</span></label>
                            <CodeMirrorEditor
                                forceHeight={125}
                                key={`ws-${currentTab.id}`}
                                value={currentTab?.wsMessage || ""}
                                onChange={handleWsMessageChange}
                                language={currentTab?.wsMessageFormat === "json" ? "json" : currentTab?.wsMessageFormat === "xml" ? "xml" : "text"}
                                placeholder="Enter message to send..."
                            />
                        </div>
                    </div>
                )}

                {currentTab?.activeTab === "params" && (
                    <div className="p-4">
                        <ParamsTable
                            params={currentTab?.params || {}}
                            onChange={(params) => {
                                const newUrl = buildUrlWithParams(currentTab?.url?.split("?")[0] || "", params);
                                updateCurrentTab({ params, url: newUrl, saved: false });
                            }}
                        />
                    </div>
                )}

                {currentTab?.activeTab === "headers" && (
                    <div className="p-4">
                        <HeadersTable
                            headers={currentTab?.headers || {}}
                            onChange={(headers) => updateCurrentTab({ headers, saved: false })}
                        />
                    </div>
                )}
            </div>
        </>
    );
}
