import { useState, useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";
import CommonLayout from "../../components/CommonLayout";
import Profile from "./tabs/Profile";
import Avatar from "./tabs/Avatar";
import Security from "./tabs/Security";
import Appearance from "./tabs/Appearance";
import ImportExport from "./tabs/ImportExport";
import SpiderSpinner from "../../components/SpiderSpinner";

export default function Settings() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("name");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Check for tab in query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (
      tab &&
      ["name", "avatar", "password", "theme", "import"].includes(tab)
    ) {
      setActiveTab(tab);
    } else {
      setActiveTab("name");
    }
  }, [location.url]);

  return (
    <CommonLayout activeActivity="settings">
      <div className="h-full flex flex-col bg-base-100 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-base-100/60 z-50 flex flex-col items-center justify-center">
            <SpiderSpinner className="w-12 h-12" />
            <span className="text-xs text-base-content/40 mt-4 font-bold uppercase tracking-widest">
              Configuring...
            </span>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto w-full">
            {" "}
            {/*max-w-5xl */}
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-base-content">
                Settings
              </h2>
              <p className="text-sm text-base-content/60 mt-1">
                Manage your account settings and preferences
              </p>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar Navigation */}
              <nav className="lg:w-56 flex-shrink-0">
                <ul className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                  <li>
                    <button
                      onClick={() => setActiveTab("name")}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "name"
                        ? "bg-primary text-primary-content shadow-sm"
                        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                        }`}
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="whitespace-nowrap">Profile</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("avatar")}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "avatar"
                        ? "bg-primary text-primary-content shadow-sm"
                        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                        }`}
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="whitespace-nowrap">Avatar</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("password")}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "password"
                        ? "bg-primary text-primary-content shadow-sm"
                        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                        }`}
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <span className="whitespace-nowrap">Security</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("theme")}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "theme"
                        ? "bg-primary text-primary-content shadow-sm"
                        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                        }`}
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        />
                      </svg>
                      <span className="whitespace-nowrap">Appearance</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("import")}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "import"
                        ? "bg-primary text-primary-content shadow-sm"
                        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                        }`}
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
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
                      <span className="whitespace-nowrap">Import/Export</span>
                    </button>
                  </li>
                </ul>
              </nav>

              {/* Main Content Area */}
              <div className="flex-1 bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8">
                  {activeTab === "name" && <Profile />}
                  {activeTab === "avatar" && <Avatar />}
                  {activeTab === "password" && <Security />}
                  {activeTab === "theme" && <Appearance />}
                  {activeTab === "import" && <ImportExport />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}
