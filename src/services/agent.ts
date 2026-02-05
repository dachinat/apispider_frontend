// ApiSpider Local Agent Service
const AGENT_URL = "http://127.0.0.1:8889";
const LOCAL_NETWORK_PERMISSION_KEY = "apispider_local_network_permission";

interface LocalNetworkAccessResponse {
    success: boolean;
    status: string;
    message?: string;
}

class AgentService {
    isAvailable: boolean = false;
    checking: boolean = false;
    permissionGranted: boolean;
    permissionDenied: boolean = false;

    constructor() {
        this.permissionGranted = this._loadPermissionStatus();
    }

    // Load permission status from localStorage
    private _loadPermissionStatus(): boolean {
        try {
            return localStorage.getItem(LOCAL_NETWORK_PERMISSION_KEY) === "granted";
        } catch {
            return false;
        }
    }

    // Save permission status to localStorage
    private _savePermissionStatus(granted: boolean): void {
        try {
            if (granted) {
                localStorage.setItem(LOCAL_NETWORK_PERMISSION_KEY, "granted");
            } else {
                localStorage.removeItem(LOCAL_NETWORK_PERMISSION_KEY);
            }
        } catch {
            // Ignore storage errors
        }
    }

    // Request local network access permission from the browser
    async requestLocalNetworkAccess(): Promise<LocalNetworkAccessResponse> {
        try {
            // Making a fetch request to a local network address from a public origin
            // will trigger the browser's Private Network Access preflight.
            const response = await fetch(`${AGENT_URL}/health`, {
                method: "GET",
                mode: "cors",
                // Short timeout for permission check
                signal: (AbortSignal as any).timeout ? (AbortSignal as any).timeout(5000) : undefined,
            });

            if (response.ok) {
                this.permissionGranted = true;
                this.permissionDenied = false;
                this._savePermissionStatus(true);
                return { success: true, status: "granted" };
            } else {
                return { success: false, status: "agent_error", message: "Agent returned an error" };
            }
        } catch (error: any) {
            // Check if this is a network/permission error
            const errorMessage = error.message || error.toString();

            // These error patterns typically indicate permission was denied or blocked
            if (
                errorMessage.includes("Failed to fetch") ||
                errorMessage.includes("NetworkError") ||
                errorMessage.includes("blocked") ||
                errorMessage.includes("CORS") ||
                errorMessage.includes("Private Network Access")
            ) {
                this.permissionDenied = true;
                this._savePermissionStatus(false);
                return {
                    success: false,
                    status: "blocked",
                    message: "Local network access blocked. Please allow access when prompted by your browser, or ensure the ApiSpider agent is running."
                };
            }

            // Timeout error - agent might not be running
            if (errorMessage.includes("timeout") || errorMessage.includes("TimeoutError")) {
                return {
                    success: false,
                    status: "timeout",
                    message: "Could not connect to local agent. Please ensure the ApiSpider agent is running."
                };
            }

            return {
                success: false,
                status: "error",
                message: `Connection error: ${errorMessage}`
            };
        }
    }

    // Check if local agent is running (and permission is granted)
    async checkAvailability(): Promise<boolean> {
        if (this.checking) return this.isAvailable;

        this.checking = true;

        try {
            const response = await fetch(`${AGENT_URL}/health`, {
                method: "GET",
                mode: "cors",
                signal: (AbortSignal as any).timeout ? (AbortSignal as any).timeout(2000) : undefined,
            });

            if (response.ok) {
                const data = await response.json();
                this.isAvailable = data.status === "ok";
                if (this.isAvailable) {
                    this.permissionGranted = true;
                    this._savePermissionStatus(true);
                }
            } else {
                this.isAvailable = false;
            }
        } catch (error) {
            this.isAvailable = false;
        } finally {
            this.checking = false;
        }

        return this.isAvailable;
    }

    // Execute request via local agent
    async execute(requestData: any): Promise<any> {
        try {
            const response = await fetch(`${AGENT_URL}/execute`, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    method: requestData.method,
                    url: requestData.url,
                    headers: requestData.headers || {},
                    body: requestData.body || "",
                    formData: requestData.formData || [],
                    authType: requestData.authType,
                    authData: requestData.authData,
                }),
            });

            if (!response.ok) {
                throw new Error(`Agent request failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Agent execution failed:", error);
            throw error;
        }
    }

    // Check if URL requires local agent (localhost or private IP)
    requiresAgent(url: string): boolean {
        if (!url) return false;

        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();

            // Check for localhost
            if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0") {
                return true;
            }

            // Check for IPv6 loopback
            if (hostname === "::1" || hostname === "[::1]") {
                return true;
            }

            // Check for private IP ranges
            if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
                return true;
            }

            if (/^172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
                return true;
            }

            if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
                return true;
            }

            if (hostname.endsWith(".local")) {
                return true;
            }

            return false;
        } catch {
            const urlLower = url.toLowerCase();

            if (urlLower.includes("localhost") || urlLower.includes("127.0.0.1") || urlLower.includes("0.0.0.0")) {
                return true;
            }

            const privateIPPatterns = [
                /192\.168\.\d{1,3}\.\d{1,3}/,
                /10\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
                /172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}/,
            ];

            return privateIPPatterns.some((pattern) => pattern.test(url));
        }
    }

    getHealthUrl(): string {
        return `${AGENT_URL}/health`;
    }

    getAgentUrl(): string {
        return AGENT_URL;
    }

    hasPermissionCached(): boolean {
        return this.permissionGranted;
    }

    resetPermissionStatus(): void {
        this.permissionGranted = false;
        this.permissionDenied = false;
        this._savePermissionStatus(false);
    }
}

export const agentService = new AgentService();
