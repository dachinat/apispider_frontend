import { useState, useEffect } from "preact/hooks";
import { useWorkspace } from "../../../context/WorkspaceContext";
import { collectionsAPI, requestsAPI } from "../../../services/api";
import SpiderSpinner from "../../../components/SpiderSpinner";

export default function ImportExport() {
  const { workspaces, activeWorkspaceId } = useWorkspace();
  const [selectedImportWorkspaceId, setSelectedImportWorkspaceId] =
    useState<any>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importPreview, setImportPreview] = useState<any>(null);

  const [exportCollections, setExportCollections] = useState<any[]>([]);
  const [selectedExportIds, setSelectedExportIds] = useState<string[]>([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Set default workspace for import when workspaces load
  useEffect(() => {
    if (workspaces.length > 0 && !selectedImportWorkspaceId) {
      setSelectedImportWorkspaceId(activeWorkspaceId || workspaces[0].id);
    }
  }, [workspaces, activeWorkspaceId]);

  // Fetch collections when component mounts
  useEffect(() => {
    const fetchCollections = async () => {
      if (!selectedImportWorkspaceId) return;
      setCollectionsLoading(true);
      try {
        const data = await collectionsAPI.getAll(selectedImportWorkspaceId);
        setExportCollections(data || []);
      } catch (err) {
        console.error("Failed to fetch collections for export:", err);
      }
      setCollectionsLoading(false);
    };

    fetchCollections();
  }, [selectedImportWorkspaceId]);

  // Postman import helpers
  const parsePostmanUrl = (urlObj: any) => {
    if (!urlObj) return { url: "", params: {} };

    if (typeof urlObj === "string") {
      return { url: urlObj, params: {} };
    }

    const url = urlObj.raw || "";
    const params: any = {};

    if (urlObj.query && Array.isArray(urlObj.query)) {
      urlObj.query.forEach((q: any) => {
        if (q.key && !q.disabled) {
          params[q.key] = { value: q.value || "", enabled: true };
        }
      });
    }

    return { url, params };
  };

  const parsePostmanHeaders = (headers: any) => {
    const result: any = {};
    if (headers && Array.isArray(headers)) {
      headers.forEach((h: any) => {
        if (h.key && !h.disabled) {
          result[h.key] = { value: h.value || "", enabled: true };
        }
      });
    }
    return result;
  };

  const parsePostmanBody = (body: any) => {
    if (!body) {
      return {
        bodyType: "none",
        bodyJson: "",
        bodyText: "",
        formData: [],
        urlEncodedData: {},
      };
    }

    const mode = body.mode;
    let bodyType = "none";
    let bodyJson = "";
    let bodyText = "";
    let formData: any[] = [];
    let urlEncodedData: any = {};

    switch (mode) {
      case "raw":
        if (body.options?.raw?.language === "json") {
          bodyType = "json";
          bodyJson = body.raw || "";
        } else {
          bodyType = "text";
          bodyText = body.raw || "";
        }
        break;
      case "formdata":
        bodyType = "form-data";
        if (body.formdata && Array.isArray(body.formdata)) {
          formData = body.formdata.map((f: any, index: number) => ({
            id: index + 1,
            key: f.key || "",
            value: f.value || "",
            type: f.type === "file" ? "file" : "text",
            enabled: !f.disabled,
          }));
        }
        break;
      case "urlencoded":
        bodyType = "x-www-form-urlencoded";
        if (body.urlencoded && Array.isArray(body.urlencoded)) {
          body.urlencoded.forEach((u: any) => {
            if (u.key) {
              urlEncodedData[u.key] = {
                value: u.value || "",
                enabled: !u.disabled,
              };
            }
          });
        }
        break;
      default:
        bodyType = "none";
    }

    return { bodyType, bodyJson, bodyText, formData, urlEncodedData };
  };

  const handleImportFileSelect = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".json")) {
        setError("Please select a JSON file");
        return;
      }
      setImportFile(file);

      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const data = JSON.parse(event.target.result);
          if (!data.info || !data.item) {
            setError("Invalid Postman collection format");
            setImportFile(null);
            return;
          }
          const allRequests: any[] = [];
          const extractRequests = (items: any[]) => {
            items.forEach((item) => {
              if (item.request) {
                allRequests.push({
                  name: item.name,
                  method: item.request.method || "GET",
                });
              } else if (item.item && Array.isArray(item.item)) {
                extractRequests(item.item);
              }
            });
          };
          extractRequests(data.item || []);

          setImportPreview({
            name: data.info.name,
            requestCount: allRequests.length,
            requests: allRequests,
          });
          setError("");
          setSuccess("");
        } catch (err) {
          setError("Failed to parse JSON file");
          setImportFile(null);
          setImportPreview(null);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleCancelImport = () => {
    setImportFile(null);
    setImportPreview(null);
    setError("");
    setSuccess("");
  };

  const handleImportPostman = async () => {
    if (!importFile || !selectedImportWorkspaceId) {
      setError("Please select a file and workspace");
      return;
    }

    setError("");
    setSuccess("");
    setImportLoading(true);

    try {
      const fileContent = await importFile.text();
      const data = JSON.parse(fileContent);

      if (!data.info || !data.item) {
        setError("Invalid Postman collection format");
        setImportLoading(false);
        return;
      }

      const collection = await collectionsAPI.create({
        name: data.info.name || "Imported Collection",
        workspace_id:
          typeof selectedImportWorkspaceId === "string"
            ? parseInt(selectedImportWorkspaceId, 10)
            : selectedImportWorkspaceId,
      });

      let successCount = 0;
      let errorCount = 0;

      const processItems = async (items: any[]) => {
        for (const item of items) {
          if (item.request) {
            try {
              const { url, params } = parsePostmanUrl(item.request.url);
              const headers = parsePostmanHeaders(item.request.header);
              const { bodyType, bodyJson, bodyText, formData, urlEncodedData } =
                parsePostmanBody(item.request.body);

              await requestsAPI.create({
                collection_id: parseInt(collection.id, 10),
                name: item.name || "Untitled Request",
                method: item.request.method || "GET",
                url: url,
                headers: JSON.stringify(headers || {}),
                params: JSON.stringify(params || {}),
                body_type: bodyType,
                body_json: bodyJson,
                body_text: bodyText,
                form_data: JSON.stringify(formData || []),
                url_encoded: JSON.stringify(urlEncodedData || {}),
              });
              successCount++;
            } catch (err) {
              console.error("Failed to import request:", item.name, err);
              errorCount++;
            }
          } else if (item.item && Array.isArray(item.item)) {
            // It's a folder, recurse
            await processItems(item.item);
          }
        }
      };

      await processItems(data.item);

      setSuccess(
        `Successfully imported "${data.info.name}" with ${successCount} request${successCount !== 1 ? "s" : ""}${errorCount > 0 ? ` (${errorCount} failed)` : ""}`,
      );
      setImportFile(null);
      setImportPreview(null);
    } catch (err: any) {
      console.error("Import failed:", err);
      setError("Failed to import collection: " + err.message);
    }

    setImportLoading(false);
  };

  const handleExportPostman = async () => {
    if (selectedExportIds.length === 0) {
      setError("Please select at least one collection to export");
      return;
    }

    setError("");
    setSuccess("");
    setExportLoading(true);

    try {
      const collectionsToExport = exportCollections.filter((c) =>
        selectedExportIds.includes(c.id),
      );

      for (const col of collectionsToExport) {
        const requests = await requestsAPI.getAll(col.id);

        const postmanCollection = {
          info: {
            name: col.name,
            description: col.description || "",
            schema:
              "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
          },
          item: requests.map((req: any) => ({
            name: req.name,
            request: {
              method: req.method,
              header: Object.entries(req.headers || {}).map(
                ([key, h]: [string, any]) => ({
                  key,
                  value: h.value,
                  disabled: !h.enabled,
                }),
              ),
              url: {
                raw: req.url,
                query: Object.entries(req.params || {}).map(
                  ([key, p]: [string, any]) => ({
                    key,
                    value: p.value,
                    disabled: !p.enabled,
                  }),
                ),
              },
              body:
                req.body_type !== "none"
                  ? {
                    mode:
                      req.body_type === "form-data"
                        ? "formdata"
                        : req.body_type === "x-www-form-urlencoded"
                          ? "urlencoded"
                          : "raw",
                    raw:
                      req.body_type === "json"
                        ? req.body_json
                        : req.body_type === "text"
                          ? req.body_text
                          : "",
                    options:
                      req.body_type === "json"
                        ? { raw: { language: "json" } }
                        : {},
                    formdata:
                      req.body_type === "form-data"
                        ? (req.form_data || []).map((f: any) => ({
                          key: f.key,
                          value: f.value,
                          type: f.type,
                          disabled: !f.enabled,
                        }))
                        : [],
                    urlencoded:
                      req.body_type === "x-www-form-urlencoded"
                        ? Object.entries(req.url_encoded || {}).map(
                          ([key, u]: [string, any]) => ({
                            key,
                            value: u.value,
                            disabled: !u.enabled,
                          }),
                        )
                        : [],
                  }
                  : undefined,
            },
          })),
        };

        const blob = new Blob([JSON.stringify(postmanCollection, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${col.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_postman_collection.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      setSuccess(
        `Successfully exported ${selectedExportIds.length} collection${selectedExportIds.length !== 1 ? "s" : ""}`,
      );
      setSelectedExportIds([]);
    } catch (err: any) {
      console.error("Export failed:", err);
      setError("Failed to export collections: " + err.message);
    }

    setExportLoading(false);
  };

  return (
    <div className="space-y-8">
      {collectionsLoading && (
        <div className="absolute inset-0 bg-base-100/40 backdrop-blur-[2px] z-50 flex items-center justify-center">
          <SpiderSpinner className="w-16 h-16" />
        </div>
      )}

      {/* Feedback messages */}
      {error && (
        <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-success/10 border border-success/20 text-success rounded-xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          {success}
        </div>
      )}

      <div>
        <h3 className="text-lg font-bold text-base-content">Import / Export</h3>
        <p className="text-sm text-base-content/60 mt-1">
          Transfer your data to and from ApiSpider
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Import Section */}
        <div className="bg-base-200/50 rounded-xl p-6 border border-base-300">
          <h4 className="font-bold text-base mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5"
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
            Import Postman Collection
          </h4>

          {!importFile ? (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Select Workspace</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={selectedImportWorkspaceId || ""}
                  onChange={(e: any) =>
                    setSelectedImportWorkspaceId(e.target.value)
                  }
                >
                  {workspaces.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-base-300 rounded-lg cursor-pointer hover:border-primary hover:bg-base-100 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-3 text-base-content/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-base-content/60">
                    <span className="font-semibold">Click to upload JSON</span>
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".json"
                  onChange={handleImportFileSelect}
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-base-100 p-4 rounded-lg border border-base-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{importFile.name}</p>
                    {importPreview && (
                      <p className="text-xs text-base-content/60">
                        {importPreview.requestCount} requests •{" "}
                        {importPreview.name}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleCancelImport}
                    className="btn btn-ghost btn-sm btn-square text-error"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <button
                onClick={handleImportPostman}
                className="btn btn-primary w-full"
                disabled={importLoading}
              >
                {importLoading && (
                  <span className="loading loading-spinner loading-xs mr-2" />
                )}
                Import Collection
              </button>
            </div>
          )}
        </div>

        {/* Export Section */}
        <div className="bg-base-200/50 rounded-xl p-6 border border-base-300">
          <h4 className="font-bold text-base mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5"
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
            Export Collections
          </h4>

          <div className="space-y-4">
            <div className="bg-base-100 rounded-lg border border-base-300 max-h-[300px] overflow-y-auto">
              {exportCollections.length === 0 ? (
                <div className="p-8 text-center text-base-content/40">
                  <p className="text-sm">
                    No collections found in this workspace
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-base-200">
                  {Array.isArray(exportCollections) &&
                    exportCollections.map((col) => (
                      <label
                        key={col.id}
                        className="flex items-center gap-3 p-3 hover:bg-base-200/50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm checkbox-primary rounded"
                          checked={selectedExportIds.includes(col.id)}
                          onChange={(e: any) => {
                            if (e.target.checked) {
                              setSelectedExportIds([
                                ...selectedExportIds,
                                col.id,
                              ]);
                            } else {
                              setSelectedExportIds(
                                selectedExportIds.filter((id) => id !== col.id),
                              );
                            }
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{col.name}</p>
                          <p className="text-xs text-base-content/50">
                            {new Date(
                              col.created_at || Date.now(),
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </label>
                    ))}
                </div>
              )}
            </div>
            <div className="flex justify-between items-center text-xs text-base-content/60 px-1">
              <span>{selectedExportIds.length} selected</span>
              <button
                className="hover:text-primary"
                onClick={() => {
                  if (selectedExportIds.length === exportCollections.length) {
                    setSelectedExportIds([]);
                  } else if (Array.isArray(exportCollections)) {
                    setSelectedExportIds(exportCollections.map((c) => c.id));
                  }
                }}
              >
                {selectedExportIds.length === exportCollections.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
            <button
              className="btn btn-primary w-full"
              onClick={handleExportPostman}
              disabled={selectedExportIds.length === 0 || exportLoading}
            >
              {exportLoading && (
                <span className="loading loading-spinner loading-xs mr-2" />
              )}
              Export Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
