import { apiCall } from "./api";

export const historyService = {
    async getAll(params: Record<string, any> = {}) {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                query.append(key, String(value));
            }
        });
        const queryString = query.toString();
        return apiCall(`/history${queryString ? `?${queryString}` : ""}`);
    },
    async getById(id: string | number) {
        return apiCall(`/history/${id}`);
    },
    async save(data: any) {
        return apiCall("/history", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },
    async delete(id: string | number) {
        return apiCall(`/history/${id}`, {
            method: "DELETE",
        });
    },
    async clearAll() {
        return apiCall("/history", {
            method: "DELETE",
        });
    }
};
