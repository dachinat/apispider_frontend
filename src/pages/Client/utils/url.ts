export const DEFAULT_HEADERS = {
    "Cache-Control": "no-cache",
    "Content-Length": "0",
    "User-Agent": "ApiSpider/0.0.1",
    Accept: "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
};

export const parseUrlParams = (urlString: string): Record<string, string> => {
    try {
        if (!urlString || typeof urlString !== "string") return {};

        const queryIndex = urlString.indexOf("?");
        if (queryIndex === -1) return {};

        const queryString = urlString.slice(queryIndex + 1);
        const params = new URLSearchParams(queryString);
        const result: Record<string, string> = {};

        for (const [key, value] of params.entries()) {
            result[key] = value;
        }

        return result;
    } catch (e) {
        return {};
    }
};

export const buildUrlWithParams = (baseUrl: string, params: Record<string, string>): string => {
    try {
        const urlBase = (baseUrl || "").split("?")[0];

        const searchParams = new URLSearchParams();
        Object.entries(params || {}).forEach(([key, value]) => {
            if (!key) return;
            if (value === undefined || value === null) return;
            searchParams.set(key, String(value));
        });

        const qs = searchParams.toString();
        // Keep {{ and }} un-encoded for readability and substitution
        const readableQs = qs.replace(/%7B%7B/g, "{{").replace(/%7D%7D/g, "}}");
        return readableQs ? `${urlBase}?${readableQs}` : urlBase;
    } catch (e) {
        return (baseUrl || "").split("?")[0];
    }
};
