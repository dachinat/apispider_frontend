export const methodColors: Record<string, string> = {
    GET: "badge-success",
    POST: "badge-info",
    PUT: "badge-warning",
    PATCH: "badge-accent",
    DELETE: "badge-error",
    HEAD: "badge-secondary",
    OPTIONS: "badge-neutral",
};

export const getMethodColor = (method: string | null | undefined): string => {
    return methodColors[method?.toUpperCase() || ""] || "badge-ghost";
};
