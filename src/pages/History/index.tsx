import { useState, useEffect } from "preact/hooks";
import { useWorkspace } from "../../context/WorkspaceContext";
import { useAuth } from "../../hooks/useAuth";
import CommonLayout from "../../components/CommonLayout";
import HistoryList from "../../components/HistoryList";
import { useLocation } from "preact-iso";
import { HistoryItem } from "../Client/types";
import SpiderSpinner from "../../components/SpiderSpinner";

export default function History() {
    const { activeWorkspaceId } = useWorkspace();
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeWorkspaceId) {
            setLoading(true);
            const timer = setTimeout(() => setLoading(false), 500);
            return () => clearTimeout(timer);
        }
    }, [activeWorkspaceId]);

    const handleItemClick = (item: HistoryItem) => {
        location.route(`/history/${item.id}`);
    };

    return (
        <CommonLayout activeActivity="history">
            <div className="h-full flex flex-col bg-base-100 overflow-hidden relative">
                {loading && (
                    <div className="absolute inset-0 bg-base-100/60 z-50 flex flex-col items-center justify-center">
                        <SpiderSpinner className="w-12 h-12" />
                        <span className="text-xs text-base-content/40 mt-4 font-bold uppercase tracking-widest">
                            Retracing...
                        </span>
                    </div>
                )}
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-base-300/50">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-base-content">
                            History
                        </h2>
                        <p className="text-sm text-base-content/60 mt-1">
                            Browse and revisit past requests
                        </p>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden">
                    <HistoryList
                        workspaceId={activeWorkspaceId}
                        isAuthenticated={isAuthenticated}
                        onItemClick={handleItemClick}
                    />
                </div>
            </div>
        </CommonLayout>
    );
}
