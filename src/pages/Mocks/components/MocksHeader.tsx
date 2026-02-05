import { MockTab, MockConfig } from "../types";

interface MocksHeaderProps {
  currentTab: MockTab;
  mockConfig: MockConfig | null;
  getMockBaseUrl: (slug?: string) => string;
  updateCurrentTab: (updates: Partial<MockTab>) => void;
  onSaveToEnv: () => void;
  onDeleteClick: () => void;
}

export default function MocksHeader({
  currentTab,
  mockConfig,
  getMockBaseUrl,
  updateCurrentTab,
  onSaveToEnv,
  onDeleteClick,
}: MocksHeaderProps) {
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
          placeholder="Mock Server Name"
          value={currentTab.name}
          onInput={(e: any) => updateCurrentTab({ name: e.target.value })}
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {currentTab?.slug && (
            <>
              <div className="bg-base-200 border border-base-300 rounded-lg pl-3 pr-1 py-1 flex items-center gap-3 group">
                <span className="text-[10px] font-bold uppercase text-base-content/40 tracking-wider">
                  Public URL
                </span>
                <span className="text-xs font-mono font-medium text-primary/80 truncate max-w-[300px]">
                  {getMockBaseUrl(currentTab.slug)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      getMockBaseUrl(currentTab.slug),
                    );
                    //showToast("URL copied to clipboard", "success");
                  }}
                  className="btn btn-ghost btn-xs btn-square hover:bg-primary/10 hover:text-primary transition-colors"
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
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-sm h-8 rounded-lg border border-base-300 gap-2 font-bold px-3"
          >
            Actions
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[2] menu p-2 shadow-xl bg-base-100 rounded-xl w-52 border border-base-300 mt-2"
          >
            <li>
              <button
                onClick={onSaveToEnv}
                disabled={!currentTab.is_published}
                className="font-bold text-xs py-2.5"
              >
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Save to Environment
              </button>
            </li>
            <div className="divider my-1"></div>
            <li>
              <button
                onClick={onDeleteClick}
                className="font-bold text-xs py-2.5 text-error"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Server
              </button>
            </li>
          </ul>
        </div>
        <div className="join bg-base-200 p-0.5 border border-base-300 rounded-lg">
          <button
            className={`join-item btn btn-sm h-7 rounded-md font-bold border-none transition-all ${currentTab.is_published ? "bg-primary text-primary-content shadow-sm" : "bg-transparent text-base-content/50 hover:bg-base-300"}`}
            onClick={() => updateCurrentTab({ is_published: true })}
          >
            Published
          </button>
          <button
            className={`join-item btn btn-sm h-7 rounded-md font-bold border-none transition-all ${!currentTab.is_published ? "bg-base-content text-base-100 shadow-sm" : "bg-transparent text-base-content/50 hover:bg-base-300"}`}
            onClick={() => updateCurrentTab({ is_published: false })}
          >
            Private
          </button>
        </div>
      </div>
    </div>
  );
}
