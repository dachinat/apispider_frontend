import { apiCall } from "./api";
import type { User } from "../context/AuthContext";

interface SignupResponse {
    message?: string;
    [key: string]: any;
}

interface LoginResponse {
    token: string;
    user: User;
    is_first_login?: boolean;
    [key: string]: any;
}

interface ConfirmEmailResponse {
    message?: string;
    [key: string]: any;
}

interface UpdateUserResponse extends User {
    [key: string]: any;
}

export const authService = {
    async signup(name: string, email: string, password: string): Promise<SignupResponse> {
        const data = await apiCall("/auth/signup", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
        });

        return data;
    },

    async login(email: string, password: string): Promise<LoginResponse> {
        const data = await apiCall("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        // Store token and user
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        return data;
    },

    logout(): void {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },

    getToken(): string | null {
        return localStorage.getItem("token");
    },

    getUser(): User | null {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },

    // Helper to get auth headers for API calls
    getAuthHeaders(): Record<string, string> {
        const token = this.getToken();
        return {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    },

    async confirmEmail(token: string): Promise<ConfirmEmailResponse> {
        return await apiCall(`/auth/confirm/${token}`, {
            method: "POST",
        });
    },

    async resendConfirmation(email: string): Promise<ConfirmEmailResponse> {
        return await apiCall("/auth/resend-confirmation", {
            method: "POST",
            body: JSON.stringify({ email }),
        });
    },

    async forgotPassword(email: string): Promise<ConfirmEmailResponse> {
        return await apiCall("/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify({ email }),
        });
    },

    async resetPassword(token: string, password: string): Promise<ConfirmEmailResponse> {
        return await apiCall("/auth/reset-password", {
            method: "POST",
            body: JSON.stringify({ token, password }),
        });
    },

    async updateName(name: string): Promise<UpdateUserResponse> {
        const data = await apiCall("/user/name", {
            method: "PUT",
            body: JSON.stringify({ name }),
        });

        // Update stored user
        const user = this.getUser();
        if (user) {
            user.name = data.name;
            user.avatar = data.avatar;
            localStorage.setItem("user", JSON.stringify(user));
        }

        return data;
    },

    async updatePassword(currentPassword: string, newPassword: string): Promise<ConfirmEmailResponse> {
        return await apiCall("/user/password", {
            method: "PUT",
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword,
            }),
        });
    },

    async updateTheme(theme: string): Promise<UpdateUserResponse> {
        const data = await apiCall("/user/theme", {
            method: "PUT",
            body: JSON.stringify({ theme }),
        });

        // Update stored user
        const user = this.getUser();
        if (user) {
            user.theme = data.theme;
            localStorage.setItem("user", JSON.stringify(user));
        }

        return data;
    },

    async updateAvatar(avatar: string): Promise<UpdateUserResponse> {
        const data = await apiCall("/user/avatar", {
            method: "PUT",
            body: JSON.stringify({ avatar }),
        });

        // Update stored user
        const user = this.getUser();
        if (user) {
            user.avatar = data.avatar;
            user.is_custom_avatar = data.is_custom_avatar;
            localStorage.setItem("user", JSON.stringify(user));
        }

        return data;
    },

    async removeAvatar(): Promise<UpdateUserResponse> {
        const data = await apiCall("/user/avatar", {
            method: "DELETE",
        });

        // Update stored user
        const user = this.getUser();
        if (user) {
            user.avatar = data.avatar;
            user.is_custom_avatar = data.is_custom_avatar;
            localStorage.setItem("user", JSON.stringify(user));
        }

        return data;
    },
};