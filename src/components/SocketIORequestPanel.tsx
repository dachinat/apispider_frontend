import URLInput from "./URLInput";
import ParamsTable from "./ParamsTable";
import HeadersTable from "./HeadersTable";
import CodeMirrorEditor from "./CodeMirrorEditor";
import { Tab } from "../pages/Client/types";

interface SocketIORequestPanelProps {
    currentTab: Tab;
    updateCurrentTab: (updates: Partial<Tab>) => void;
    parseUrlParams: (url: string) => Record<string, string>;
    buildUrlWithParams: (url: string, params: Record<string, string>) => string;
    handleWebSocketToggle: () => void;
    handleSocketIOEmit: () => void;
    handleSocketIOArgChange: (value: string) => void;
}

export default function SocketIORequestPanel({
    currentTab,
    updateCurrentTab,
    parseUrlParams,
    buildUrlWithParams,
    handleWebSocketToggle,
    handleSocketIOEmit,
    handleSocketIOArgChange,
}: SocketIORequestPanelProps) {
    return (
        <>
            <div className="overflow-hidden flex gap-0 rounded-lg border border-base-300 shadow-sm hover:shadow-md transition-all duration-200 focus-within:border-primary">
                <URLInput
                    className="input flex-1 border-0 rounded-none focus:outline-none bg-base-100"
                    placeholder="Enter Socket.IO server URL"
                    value={currentTab?.url || ""}
                    requestType="socketio"
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
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
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
                        className={`tab ${currentTab?.activeTab === "events" ? "tab-active !border-b-primary !border-b-2" : ""}`}
                        onClick={() => updateCurrentTab({ activeTab: "events" })}
                    >
                        Events
                        {currentTab?.socketioEvents && currentTab.socketioEvents.length > 0 && (
                            <span className="ml-1 opacity-60">({currentTab.socketioEvents.length})</span>
                        )}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 ml-1">Event Name</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                                    placeholder="e.g., message, chat_update"
                                    value={currentTab?.socketioEventName || ""}
                                    onInput={(e) => updateCurrentTab({ socketioEventName: (e.target as HTMLInputElement).value, saved: false })}
                                />
                            </div>
                            <div className="flex items-end justify-end">
                                <button
                                    className="btn btn-primary btn-sm px-8 font-bold shadow-primary/20"
                                    onClick={handleSocketIOEmit}
                                    disabled={!currentTab?.wsConnected || !currentTab?.socketioEventName}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    Emit Event
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 ml-1">
                                    Arguments ({(currentTab?.socketioArgs || []).length})
                                </label>
                                <div className="flex gap-4 items-center">
                                    <div className="bg-base-200/50 p-1 rounded-lg flex items-center gap-1">
                                        {["json", "text", "xml"].map((fmt) => (
                                            <button
                                                key={fmt}
                                                className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all duration-200 ${(currentTab?.socketioArgs || [])[currentTab?.socketioSelectedArgIndex || 0]?.format === fmt ? "bg-primary text-primary-content shadow-sm" : "text-base-content/60 hover:text-base-content hover:bg-base-300/50"}`}
                                                onClick={() => {
                                                    const args = [...(currentTab?.socketioArgs || [{ id: 1, value: "", format: "json" }])];
                                                    const idx = currentTab?.socketioSelectedArgIndex || 0;
                                                    args[idx] = { ...args[idx], format: fmt as any };
                                                    updateCurrentTab({ socketioArgs: args, saved: false });
                                                }}
                                            >
                                                {fmt}
                                            </button>
                                        ))}
                                    </div>
                                    <button className="btn btn-ghost btn-xs h-8 px-3 gap-1 hover:bg-base-200 border border-base-300" onClick={() => {
                                        const args = [...(currentTab?.socketioArgs || [])];
                                        args.push({ id: Date.now(), value: "", format: "json" });
                                        updateCurrentTab({ socketioArgs: args, saved: false });
                                    }}>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                        Add Arg
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-0 border border-base-300 rounded-lg overflow-hidden min-h-[200px]">
                                <div className="flex flex-col bg-base-200/50 border-r border-base-300 w-32 shrink-0">
                                    {currentTab?.socketioArgs?.map((arg, index) => (
                                        <div key={arg.id} className="relative group/arg">
                                            <button className={`w-full px-4 py-3 text-[10px] font-bold uppercase border-b border-base-300 text-left ${currentTab?.socketioSelectedArgIndex === index ? "bg-primary text-primary-content" : "hover:bg-base-300"}`} onClick={() => updateCurrentTab({ socketioSelectedArgIndex: index })}>
                                                Arg {index + 1}
                                            </button>
                                            {(currentTab?.socketioArgs || []).length > 1 && (
                                                <button
                                                    className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all duration-200 opacity-0 group-hover/arg:opacity-100 ${currentTab?.socketioSelectedArgIndex === index ? "text-primary-content hover:bg-white/20" : "text-error hover:bg-error/10"}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const args = currentTab?.socketioArgs || [];
                                                        const newArgs = args.filter((_, i) => i !== index);
                                                        const currentIndex = currentTab?.socketioSelectedArgIndex || 0;
                                                        updateCurrentTab({
                                                            socketioArgs: newArgs,
                                                            socketioSelectedArgIndex: currentIndex >= newArgs.length ? Math.max(0, newArgs.length - 1) : currentIndex,
                                                            saved: false,
                                                        });
                                                    }}
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex-1 min-h-[200px] overflow-hidden">
                                    <CodeMirrorEditor
                                        forceHeight={350}
                                        key={`socketio-${currentTab.id}-${currentTab.socketioSelectedArgIndex || 0}`}
                                        value={(currentTab?.socketioArgs || [])[currentTab?.socketioSelectedArgIndex || 0]?.value || ""}
                                        onChange={handleSocketIOArgChange}
                                        language={(currentTab?.socketioArgs || [])[currentTab?.socketioSelectedArgIndex || 0]?.format || "json"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentTab?.activeTab === "events" && (
                    <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between mb-2 px-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-base-content/50">
                                Managed Events
                            </label>
                            <button
                                className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline flex items-center gap-1"
                                onClick={() => {
                                    const events = currentTab?.socketioEvents || [];
                                    const newId = Math.max(...events.map((e) => e.id), 0) + 1;
                                    updateCurrentTab({
                                        socketioEvents: [
                                            ...events,
                                            {
                                                id: newId,
                                                name: "",
                                                enabled: true,
                                            },
                                        ],
                                        saved: false,
                                    });
                                }}
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                Add Event
                            </button>
                        </div>

                        <div className="space-y-2">
                            {(currentTab?.socketioEvents || []).length > 0 ? (
                                (currentTab?.socketioEvents || []).map((event) => (
                                    <div
                                        key={event.id}
                                        className="group flex items-center gap-3 p-2 bg-base-200/30 rounded-lg border border-base-300/50 hover:bg-base-200/50 transition-all duration-200"
                                    >
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-xs checkbox-primary"
                                            checked={event.enabled}
                                            onChange={(e) => {
                                                const events = currentTab?.socketioEvents || [];
                                                updateCurrentTab({
                                                    socketioEvents: events.map((ev) =>
                                                        ev.id === event.id
                                                            ? { ...ev, enabled: (e.target as HTMLInputElement).checked }
                                                            : ev
                                                    ),
                                                    saved: false,
                                                });
                                            }}
                                        />
                                        <input
                                            type="text"
                                            className="bg-transparent border-none focus:ring-0 text-sm font-mono flex-1 placeholder:italic placeholder:opacity-30"
                                            value={event.name}
                                            onChange={(e) => {
                                                const events = currentTab?.socketioEvents || [];
                                                updateCurrentTab({
                                                    socketioEvents: events.map((ev) =>
                                                        ev.id === event.id
                                                            ? { ...ev, name: (e.target as HTMLInputElement).value }
                                                            : ev
                                                    ),
                                                    saved: false,
                                                });
                                            }}
                                            placeholder="Event name (e.g., chat_message)"
                                        />
                                        <button
                                            className="p-1 px-2 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100 text-error hover:bg-error/10"
                                            onClick={() => {
                                                const events = currentTab?.socketioEvents || [];
                                                updateCurrentTab({
                                                    socketioEvents: events.filter(
                                                        (ev) => ev.id !== event.id
                                                    ),
                                                    saved: false,
                                                });
                                            }}
                                            title="Delete event"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-base-content/40 text-sm">
                                    <p>No managed events yet.</p>
                                    <p className="mt-1 text-xs">Click "Add Event" to create one.</p>
                                </div>
                            )}
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
