export type RequestType = "http" | "websocket" | "socketio" | null;
export type BodyType = "none" | "json" | "xml" | "text" | "graphql" | "form-data" | "urlencoded" | "binary";

export interface Tab {
    id: string | number;
    name: string;
    method: string | null;
    url: string;
    activeTab: string;
    saved: boolean;
    requestType: RequestType;
    params: Record<string, string>;
    headers: Record<string, string>;
    bodyType: BodyType;
    bodyJson?: string;
    bodyXml?: string;
    bodyText?: string;
    bodyGraphQLQuery?: string;
    bodyGraphQLVariables?: string;
    formData?: any[];
    urlEncodedData?: Record<string, string>;
    binaryFile?: File | null;

    // Auth
    authType?: string;
    authData?: Record<string, any>;

    // HTTP response data
    response?: any;
    responseStatus?: number | {
        code: number;
        text: string;
    } | null;
    responseTime?: number | null;
    responseSize?: number | null;
    responseTab?: string;
    responsePrettyFormat?: string;
    responseHeaders?: Record<string, string> | null;
    responseCookies?: any[] | null;
    error?: string | null;

    // WebSocket / Socket.IO specific
    wsConnected?: boolean;
    wsMessages?: any[];
    wsMessage?: string;
    wsMessageFormat?: string;
    wsConnectionTime?: number | null;
    wsMessageCount?: number;
    wsAutoReconnect?: boolean;
    wsReconnectDelay?: number;
    wsMessageFilter?: string;

    // Socket.IO specific
    socketioArgs?: any[];
    socketioSelectedArgIndex?: number;
    socketioEvents?: any[];
    socketioEventName?: string;
    savedRequestId?: string;
    historyId?: string | number;
}

export interface Workspace {
    id: string | number;
    name: string;
    role?: string;
}

export interface Collection {
    id: string;
    name: string;
    requests?: any[];
    workspace_id?: number;
}

export interface HistoryItem {
    id: string | number;
    url: string;
    method: string;
    request_type: string;
    body_type?: string;
    status?: number;
    status_text?: string;
    response_time?: number;
    response_size?: number;
    created_at: string;
    [key: string]: any;
}
