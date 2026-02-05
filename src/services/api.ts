const RAW_API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const API_URL = (() => {
    const base = String(RAW_API_BASE_URL).replace(/\/+$/, "");
    if (base.endsWith("/api/v1")) return base;
    if (base.endsWith("/api")) return `${base}/v1`;
    return `${base}/api/v1`;
})();

interface ApiCallOptions extends RequestInit {
    headers?: Record<string, string>;
}

export async function apiCall<T = any>(
    endpoint: string,
    options: ApiCallOptions = {}
): Promise<T> {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });

    if (response.status === 401) {
        // Token is expired or is invalid
        const token = localStorage.getItem("token");

        if (token) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            if (window.location.pathname !== "/sign-in") {
                window.location.href = "/sign-in";
            }
        }

        throw new Error("Authentication required");
    }

    const rawText = await response.text();
    const hasBody = rawText !== null && rawText !== undefined && rawText !== "";

    let parsed: any;
    if (hasBody) {
        try {
            parsed = JSON.parse(rawText);
        } catch {
            parsed = null;
        }
    }

    if (!response.ok) {
        const message =
            (parsed && (parsed.error || parsed.message)) ||
            (hasBody ? rawText : "Request failed");
        throw new Error(message);
    }

    if (!hasBody) return null as T;
    return (parsed ?? rawText) as T;
}

interface Collection {
    id: string;
    name: string;
    workspace_id?: number;
    [key: string]: any;
}

interface CreateCollectionData {
    name: string;
    workspace_id?: number;
    [key: string]: any;
}

export const collectionsAPI = {
    async getAll(workspaceId: string | null = null): Promise<Collection[]> {
        const query = workspaceId ? `?workspace_id=${workspaceId}` : "";
        return apiCall<Collection[]>(`/collections${query}`);
    },

    async getById(id: string): Promise<Collection> {
        return apiCall<Collection>(`/collections/${id}`);
    },

    async create(data: CreateCollectionData): Promise<Collection> {
        return apiCall<Collection>("/collections", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async update(id: string, data: Partial<CreateCollectionData>): Promise<Collection> {
        return apiCall<Collection>(`/collections/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    async delete(id: string): Promise<void> {
        return apiCall<void>(`/collections/${id}`, {
            method: "DELETE",
        });
    },
};

interface Request {
    id: string;
    name: string;
    collection_id?: number;
    method: string;
    url: string;
    [key: string]: any;
}

interface CreateRequestData {
    name: string;
    collection_id?: number;
    method: string;
    url: string;
    [key: string]: any;
}

interface ExecuteRequestData {
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: any;
    [key: string]: any;
}

export const requestsAPI = {
    async getAll(collectionId?: string): Promise<Request[]> {
        const query = collectionId ? `?collection_id=${collectionId}` : "";
        return apiCall<Request[]>(`/requests${query}`);
    },

    async getById(id: string): Promise<Request> {
        return apiCall<Request>(`/requests/${id}`);
    },

    async create(data: CreateRequestData): Promise<Request> {
        return apiCall<Request>("/requests", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async update(id: string, data: Partial<CreateRequestData>): Promise<Request> {
        return apiCall<Request>(`/requests/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    async delete(id: string): Promise<void> {
        return apiCall<void>(`/requests/${id}`, {
            method: "DELETE",
        });
    },

    async execute(data: ExecuteRequestData): Promise<any> {
        return apiCall("/requests/execute", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },
};

interface Environment {
    id: string;
    name: string;
    workspace_id?: number;
    variables?: Record<string, any>;
    [key: string]: any;
}

interface CreateEnvironmentData {
    name: string;
    workspace_id?: number;
    variables?: Record<string, any>;
    [key: string]: any;
}

interface GlobalVariables {
    [key: string]: any;
}

export const environmentsAPI = {
    async getAll(workspaceId: string | null = null): Promise<Environment[]> {
        const query = workspaceId ? `?workspace_id=${workspaceId}` : "";
        return apiCall<Environment[]>(`/environments${query}`);
    },

    async getById(id: string): Promise<Environment> {
        return apiCall<Environment>(`/environments/${id}`);
    },

    async create(data: CreateEnvironmentData): Promise<Environment> {
        return apiCall<Environment>("/environments", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async update(id: string, data: Partial<CreateEnvironmentData>): Promise<Environment> {
        return apiCall<Environment>(`/environments/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    async delete(id: string): Promise<void> {
        return apiCall<void>(`/environments/${id}`, {
            method: "DELETE",
        });
    },

    async setActive(id: string): Promise<void> {
        return apiCall<void>(`/environments/${id}/activate`, {
            method: "POST",
        });
    },

    async getGlobalVariables(): Promise<GlobalVariables> {
        return apiCall<GlobalVariables>("/global-variables");
    },

    async updateGlobalVariables(variables: GlobalVariables): Promise<GlobalVariables> {
        return apiCall<GlobalVariables>("/global-variables", {
            method: "PUT",
            body: JSON.stringify(variables),
        });
    },
};

interface Workspace {
    id: string;
    name: string;
    [key: string]: any;
}

interface CreateWorkspaceData {
    name: string;
    [key: string]: any;
}

interface WorkspaceMember {
    id: string;
    user_id: string;
    workspace_id: number;
    role: string;
    [key: string]: any;
}

interface WorkspaceInvitation {
    id: string;
    workspace_id: number;
    email: string;
    status: string;
    [key: string]: any;
}

interface InviteMemberData {
    email: string;
    role?: string;
    [key: string]: any;
}

export const workspacesAPI = {
    async getAll(): Promise<Workspace[]> {
        return apiCall<Workspace[]>("/workspaces");
    },

    async getById(id: string): Promise<Workspace> {
        return apiCall<Workspace>(`/workspaces/${id}`);
    },

    async create(data: CreateWorkspaceData): Promise<Workspace> {
        return apiCall<Workspace>("/workspaces", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async update(id: string, data: Partial<CreateWorkspaceData>): Promise<Workspace> {
        return apiCall<Workspace>(`/workspaces/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    async delete(id: string): Promise<void> {
        return apiCall<void>(`/workspaces/${id}`, {
            method: "DELETE",
        });
    },

    async getMembers(id: string): Promise<WorkspaceMember[]> {
        return apiCall<WorkspaceMember[]>(`/workspaces/${id}/members`);
    },

    async removeMember(workspaceId: string, memberId: string): Promise<void> {
        return apiCall<void>(`/workspaces/${workspaceId}/members/${memberId}`, {
            method: "DELETE",
        });
    },

    async getInvitations(id: string): Promise<WorkspaceInvitation[]> {
        return apiCall<WorkspaceInvitation[]>(`/workspaces/${id}/invitations`);
    },

    async resendInvitation(workspaceId: string, invitationId: string): Promise<void> {
        return apiCall<void>(
            `/workspaces/${workspaceId}/invitations/${invitationId}/resend`,
            {
                method: "POST",
            }
        );
    },

    async revokeInvitation(workspaceId: string, invitationId: string): Promise<void> {
        return apiCall<void>(
            `/workspaces/${workspaceId}/invitations/${invitationId}/revoke`,
            {
                method: "POST",
            }
        );
    },

    async invite(id: string, data: InviteMemberData): Promise<WorkspaceInvitation> {
        return apiCall<WorkspaceInvitation>(`/workspaces/${id}/invitations`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    },
};

interface Mock {
    id: string;
    name: string;
    workspace_id?: number;
    [key: string]: any;
}

interface CreateMockData {
    name: string;
    workspace_id?: number;
    [key: string]: any;
}

interface MockConfig {
    [key: string]: any;
}

export const mocksAPI = {
    async getAll(workspaceId: string | null = null): Promise<Mock[]> {
        const query = workspaceId ? `?workspace_id=${workspaceId}` : "";
        return apiCall<Mock[]>(`/mocks${query}`);
    },

    async getById(id: string): Promise<Mock> {
        return apiCall<Mock>(`/mocks/${id}`);
    },

    async getConfig(): Promise<MockConfig> {
        return apiCall<MockConfig>("/mocks/config");
    },

    async create(data: CreateMockData): Promise<Mock> {
        return apiCall<Mock>("/mocks", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async update(id: string, data: Partial<CreateMockData>): Promise<Mock> {
        return apiCall<Mock>(`/mocks/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    async delete(id: string): Promise<void> {
        return apiCall<void>(`/mocks/${id}`, {
            method: "DELETE",
        });
    },
};

interface ApiDoc {
    id: string;
    name: string;
    workspace_id?: number;
    [key: string]: any;
}

interface CreateApiDocData {
    name: string;
    workspace_id?: number;
    [key: string]: any;
}

interface ApiDocConfig {
    [key: string]: any;
}

export const apidocsAPI = {
    async getAll(workspaceId: string | null = null): Promise<ApiDoc[]> {
        const query = workspaceId ? `?workspace_id=${workspaceId}` : "";
        return apiCall<ApiDoc[]>(`/apidocs${query}`);
    },

    async getById(id: string): Promise<ApiDoc> {
        return apiCall<ApiDoc>(`/apidocs/${id}`);
    },

    async getConfig(): Promise<ApiDocConfig> {
        return apiCall<ApiDocConfig>("/apidocs/config");
    },

    async create(data: CreateApiDocData): Promise<ApiDoc> {
        return apiCall<ApiDoc>("/apidocs", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    async update(id: string, data: Partial<CreateApiDocData>): Promise<ApiDoc> {
        return apiCall<ApiDoc>(`/apidocs/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    async delete(id: string): Promise<void> {
        return apiCall<void>(`/apidocs/${id}`, {
            method: "DELETE",
        });
    },
};
