import { Tab, RequestType, BodyType } from "../types";
import { DEFAULT_HEADERS } from "./url";

export const parseHistoryItemToTab = (historyItem: any): Tab => {
    let params = {};
    let headers = { ...DEFAULT_HEADERS };
    let responseHeaders = null;
    let responseBody = null;

    try {
        params = historyItem.params ? JSON.parse(historyItem.params) : {};
    } catch (e) {
        console.error("Failed to parse params:", e);
    }

    try {
        headers = historyItem.headers
            ? JSON.parse(historyItem.headers)
            : { ...DEFAULT_HEADERS };
    } catch (e) {
        console.error("Failed to parse headers:", e);
    }

    try {
        responseHeaders = historyItem.response_headers
            ? JSON.parse(historyItem.response_headers)
            : null;
    } catch (e) {
        console.error("Failed to parse response headers:", e);
    }

    try {
        if (historyItem.response_body && historyItem.response_body.trim()) {
            responseBody = JSON.parse(historyItem.response_body);
        }
    } catch (e) {
        responseBody = historyItem.response_body || null;
    }

    let bodyType: BodyType = (historyItem.body_type as BodyType) || "none";
    let bodyJson = "";
    let bodyXml = "";
    let bodyText = "";
    let bodyGraphQLQuery = "";
    let bodyGraphQLVariables = "";
    let formData: any[] = [];
    let urlEncodedData: Record<string, string> = {};

    if (historyItem.body_meta) {
        try {
            const meta = JSON.parse(historyItem.body_meta);
            if (bodyType === "form-data" && meta.formData) formData = meta.formData;
            else if (bodyType === "urlencoded" && meta.urlEncodedData) urlEncodedData = meta.urlEncodedData;
            else if (bodyType === "json" && typeof meta.bodyJson === "string") bodyJson = meta.bodyJson;
            else if (bodyType === "xml" && typeof meta.bodyXml === "string") bodyXml = meta.bodyXml;
            else if (bodyType === "text" && typeof meta.bodyText === "string") bodyText = meta.bodyText;
            else if (bodyType === "graphql") {
                if (typeof meta.bodyGraphQLQuery === "string") bodyGraphQLQuery = meta.bodyGraphQLQuery;
                if (typeof meta.bodyGraphQLVariables === "string") bodyGraphQLVariables = meta.bodyGraphQLVariables;
            }
        } catch (e) {
            console.warn("Failed to parse body_meta from history:", e);
        }
    }

    const requestType: RequestType = (() => {
        if (historyItem.request_type === "socketio" || historyItem.method === "SOCKETIO") return "socketio";
        if (historyItem.request_type === "websocket" || historyItem.method === "WEBSOCKET") return "websocket";
        if (historyItem.url?.startsWith("ws://") || historyItem.url?.startsWith("wss://")) return "websocket";
        return (historyItem.request_type as RequestType) || "http";
    })();

    let wsMessages = [];
    if ((requestType === "websocket" || requestType === "socketio") && historyItem.body_meta) {
        try {
            const meta = JSON.parse(historyItem.body_meta);
            wsMessages = meta.wsMessages || [];
        } catch (e) { }
    }

    return {
        id: Date.now(),
        name: `${historyItem.method || "GET"} ${historyItem.url || ""}`,
        method: historyItem.method,
        url: historyItem.url,
        activeTab: requestType === "websocket" || requestType === "socketio" ? "message" : "params",
        saved: false,
        requestType,
        params,
        headers,
        bodyType,
        bodyJson,
        bodyXml,
        bodyText,
        bodyGraphQLQuery,
        bodyGraphQLVariables,
        formData,
        urlEncodedData,
        response: responseBody,
        responseStatus: historyItem.status,
        responseTime: historyItem.response_time,
        responseHeaders,
        wsConnected: false,
        wsMessages,
        wsMessage: (requestType === "websocket" ? historyItem.body : "") || "",
        wsMessageFormat: (requestType === "websocket" ? historyItem.body_type : "text") || "text",
        wsMessageCount: wsMessages.length,
        // ... add more if needed
    };
};
