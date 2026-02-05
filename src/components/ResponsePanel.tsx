import { StateUpdater } from "preact/hooks";
import ResponseLayoutIcon from "./ResponseLayoutIcon";
import CodeMirrorEditor from "./CodeMirrorEditor";
import { prettify } from "../utils/prettify";
import { Tab } from "../pages/Client/types";

interface ResponsePanelProps {
  currentTab: Tab | null;
  responsePosition: "bottom" | "right";
  setResponsePosition: (
    val:
      | "bottom"
      | "right"
      | ((prev: "bottom" | "right") => "bottom" | "right"),
  ) => void;
  panelSize: number;
  setPanelSize: (size: number) => void;
  updateCurrentTab: (updates: Partial<Tab>) => void;
  handleExportWebSocketMessages?: () => void;
}

export default function ResponsePanel({
  currentTab,
  responsePosition,
  setResponsePosition,
  panelSize,
  setPanelSize,
  updateCurrentTab,
  handleExportWebSocketMessages,
}: ResponsePanelProps) {
  const formatSize = (bytes?: number) => {
    if (bytes === undefined) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div
      className={`bg-base-100 flex flex-col overflow-hidden ${responsePosition === "bottom" ? "border-t border-base-300" : "border-l border-base-300"}`}
      style={{
        [responsePosition === "bottom" ? "height" : "width"]: `${panelSize}px`,
        [responsePosition === "bottom" ? "minHeight" : "minWidth"]:
          `${panelSize}px`,
      }}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-base-300 bg-base-100">
        <h3 className="font-semibold text-sm">
          {currentTab?.requestType === "websocket" && "WebSocket Messages"}
          {currentTab?.requestType === "socketio" && "Socket.IO Events"}
          {currentTab?.requestType === "http" &&
            (currentTab?.bodyType === "graphql"
              ? "GraphQL Response"
              : "HTTP Response")}
          {!currentTab?.requestType && "Response"}
        </h3>
        <div className="flex gap-2 items-center text-sm">
          {currentTab?.requestType === "http" && currentTab?.responseStatus && (
            <>
              {(() => {
                const status = currentTab.responseStatus;
                const code = typeof status === "number" ? status : status.code;
                const text = typeof status === "number" ? "" : status.text;
                return (
                  <span
                    className={`badge ${
                      code === 0 || code >= 400
                        ? "badge-error"
                        : code >= 200 && code < 300
                          ? "badge-success"
                          : "badge-warning"
                    }`}
                    title={text}
                  >
                    {code}
                  </span>
                );
              })()}
              {currentTab?.responseTime && (
                <span className="badge badge-ghost">
                  {currentTab.responseTime}ms
                </span>
              )}
              {currentTab?.responseSize !== undefined && (
                <span className="badge badge-ghost">
                  {formatSize(currentTab.responseSize)}
                </span>
              )}
            </>
          )}

          {(currentTab?.requestType === "websocket" ||
            currentTab?.requestType === "socketio") &&
            currentTab?.wsConnected !== undefined && (
              <span className="badge badge-ghost">
                {currentTab.wsConnected ? "Connected" : "Disconnected"}
              </span>
            )}

          <ResponseLayoutIcon
            responsePosition={responsePosition}
            onClick={() => {
              setResponsePosition((p) => (p === "bottom" ? "right" : "bottom"));
              setPanelSize(390);
            }}
          />
        </div>
      </div>

      {currentTab?.requestType === "http" && currentTab?.response && (
        <div className="flex gap-2 px-4 pt-3 pb-2 bg-base-100 border-b border-base-300 overflow-x-auto">
          {["pretty", "raw", "preview", "cookies", "headers"].map((tab) => (
            <button
              key={tab}
              className={`btn btn-sm ${currentTab?.responseTab === tab ? "btn-primary" : "btn-ghost"}`}
              onClick={() => updateCurrentTab({ responseTab: tab as any })}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "cookies" &&
                currentTab?.responseCookies &&
                currentTab.responseCookies.length > 0 && (
                  <span
                    className={`badge badge-xs ml-1 ${currentTab?.responseTab === "cookies" ? "badge-primary-content" : ""}`}
                  >
                    {currentTab.responseCookies.length}
                  </span>
                )}
              {tab === "headers" && currentTab?.responseHeaders && (
                <span
                  className={`badge badge-xs ml-1 ${currentTab?.responseTab === "headers" ? "badge-primary-content" : ""}`}
                >
                  {Object.keys(currentTab.responseHeaders).length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-auto p-4">
        {currentTab?.requestType === "http" &&
          (currentTab?.response ? (
            <>
              {currentTab.responseTab === "pretty" && (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-base-200/50 p-1 rounded-lg flex items-center gap-1">
                      {["markup", "json", "xml"].map((fmt) => (
                        <button
                          key={fmt}
                          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all duration-200 ${currentTab.responsePrettyFormat === fmt ? "bg-primary text-primary-content shadow-sm" : "text-base-content/60 hover:text-base-content hover:bg-base-300/50"}`}
                          onClick={() =>
                            updateCurrentTab({
                              responsePrettyFormat: fmt as any,
                            })
                          }
                        >
                          {fmt === "markup" ? "HTML" : fmt.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  <CodeMirrorEditor
                    key={`response-${currentTab.id}-${currentTab.responsePrettyFormat}`}
                    value={prettify(
                      currentTab.response,
                      currentTab.responsePrettyFormat,
                    )}
                    language={
                      currentTab.responsePrettyFormat === "markup"
                        ? "html"
                        : currentTab.responsePrettyFormat
                    }
                    readOnly={true}
                  />
                </>
              )}

              {currentTab.responseTab === "raw" && (
                <pre className="text-sm font-mono bg-base-200 p-3 rounded whitespace-pre-wrap break-all">
                  {typeof currentTab.response === "string"
                    ? currentTab.response
                    : JSON.stringify(currentTab.response, null, 2)}
                </pre>
              )}

              {currentTab.responseTab === "preview" && (
                <div className="w-full h-full">
                  <iframe
                    className="w-full h-full border-0 bg-white rounded"
                    srcDoc={
                      typeof currentTab.response === "string"
                        ? currentTab.response
                        : JSON.stringify(currentTab.response)
                    }
                    sandbox="allow-same-origin allow-scripts"
                  />
                </div>
              )}

              {currentTab.responseTab === "cookies" && (
                <div className="space-y-3">
                  {currentTab.responseCookies?.map((cookie, idx) => (
                    <div
                      key={idx}
                      className="bg-base-200 p-4 rounded-lg border border-base-300"
                    >
                      <div className="font-semibold text-primary">
                        {cookie.name}
                      </div>
                      <div className="text-sm font-mono break-all">
                        {cookie.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentTab.responseTab === "headers" && (
                <div className="space-y-1">
                  {Object.entries(currentTab.responseHeaders || {}).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex gap-4 py-1 px-2 bg-base-200 rounded text-sm"
                      >
                        <span className="font-semibold min-w-[150px]">
                          {key}:
                        </span>
                        <span className="opacity-70 break-all">
                          {value as string}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 opacity-20">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm">
                No response yet. Send a request to see results here.
              </p>
            </div>
          ))}

        {(currentTab?.requestType === "websocket" ||
          currentTab?.requestType === "socketio") && (
          <div className="flex flex-col h-full">
            {/* Messages Header with Controls */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-base-300">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-base-content/50">
                  Messages
                </h3>
                {currentTab.wsMessages && currentTab.wsMessages.length > 0 && (
                  <span className="badge badge-ghost badge-sm font-bold">
                    {currentTab.wsMessages.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Message Filter */}
                {currentTab.wsMessages && currentTab.wsMessages.length > 0 && (
                  <select
                    className="select select-bordered select-xs font-bold"
                    value={currentTab?.wsMessageFilter || "all"}
                    onChange={(e) =>
                      updateCurrentTab({
                        wsMessageFilter: (e.target as HTMLSelectElement).value,
                      })
                    }
                  >
                    <option value="all">All</option>
                    <option value="sent">Sent</option>
                    <option value="received">Received</option>
                    <option value="errors">Errors</option>
                  </select>
                )}
                {/* Clear Messages Button */}
                {currentTab.wsMessages && currentTab.wsMessages.length > 0 && (
                  <button
                    className="btn btn-xs btn-ghost gap-1 font-bold"
                    onClick={() => updateCurrentTab({ wsMessages: [] })}
                    title="Clear all messages"
                  >
                    <svg
                      className="w-3 h-3"
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
                    Clear
                  </button>
                )}
                {/* Export Messages Button */}
                {currentTab.wsMessages &&
                  currentTab.wsMessages.length > 0 &&
                  handleExportWebSocketMessages && (
                    <button
                      className="btn btn-xs btn-ghost gap-1 font-bold"
                      onClick={handleExportWebSocketMessages}
                      title="Export messages"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Export
                    </button>
                  )}
              </div>
            </div>

            {/* Messages List */}
            {currentTab?.wsMessages &&
            currentTab.wsMessages.filter((msg) => {
              const filter = currentTab?.wsMessageFilter || "all";
              if (filter === "all") return true;
              if (filter === "sent") return msg.direction === "sent";
              if (filter === "received") return msg.direction === "received";
              if (filter === "errors") return msg.type === "error";
              return true;
            }).length > 0 ? (
              <div className="space-y-3">
                {currentTab.wsMessages
                  .filter((msg) => {
                    const filter = currentTab?.wsMessageFilter || "all";
                    if (filter === "all") return true;
                    if (filter === "sent") return msg.direction === "sent";
                    if (filter === "received")
                      return msg.direction === "received";
                    if (filter === "errors") return msg.type === "error";
                    return true;
                  })
                  .reverse()
                  .map((msg, idx) => (
                    <div
                      key={idx}
                      className={`group relative flex flex-col p-3 rounded-xl border transition-all duration-200 bg-base-100/40 hover:bg-base-100 ${
                        msg.type === "error"
                          ? "border-error/20 hover:border-error/40 shadow-sm shadow-error/5"
                          : msg.type === "connection"
                            ? "border-info/20 hover:border-info/40 shadow-sm shadow-info/5"
                            : msg.direction === "sent"
                              ? "border-primary/20 hover:border-primary/40 shadow-sm shadow-primary/5 ml-4"
                              : "border-base-300 hover:border-base-content/20 shadow-sm mr-4"
                      }`}
                    >
                      {/* Directional Indicator Bar */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${
                          msg.type === "error"
                            ? "bg-error"
                            : msg.type === "connection"
                              ? "bg-info"
                              : msg.direction === "sent"
                                ? "bg-primary"
                                : "bg-base-content/20"
                        }`}
                      />

                      <div className="flex items-center justify-between gap-2 mb-2 ml-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              msg.type === "error"
                                ? "bg-error text-error-content"
                                : msg.type === "connection"
                                  ? "bg-info text-info-content"
                                  : msg.direction === "sent"
                                    ? "bg-primary text-primary-content"
                                    : "bg-base-200 text-base-content/70"
                            }`}
                          >
                            {msg.type === "error"
                              ? "Error"
                              : msg.type === "connection"
                                ? "Connection"
                                : msg.direction === "sent"
                                  ? currentTab.requestType === "socketio"
                                    ? "↑ Emitted"
                                    : "↑ Sent"
                                  : currentTab.requestType === "socketio"
                                    ? "↓ Received"
                                    : "↓ Received"}
                          </span>
                          {msg.event && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-base-200 rounded-md text-base-content/80">
                              {msg.event}
                            </span>
                          )}
                          {msg.format && (
                            <span className="text-[10px] uppercase font-bold text-base-content/40">
                              {msg.format}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono opacity-40 uppercase">
                            {msg.timestamp}
                          </span>
                          <button
                            className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                typeof msg.data === "string"
                                  ? msg.data
                                  : JSON.stringify(msg.data, null, 2),
                              );
                              // showToast("Copied to clipboard", "success");
                            }}
                            title="Copy message content"
                          >
                            <svg
                              className="w-3 h-3"
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
                      </div>
                      <div className="ml-2 pr-2">
                        {msg.type === "connection" ? (
                          <p className="text-sm font-medium opacity-80">
                            {msg.data}
                          </p>
                        ) : (
                          <pre className="text-xs font-mono whitespace-pre-wrap break-all bg-base-200/30 p-2 rounded-lg border border-base-200/50">
                            {typeof msg.data === "string"
                              ? msg.data
                              : JSON.stringify(msg.data, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center opacity-30">
                  <svg
                    className="w-16 h-16 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-sm font-medium">
                    {currentTab?.wsMessageFilter &&
                    currentTab.wsMessageFilter !== "all"
                      ? `No ${currentTab.wsMessageFilter} messages`
                      : currentTab?.wsConnected
                        ? "No messages yet. Send a message to get started."
                        : "Connect to start receiving messages."}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
