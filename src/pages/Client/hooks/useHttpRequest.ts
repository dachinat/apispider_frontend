import { useCallback } from "preact/hooks";
import { Tab } from "../types";
import { useEnvironment } from "../../../context/EnvironmentContext";
import { historyService } from "../../../services/history";
import { requestsAPI } from "../../../services/api";
import { agentService } from "../../../services/agent";
import CryptoJS from "crypto-js";
import { prepareAWSRequest } from "../utils/aws";

export const useHttpRequest = (
    activeWorkspaceId: string | number | null,
    updateTab: (id: string | number, updates: Partial<Tab>) => void,
    ensureResponsePanelVisibility: () => void
) => {
    const { replaceVariables, getBaseUrl } = useEnvironment();

    const prepareHttpRequest = useCallback((tab: Tab) => {
        let finalUrl = replaceVariables(tab.url || "");
        const baseUrl = getBaseUrl();

        if (baseUrl && finalUrl && !finalUrl.match(/^https?:\/\//)) {
            if (finalUrl.startsWith("/") || !finalUrl.includes("://")) {
                finalUrl = baseUrl.replace(/\/$/, "") + "/" + finalUrl.replace(/^\//, "");
            }
        }

        if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
            finalUrl = `https://${finalUrl}`;
        }

        try {
            const parsedUrl = new URL(finalUrl);
            if (parsedUrl.search) {
                const substitutedParams = new URLSearchParams();
                parsedUrl.searchParams.forEach((value, key) => {
                    substitutedParams.set(replaceVariables(key), replaceVariables(value));
                });
                parsedUrl.search = substitutedParams.toString();
                finalUrl = parsedUrl.toString();
            }
        } catch (error) {
            // Manual fallback or ignore
        }

        const headers: Record<string, string> = {};
        Object.entries(tab.headers || {}).forEach(([key, value]) => {
            headers[replaceVariables(key)] = replaceVariables(value);
        });

        // Auth
        if (tab.authType === "bearer" && tab.authData?.token) {
            headers["Authorization"] = `Bearer ${replaceVariables(tab.authData.token)}`;
        } else if (tab.authType === "basic" && tab.authData?.username && tab.authData?.password) {
            const credentials = btoa(`${replaceVariables(tab.authData.username)}:${replaceVariables(tab.authData.password)}`);
            headers["Authorization"] = `Basic ${credentials}`;
        } else if (tab.authType === "api-key") {
            const key = replaceVariables(tab.authData?.key || "");
            const value = replaceVariables(tab.authData?.value || "");
            const addTo = tab.authData?.addTo || "header";
            if (key && value) {
                if (addTo === "query") {
                    const urlObj = new URL(finalUrl);
                    urlObj.searchParams.set(key, value);
                    finalUrl = urlObj.toString();
                } else {
                    headers[key] = value;
                }
            }
        } else if (tab.authType === "oauth2" && tab.authData?.accessToken) {
            const tokenType = replaceVariables(tab.authData?.tokenType || "Bearer");
            headers["Authorization"] = `${tokenType} ${replaceVariables(tab.authData.accessToken)}`;
        }

        return {
            finalUrl,
            headers,
        };
    }, [replaceVariables, getBaseUrl]);

    const handleSendRequest = useCallback(async (currentTab: Tab) => {
        if (!currentTab.url) return;

        ensureResponsePanelVisibility();
        updateTab(currentTab.id, { error: null, response: null });

        const { finalUrl, headers } = prepareHttpRequest(currentTab);
        const method = currentTab.method || "GET";
        const startTime = Date.now();

        try {
            let preparedBody: any = undefined;
            if (currentTab.bodyType === 'json') {
                preparedBody = replaceVariables(currentTab.bodyJson || "");
                if (!headers["Content-Type"]) {
                    headers["Content-Type"] = "application/json";
                }
            } else if (currentTab.bodyType === 'text') {
                preparedBody = replaceVariables(currentTab.bodyText || "");
                if (!headers["Content-Type"]) {
                    headers["Content-Type"] = "text/plain";
                }
            } else if (currentTab.bodyType === 'xml') {
                preparedBody = replaceVariables(currentTab.bodyXml || "");
                if (!headers["Content-Type"]) {
                    headers["Content-Type"] = "application/xml";
                }
            } else if (currentTab.bodyType === 'urlencoded') {
                const params = new URLSearchParams();
                Object.entries(currentTab.urlEncodedData || {}).forEach(([k, v]) => {
                    params.append(replaceVariables(k), replaceVariables(v));
                });
                preparedBody = params.toString();
                if (!headers["Content-Type"]) {
                    headers["Content-Type"] = "application/x-www-form-urlencoded";
                }
            } else if (currentTab.bodyType === 'binary' && currentTab.binaryFile) {
                const reader = new FileReader();
                const base64Promise = new Promise<string>((resolve, reject) => {
                    reader.onload = () => {
                        const base64String = (reader.result as string).split(',')[1];
                        resolve(base64String);
                    };
                    reader.onerror = reject;
                });
                reader.readAsDataURL(currentTab.binaryFile);
                preparedBody = await base64Promise;
                if (!headers["Content-Type"]) {
                    headers["Content-Type"] = "application/octet-stream";
                }
            } else if (currentTab.bodyType === 'graphql') {
                preparedBody = JSON.stringify({
                    query: replaceVariables(currentTab.bodyGraphQLQuery || ""),
                    variables: JSON.parse(replaceVariables(currentTab.bodyGraphQLVariables || "{}"))
                });
                if (!headers["Content-Type"]) {
                    headers["Content-Type"] = "application/json";
                }
            }

            // AWS Signature calculation must happen AFTER body is prepared
            let finalHeaders = { ...headers };
            if (currentTab.authType === "aws") {
                finalHeaders = prepareAWSRequest(
                    currentTab,
                    finalUrl,
                    headers,
                    preparedBody,
                    replaceVariables
                );
            }

            const formData = await Promise.all((currentTab.formData || []).map(async (item) => {
                const key = replaceVariables(item.key);
                const type = item.type || 'text';
                let value = replaceVariables(item.value);

                if (type === 'file' && item.file instanceof File) {
                    const reader = new FileReader();
                    const base64Promise = new Promise<string>((resolve, reject) => {
                        reader.onload = () => {
                            const base64String = (reader.result as string).split(',')[1];
                            resolve(base64String);
                        };
                        reader.onerror = reject;
                    });
                    reader.readAsDataURL(item.file);
                    value = await base64Promise;

                    return {
                        ...item,
                        key,
                        value,
                        fileName: item.file.name
                    };
                }

                return {
                    ...item,
                    key,
                    value
                };
            }));

            const requestPayload = {
                method,
                url: finalUrl,
                headers: finalHeaders,
                body: preparedBody,
                formData,
                authType: currentTab.authType,
                authData: currentTab.authData ? Object.entries(currentTab.authData).reduce((acc, [k, v]) => ({
                    ...acc,
                    [k]: typeof v === 'string' ? replaceVariables(v) : v
                }), {}) : currentTab.authData,
                workspace_id: activeWorkspaceId ? (typeof activeWorkspaceId === 'string' ? parseInt(activeWorkspaceId, 10) : activeWorkspaceId) : undefined
            };

            let response;
            if (agentService.requiresAgent(finalUrl) && agentService.isAvailable) {
                response = await agentService.execute(requestPayload);
            } else {
                // We'll use requestsAPI.execute which calls our proxy/backend
                response = await requestsAPI.execute(requestPayload);
            }

            const endTime = Date.now();
            const responseTime = endTime - startTime;

            updateTab(currentTab.id, {
                response: response.body,
                responseStatus: { code: response.status, text: response.status_text },
                responseTime,
                responseSize: JSON.stringify(response.body).length, // Approximation
                responseHeaders: response.headers,
                responseTab: "pretty",
                responsePrettyFormat: "json",
            });

            // Save to history
            await historyService.save({
                request_type: "http",
                method,
                url: finalUrl,
                headers: JSON.stringify(headers),
                params: JSON.stringify(currentTab.params || {}),
                auth_type: currentTab.authType || "none",
                auth_data: JSON.stringify(currentTab.authData || {}),
                body_type: currentTab.bodyType || "none",
                body_meta: JSON.stringify({
                    formData: currentTab.formData,
                    urlEncodedData: currentTab.urlEncodedData,
                    bodyJson: currentTab.bodyJson,
                    bodyXml: currentTab.bodyXml,
                    bodyText: currentTab.bodyText,
                    bodyGraphQLQuery: currentTab.bodyGraphQLQuery,
                    bodyGraphQLVariables: currentTab.bodyGraphQLVariables,
                }),
                body: typeof preparedBody === 'string' ? preparedBody : JSON.stringify(preparedBody),
                status: response.status,
                status_text: response.status_text,
                response_headers: JSON.stringify(response.headers || {}),
                response_body: typeof response.body === 'string' ? response.body : JSON.stringify(response.body),
                response_time: responseTime,
                response_size: JSON.stringify(response.body || "").length,
                workspace_id: activeWorkspaceId ? (typeof activeWorkspaceId === 'string' ? parseInt(activeWorkspaceId, 10) : activeWorkspaceId) : undefined,
            });

        } catch (error: any) {
            updateTab(currentTab.id, { error: error.message });
        }
    }, [activeWorkspaceId, prepareHttpRequest, replaceVariables, updateTab, ensureResponsePanelVisibility]);

    return { handleSendRequest, prepareHttpRequest };
};
