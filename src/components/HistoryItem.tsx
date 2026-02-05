import { getMethodColor } from "../utils/methods";
import { HistoryItem as HistoryItemType } from "../pages/Client/types";

interface HistoryItemProps {
    item: HistoryItemType;
    onDelete: (id: string | number) => void;
    onClick: (item: HistoryItemType) => void;
}

export default function HistoryItem({
    item,
    onDelete,
    onClick,
}: HistoryItemProps) {
    const getStatusColor = (status: number) => {
        if (status === 0) return "text-error bg-error/10";
        if (status >= 200 && status < 300) return "text-success bg-success/10";
        if (status >= 300 && status < 400) return "text-info bg-info/10";
        if (status >= 400 && status < 500) return "text-warning bg-warning/10";
        if (status >= 500) return "text-error bg-error/10";
        return "text-base-content/40 bg-base-200";
    };

    const formatTime = (isoString: string) => {
        try {
            const date = new Date(isoString);
            return date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (e) {
            return "";
        }
    };

    return (
        <div
            onClick={() => onClick(item)}
            className="group px-4 py-3 hover:bg-base-200/30 transition-colors cursor-pointer"
        >
            <div className="flex items-center gap-3">
                {/* Method Badge */}
                <div className="flex-shrink-0">
                    {(item.method === "WEBSOCKET" || (item.request_type || item.requestType) === "websocket") && (
                        <span className="text-[8px] font-black w-8 text-center py-0.5 rounded bg-purple-500/20 text-purple-500 inline-block">
                            WS
                        </span>
                    )}
                    {(item.method === "SOCKETIO" || (item.request_type || item.requestType) === "socketio") && (
                        <span className="text-[8px] font-black w-8 text-center py-0.5 rounded bg-cyan-500/20 text-cyan-500 inline-block">
                            SOCK
                        </span>
                    )}
                    {(item.body_type || item.bodyType) === "graphql" && (
                        <span className="text-[8px] font-black w-8 text-center py-0.5 rounded bg-pink-500/20 text-pink-500 inline-block">
                            GQL
                        </span>
                    )}
                    {item.method !== "WEBSOCKET" && item.method !== "SOCKETIO" && (item.request_type || item.requestType) !== "websocket" && (item.request_type || item.requestType) !== "socketio" && (item.body_type || item.bodyType) !== "graphql" && (
                        <span
                            className={`text-[9px] font-black w-10 text-center py-0.5 rounded ${getMethodColor(item.method).replace("badge", "bg")}/20 ${getMethodColor(item.method).replace("badge-", "text-")} inline-block`}
                        >
                            {item.method}
                        </span>
                    )}
                </div>

                {/* URL */}
                <div className="flex-1 min-w-0">
                    <span className="text-sm truncate block font-medium text-base-content/80 group-hover:text-base-content transition-colors">
                        {item.url}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5 md:hidden text-[9px] text-base-content/40 font-medium">
                        {item.response_time !== undefined && (
                            <span>{item.response_time} ms</span>
                        )}
                        {item.response_size !== undefined && (
                            <span>{(item.response_size / 1024).toFixed(1)} KB</span>
                        )}
                    </div>
                </div>

                {/* Right side info */}
                <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="hidden md:flex items-center gap-3 text-[10px] text-base-content/40 font-medium whitespace-nowrap">
                        {item.response_time !== undefined && (
                            <span>{item.response_time} ms</span>
                        )}
                        {item.response_size !== undefined && (
                            <span>{(item.response_size / 1024).toFixed(1)} KB</span>
                        )}
                    </div>

                    {/* Status */}
                    {item.status !== undefined && item.status !== null && (
                        <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${getStatusColor(item.status)}`}
                        >
                            {item.status}
                        </span>
                    )}

                    {/* Time */}
                    <span className="text-xs text-base-content/40 w-14 text-right tabular-nums">
                        {formatTime(item.created_at)}
                    </span>

                    {/* Delete Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.id);
                        }}
                        className="btn btn-ghost btn-sm btn-square opacity-0 group-hover:opacity-100 text-base-content/40 hover:text-error hover:bg-error/10 transition-all"
                        title="Delete"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
