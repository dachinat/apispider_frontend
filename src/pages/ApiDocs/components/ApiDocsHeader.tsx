import { ApiDocTab } from "../types";

interface ApiDocsHeaderProps {
  currentTab: ApiDocTab;
  loading: boolean;
  onUpdateTab: (updates: Partial<ApiDocTab>) => void;
  onPreview: () => void;
  onRefreshSnapshot: () => void;
  getDocUrl: (slug?: string) => string;
}

export default function ApiDocsHeader({
  currentTab,
  loading,
  onUpdateTab,
  onPreview,
  onRefreshSnapshot,
  getDocUrl,
}: ApiDocsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${currentTab.is_published ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}
          >
            {currentTab.is_published ? "Published" : "Draft"}
          </div>
          {!currentTab.saved && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
              Unsaved Changes
            </div>
          )}
        </div>
        <input
          type="text"
          className="text-3xl font-bold bg-transparent border-none outline-none focus:ring-0 w-full p-0 tracking-tight placeholder:opacity-20"
          placeholder="API Documentation Name"
          value={currentTab.name}
          onInput={(e: any) =>
            onUpdateTab({ name: e.target.value, saved: false })
          }
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {currentTab?.slug && (
            <div className="bg-base-200 border border-base-300 rounded-lg pl-3 pr-1 py-1 flex items-center gap-3 group">
              <span className="text-[10px] font-bold uppercase text-base-content/40 tracking-wider">
                Public URL
              </span>
              <span className="text-xs font-mono font-medium text-primary/80 truncate max-w-[300px]">
                {getDocUrl(currentTab.slug)}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(getDocUrl(currentTab.slug));
                  //showToast("URL copied to clipboard", "success");
                }}
                className="btn btn-ghost btn-xs btn-square hover:bg-primary/10 hover:text-primary transition-colors"
                title="Copy URL"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPreview}
          className="btn btn-ghost btn-sm h-8 rounded-lg border border-base-300 gap-2 font-bold px-3 hover:bg-base-200"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          Preview
        </button>
        {currentTab.is_published && currentTab.docId && (
          <button
            type="button"
            onClick={onRefreshSnapshot}
            className="btn btn-ghost btn-sm h-8 rounded-lg border border-base-300 gap-2 font-bold px-3 hover:bg-base-200"
            title="Refresh Snapshot"
            disabled={loading}
          >
            <svg
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        )}
        <div className="join bg-base-200 p-0.5 border border-base-300 rounded-lg">
          <button
            className={`join-item btn btn-sm h-7 rounded-md font-bold border-none transition-all ${currentTab.is_published ? "bg-primary text-primary-content shadow-sm" : "bg-transparent text-base-content/50 hover:bg-base-300"}`}
            onClick={() => onUpdateTab({ is_published: true, saved: false })}
          >
            Published
          </button>
          <button
            className={`join-item btn btn-sm h-7 rounded-md font-bold border-none transition-all ${!currentTab.is_published ? "bg-base-content text-base-100 shadow-sm" : "bg-transparent text-base-content/50 hover:bg-base-300"}`}
            onClick={() => onUpdateTab({ is_published: false, saved: false })}
          >
            Private
          </button>
        </div>
      </div>
    </div>
  );
}
