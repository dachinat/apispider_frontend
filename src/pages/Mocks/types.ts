export interface Endpoint {
    method: string;
    path: string;
    response_code: number;
    response_body: string;
    delay: number;
}

export interface MockTab {
    id: number;
    name: string;
    mockId: string | null;
    slug?: string;
    endpoints: Endpoint[];
    is_published: boolean;
    saved: boolean;
}

export interface Mock {
    id: string;
    name: string;
    slug?: string;
    endpoints: Endpoint[];
    is_published: boolean;
    workspace_id: number;
}

export interface MockConfig {
    format?: "subdomain" | "path";
    base_url?: string;
    prefix?: string;
}
