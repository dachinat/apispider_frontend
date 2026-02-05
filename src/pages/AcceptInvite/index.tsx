import { useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";

import Layout from "../../components/Layout";
import DarkModeToggle from "../../components/DarkModeToggle";
import { apiCall } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { useWorkspace } from "../../context/WorkspaceContext";

export default function AcceptInvite() {
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const { refreshWorkspaces, switchWorkspace } = useWorkspace();

    let urlParams: URLSearchParams | undefined;
    if (typeof window !== "undefined") {
        urlParams = new URLSearchParams(window.location.search);
    }
    const token = urlParams?.get("token");
    const firstLogin = urlParams?.get("firstLogin") === "1";

    const [status, setStatus] = useState<"accepting" | "success" | "error">("accepting");
    const [message, setMessage] = useState("");
    const [inviteInfo, setInviteInfo] = useState<any>(null);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("No invitation token found in URL.");
            return;
        }

        const nextQs = new URLSearchParams({ token });
        if (firstLogin) nextQs.set("firstLogin", "1");
        const next = `/accept-invite?${nextQs.toString()}`;

        const routeToAuth = async () => {
            try {
                const info = await apiCall<any>(
                    `/invitations/${encodeURIComponent(token)}`,
                    {
                        method: "GET",
                    },
                );

                if (!info?.email) {
                    setStatus("error");
                    setMessage("Invalid invitation.");
                    return;
                }

                const qs = new URLSearchParams({
                    next,
                    email: info.email,
                    emailLocked: "1",
                });

                if (info.workspace_name) qs.set("workspaceName", info.workspace_name);
                if (info.invited_by?.name)
                    qs.set("invitedByName", info.invited_by.name);
                if (info.invited_by?.email)
                    qs.set("invitedByEmail", info.invited_by.email);

                location.route(
                    `/${info.user_exists ? "sign-in" : "sign-up"}?${qs.toString()}`,
                );
            } catch (e: any) {
                setStatus("error");
                setMessage(e.message || "Failed to load invitation.");
            }
        };

        if (!isAuthenticated) {
            routeToAuth();
            return;
        }

        const doAccept = async () => {
            try {
                const result = await apiCall<any>(
                    `/invitations/${encodeURIComponent(token)}/accept`,
                    {
                        method: "POST",
                    },
                );

                await refreshWorkspaces();
                if (result?.workspace_id) {
                    await switchWorkspace(result.workspace_id);
                }

                setStatus("success");
                setMessage("Invitation accepted successfully!");
                setInviteInfo({
                    workspaceName: result?.workspace_name,
                    role: result?.role,
                    invitedBy: result?.invited_by,
                });
            } catch (e: any) {
                setStatus("error");
                setMessage(e.message || "Failed to accept invitation.");
            }
        };

        doAccept();
    }, [isAuthenticated, token, firstLogin]);

    return (
        <Layout
            buttons={
                <>
                    <DarkModeToggle />
                </>
            }
        >
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
                <div className="w-full max-w-md">
                    <div className="bg-base-100 rounded-lg shadow-lg p-8">
                        <h2 className="text-3xl font-bold text-center mb-8">
                            Accept Invitation
                        </h2>

                        {status === "accepting" && (
                            <div className="flex flex-col items-center space-y-4">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                                <p>Accepting invitation...</p>
                            </div>
                        )}

                        {status === "success" && (
                            <div className="space-y-6">
                                <div className="alert alert-success">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="stroke-current shrink-0 h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>{message}</span>
                                </div>

                                {(inviteInfo?.workspaceName ||
                                    inviteInfo?.invitedBy?.email ||
                                    inviteInfo?.invitedBy?.name ||
                                    inviteInfo?.role) && (
                                        <div className="rounded-lg border border-base-300 bg-base-200/30 p-4 text-sm space-y-2">
                                            {inviteInfo?.workspaceName && (
                                                <div>
                                                    <span className="font-semibold">Workspace:</span>{" "}
                                                    {inviteInfo.workspaceName}
                                                </div>
                                            )}
                                            {(inviteInfo?.invitedBy?.name ||
                                                inviteInfo?.invitedBy?.email) && (
                                                    <div>
                                                        <span className="font-semibold">Invited by:</span>{" "}
                                                        {inviteInfo.invitedBy.name ||
                                                            inviteInfo.invitedBy.email}
                                                        {inviteInfo.invitedBy.name &&
                                                            inviteInfo.invitedBy.email && (
                                                                <span className="opacity-70">
                                                                    {" "}
                                                                    ({inviteInfo.invitedBy.email})
                                                                </span>
                                                            )}
                                                    </div>
                                                )}
                                            {inviteInfo?.role && (
                                                <div>
                                                    <span className="font-semibold">Role:</span>{" "}
                                                    {inviteInfo.role}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <button
                                    onClick={() => {
                                        if (firstLogin) {
                                            location.route("/settings?tab=theme");
                                            return;
                                        }
                                        location.route("/");
                                    }}
                                    className="btn btn-primary w-full"
                                >
                                    {firstLogin ? "Continue (choose appearance)" : "Go to App"}
                                </button>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="space-y-6">
                                <div className="alert alert-error">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="stroke-current shrink-0 h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>{message}</span>
                                </div>
                                <button
                                    onClick={() => location.route("/")}
                                    className="btn btn-outline w-full"
                                >
                                    Back
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
