import { Tab, RequestType } from "../types";
import { DEFAULT_HEADERS } from "../constants";

export const parseJson = (val: any, fallback: any) => {
    if (typeof val === 'string') {
        try {
            return JSON.parse(val);
        } catch (e) {
            return fallback;
        }
    }
    return val || fallback;
};

export const mapRequestToTab = (request: any, type: "request" | "history" = "request"): Tab => {
    const requestType = (() => {
        const rType = request.requestType || request.request_type;
        if (rType === "socketio" || request.method === "SOCKETIO") return "socketio";
        if (rType === "websocket" || request.method === "WEBSOCKET") return "websocket";
        if (request.url?.startsWith("ws://") || request.url?.startsWith("wss://")) return "websocket";
        return rType || "http";
    })() as RequestType;

    const parsedHeaders = parseJson(request.headers, requestType === "http" ? { ...DEFAULT_HEADERS } : {});
    const parsedParams = parseJson(request.params, {});
    const parsedAuthData = parseJson(request.authData || request.auth_data, {});

    let bodyType = (request.bodyType || request.body_type || "none") as any;
    if (bodyType === "url-encoded") bodyType = "urlencoded";

    let formData = [];
    let urlEncodedData = {};
    let bodyJson = request.bodyJson || request.body_json || "";
    let bodyXml = request.bodyXml || request.body_xml || "";
    let bodyText = request.bodyText || request.body_text || "";
    let bodyGraphQLQuery = request.bodyGraphQLQuery || request.body_graphql_query || "";
    let bodyGraphQLVariables = request.bodyGraphQLVariables || request.body_graphql_variables || "";

    const bodyMeta = parseJson(request.bodyMeta || request.body_meta, null);
    if (bodyMeta) {
        if (bodyMeta.formData) formData = bodyMeta.formData;
        if (bodyMeta.urlEncodedData) urlEncodedData = bodyMeta.urlEncodedData;
        if (bodyMeta.bodyJson) bodyJson = bodyMeta.bodyJson;
        if (bodyMeta.bodyXml) bodyXml = bodyMeta.bodyXml;
        if (bodyMeta.bodyText) bodyText = bodyMeta.bodyText;
        if (bodyMeta.bodyGraphQLQuery) bodyGraphQLQuery = bodyMeta.bodyGraphQLQuery;
        if (bodyMeta.bodyGraphQLVariables) bodyGraphQLVariables = bodyMeta.bodyGraphQLVariables;
    } else {
        // Fallback for requests saved without bodyMeta
        formData = parseJson(request.formData || request.form_data, []);
        urlEncodedData = parseJson(request.urlEncodedData || request.url_encoded, {});
    }

    // Response data for history items
    let response = null;
    if (request.response_body) {
        try {
            response = JSON.parse(request.response_body);
        } catch (e) {
            response = request.response_body;
        }
    }

    let wsMessages = [];
    if (bodyMeta && bodyMeta.wsMessages) {
        wsMessages = bodyMeta.wsMessages;
    }

    // Parse Socket.IO specific fields
    let socketioArgs = [{ id: 1, value: "", format: "json" as any }];
    let socketioEvents: any[] = [];
    let socketioEventName = "";
    let socketioSelectedArgIndex = 0;

    if (requestType === "socketio") {
        // Try to parse from body first (where it's saved)
        if (request.body) {
            try {
                const socketioData = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
                if (socketioData.socketioArgs) socketioArgs = socketioData.socketioArgs;
                if (socketioData.socketioEventName) socketioEventName = socketioData.socketioEventName;
                if (socketioData.socketioEvents) socketioEvents = socketioData.socketioEvents;
                if (socketioData.socketioSelectedArgIndex !== undefined) socketioSelectedArgIndex = socketioData.socketioSelectedArgIndex;
            } catch (e) {
                console.warn("Failed to parse Socket.IO data from body:", e);
            }
        }

        // Also check bodyMeta as fallback
        if (bodyMeta) {
            if (bodyMeta.socketioArgs) socketioArgs = bodyMeta.socketioArgs;
            if (bodyMeta.socketioEventName) socketioEventName = bodyMeta.socketioEventName;
            if (bodyMeta.socketioEvents) socketioEvents = bodyMeta.socketioEvents;
            if (bodyMeta.socketioSelectedArgIndex !== undefined) socketioSelectedArgIndex = bodyMeta.socketioSelectedArgIndex;
        }
    }

    return {
        id: Date.now() + Math.random(),
        name: request.name || (() => {
            try {
                const url = new URL(request.url);
                return `${request.method} ${url.pathname}`;
            } catch {
                return `${request.method} ${request.url}`;
            }
        })(),
        method: request.method,
        url: request.url || "",
        headers: parsedHeaders,
        params: parsedParams,
        authType: (request.authType || request.auth_type || "none") as any,
        authData: parsedAuthData,
        bodyType,
        bodyJson,
        bodyXml,
        bodyText,
        bodyGraphQLQuery,
        bodyGraphQLVariables,
        formData,
        urlEncodedData,
        binaryFile: null,
        saved: type === "request",
        savedRequestId: type === "request" ? request.id : undefined,
        historyId: type === "history" ? request.id : undefined,
        requestType,
        activeTab: request.activeTab || (requestType === "websocket" || requestType === "socketio" ? "message" : "params"),
        response,
        responseStatus: request.status || null,
        responseTime: request.response_time || null,
        responseSize: request.response_size || null,
        responseHeaders: parseJson(request.response_headers || request.responseHeaders, null),
        responseTab: "pretty",
        responsePrettyFormat: "json",
        wsConnected: false,
        wsMessages,
        wsMessage: requestType === "websocket" ? (request.body || "") : "",
        wsMessageFormat: "text",
        // Socket.IO specific fields
        socketioArgs: requestType === "socketio" ? socketioArgs : undefined,
        socketioEvents: requestType === "socketio" ? socketioEvents : undefined,
        socketioEventName: requestType === "socketio" ? socketioEventName : undefined,
        socketioSelectedArgIndex: requestType === "socketio" ? socketioSelectedArgIndex : undefined,
    };
};

export const mapTabToRequest = (tab: Tab) => {
    return {
        name: tab.name,
        method: tab.requestType === "websocket"
            ? "WEBSOCKET"
            : tab.requestType === "socketio"
                ? "SOCKETIO"
                : tab.method || "GET",
        url: tab.url,
        request_type: tab.requestType || "http",
        headers: JSON.stringify(tab.headers || {}),
        params: JSON.stringify(tab.params || {}),
        auth_type: tab.authType || "none",
        auth_data: JSON.stringify(tab.authData || {}),
        body_type: tab.requestType === "websocket"
            ? tab.wsMessageFormat || "text"
            : tab.requestType === "socketio"
                ? "json"
                : tab.bodyType || "none",
        body_json: tab.bodyJson || "",
        body_xml: tab.bodyXml || "",
        body_text: tab.bodyText || "",
        body_graphql_query: tab.bodyGraphQLQuery || "",
        body_graphql_variables: tab.bodyGraphQLVariables || "",
        form_data: JSON.stringify(tab.formData || []),
        url_encoded: JSON.stringify(tab.urlEncodedData || {}),
        body: tab.requestType === "websocket"
            ? tab.wsMessage || ""
            : tab.requestType === "socketio"
                ? JSON.stringify({
                    socketioArgs: tab.socketioArgs,
                    socketioEventName: tab.socketioEventName,
                    socketioEvents: tab.socketioEvents,
                    socketioSelectedArgIndex: tab.socketioSelectedArgIndex,
                })
                : tab.bodyJson || tab.bodyXml || tab.bodyText || "",
    };
};
