import { useState, useEffect, useMemo } from "preact/hooks";
import HistoryItem from "./HistoryItem";
import { historyService } from "../services/history";
import SpiderSpinner from "./SpiderSpinner";
import { HistoryItem as HistoryItemType } from "../pages/Client/types";

interface HistoryListProps {
    workspaceId: string | number | null;
    isAuthenticated: boolean;
    onItemClick: (item: HistoryItemType) => void;
    compact?: boolean;
}

interface GroupedHistory {
    Today: HistoryItemType[];
    Yesterday: HistoryItemType[];
    Earlier: HistoryItemType[];
}

export default function HistoryList({
    workspaceId,
    isAuthenticated,
    onItemClick,
    compact = false,
}: HistoryListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterMethod, setFilterMethod] = useState("all");
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<HistoryItemType[]>([]);

    useEffect(() => {
        if (!isAuthenticated || !workspaceId) {
            setHistory([]);
            setLoading(false);
            return;
        }
        loadHistory();
    }, [workspaceId, isAuthenticated]);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const response = await historyService.getAll({
                limit: 100,
                offset: 0,
                workspace_id: workspaceId,
            });
            setHistory(Array.isArray(response) ? response : (response?.data || []));
        } catch (error) {
            console.error("Failed to load history:", error);
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearAll = async () => {
        if (confirm("Clear all history?")) {
            try {
                await historyService.clearAll();
                setHistory([]);
            } catch (error) {
                console.error("Failed to clear history:", error);
            }
        }
    };

    const handleDelete = async (id: string | number) => {
        try {
            await historyService.delete(id);
            setHistory((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Failed to delete history entry:", error);
        }
    };

    const filteredHistory = useMemo(() => {
        return history.filter((item) => {
            const matchesSearch = item.url.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesMethod = filterMethod === "all" || item.method === filterMethod;
            return matchesSearch && matchesMethod;
        });
    }, [history, searchQuery, filterMethod]);

    const groups = useMemo<GroupedHistory>(() => {
        const sorted = [...filteredHistory].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        const grouped: GroupedHistory = {
            Today: [],
            Yesterday: [],
            Earlier: [],
        };

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        sorted.forEach((item) => {
            const itemDate = new Date(item.created_at);
            const d = new Date(
                itemDate.getFullYear(),
                itemDate.getMonth(),
                itemDate.getDate()
            );

            if (d.getTime() === today.getTime()) {
                grouped.Today.push(item);
            } else if (d.getTime() === yesterday.getTime()) {
                grouped.Yesterday.push(item);
            } else {
                grouped.Earlier.push(item);
            }
        });

        return grouped;
    }, [filteredHistory]);

    return (
        <div className="flex flex-col h-full relative">
            {/* Search and Filter */}
            <div className={`p-4 ${compact ? "space-y-2" : "flex flex-col md:flex-row gap-4 mb-2"}`}>
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search history..."
                        className="input input-sm w-full h-10 pl-10 bg-base-200/50 border-0 focus:bg-base-200 rounded-xl"
                        value={searchQuery}
                        onInput={(e: any) => setSearchQuery(e.target.value)}
                    />
                    <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        className="select select-sm h-10 bg-base-200/50 border-0 focus:bg-base-200 rounded-xl flex-1 md:flex-none"
                        value={filterMethod}
                        onChange={(e: any) => setFilterMethod(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                    {history.length > 0 && (
                        <button onClick={handleClearAll} className="btn btn-sm btn-ghost text-error/60 hover:text-error h-10 px-3">
                            Clear
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                {history.length === 0 && !loading ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-base font-medium text-base-content/60">No history yet</p>
                    </div>
                ) : (
                    Object.entries(groups).map(([name, items]) => {
                        if (items.length === 0) return null;
                        return (
                            <div key={name} className="mt-4 first:mt-0">
                                <div className="flex items-center gap-3 mb-2 px-5">
                                    <span className="text-[10px] font-bold text-base-content/30 uppercase tracking-widest">
                                        {name}
                                    </span>
                                    <div className="h-px flex-1 bg-base-300/30"></div>
                                </div>
                                <div className={`${compact ? "" : "bg-base-100 rounded-2xl border border-base-300/50 shadow-sm mx-4 overflow-hidden divide-y divide-base-200/50"}`}>
                                    {items.map((item) => (
                                        <HistoryItem
                                            key={item.id}
                                            item={item}
                                            onDelete={handleDelete}
                                            onClick={onItemClick}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
