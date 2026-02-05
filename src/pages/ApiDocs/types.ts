export interface ApiDocTab {
    id: number;
    name: string;
    docId: string | null;
    summary: string;
    collection_ids: string[];
    theme: string;
    logo_url_light: string;
    logo_url_dark: string;
    footer_text: string;
    is_published: boolean;
    saved: boolean;
    slug?: string;
}

export interface ApiDocument {
    id: string;
    name: string;
    summary: string;
    collection_ids: string;
    theme: string;
    logo_url_light: string;
    logo_url_dark: string;
    footer_text: string;
    is_published: boolean;
    slug?: string;
    workspace_id: number;
}

export interface Collection {
    id: string;
    name: string;
    description?: string;
    requests_count?: number;
    request_count?: number;
    [key: string]: any;
}

export interface DocConfig {
    format: "path" | "subdomain";
    base_url?: string;
    prefix?: string;
}
