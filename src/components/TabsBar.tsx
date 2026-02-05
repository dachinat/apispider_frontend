import { getMethodColor } from "../utils/methods";
import { Tab } from "../pages/Client/types";

interface TabItem {
    id: string | number;
    name: string;
    method?: string;
    requestType?: string;
    bodyType?: string;
    saved?: boolean;
    [key: string]: any;
}

interface TabsBarProps {
    tabs: TabItem[];
    activeTabId: string | number;
    setActiveTabId: (id: any) => void;
    addNewTab: () => void;
    closeTab: (id: any, e: any) => void;
}

export default function TabsBar({
    tabs,
    activeTabId,
    setActiveTabId,
    addNewTab,
    closeTab,
}: TabsBarProps) {
    return (
        <div className="flex items-center bg-base-100 border-b border-base-300">
            <div
                className="flex flex-1 overflow-x-auto no-scrollbar"
                onDblClick={(e) => {
                    if (e.target === e.currentTarget) {
                        addNewTab();
                    }
                }}
            >
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        onClick={() => setActiveTabId(tab.id)}
                        className={`flex min-w-32 items-center gap-2 px-4 py-2 border-r border-base-300 cursor-pointer max-w-xs group hover:bg-base-200 transition-colors ${activeTabId === tab.id ? "bg-base-200 border-b-2 border-b-primary" : ""}`}
                    >
                        {tab.method &&
                            tab.requestType !== "websocket" &&
                            tab.requestType !== "socketio" &&
                            tab.method !== "WEBSOCKET" &&
                            tab.method !== "SOCKETIO" &&
                            tab.bodyType !== "graphql" && (
                                <span className={`badge badge-xs font-bold ${getMethodColor(tab.method)}`}>
                                    {tab.method}
                                </span>
                            )}
                        {(tab.requestType === "websocket" || tab.method === "WEBSOCKET") && (
                            <span className="text-[9px] font-black w-8 text-center py-0.5 rounded bg-purple-500/20 text-purple-500">
                                WS
                            </span>
                        )}
                        {(tab.requestType === "socketio" || tab.method === "SOCKETIO") && (
                            <span className="text-[9px] font-black w-8 text-center py-0.5 rounded bg-cyan-500/20 text-cyan-500">
                                SOCK
                            </span>
                        )}
                        {tab.bodyType === "graphql" && (
                            <span className="text-[9px] font-black w-8 text-center py-0.5 rounded bg-pink-500/20 text-pink-500">
                                GQL
                            </span>
                        )}
                        <span className="text-sm truncate flex-1 min-w-0 font-medium">
                            {tab.name}
                        </span>
                        {!tab.saved && (
                            <span className="w-2 h-2 rounded-full bg-warning" title="Unsaved changes"></span>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                closeTab(tab.id, e);
                            }}
                            className="btn btn-ghost btn-xs btn-square opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Close tab"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
            <button
                onClick={addNewTab}
                className="btn btn-ghost btn-sm btn-square shrink-0 mx-1"
                title="New Request"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>
    );
}
