import { useState, useEffect } from "preact/hooks";
import { workspacesAPI } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { useWorkspace } from "../../context/WorkspaceContext";
import { formatBackendError } from "../../utils/errors";
import CommonLayout from "../../components/CommonLayout";
import SpiderSpinner from "../../components/SpiderSpinner";

interface Member {
    id: string;
    user_id: string;
    workspace_id: number;
    role: string;
    email?: string;
    name?: string;
    avatar?: string;
}

interface Invitation {
    id: string;
    workspace_id: number;
    email: string;
    role?: string;
    status: string;
    invite_link?: string;
}

export default function Invites() {
    const { user } = useAuth();
    const { activeWorkspaceId } = useWorkspace();

    const [email, setEmail] = useState("");
    const [role, setRole] = useState("viewer");
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [memberActionLoading, setMemberActionLoading] = useState<Record<string, boolean>>({});
    const [inviteActionLoading, setInviteActionLoading] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<string | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [lastInviteLink, setLastInviteLink] = useState("");

    const currentUserId = user?.id ?? null;

    useEffect(() => {
        if (activeWorkspaceId) {
            setEmail("");
            setRole("viewer");
            setError(null);
            setLoading(false);
            setLastInviteLink("");
            setMemberActionLoading({});
            setInviteActionLoading({});

            setMembers([]);
            setInvitations([]);
            setLoadingData(true);

            Promise.all([
                workspacesAPI.getMembers(String(activeWorkspaceId)),
                workspacesAPI.getInvitations(String(activeWorkspaceId)),
            ])
                .then(([m, inv]) => {
                    setMembers((Array.isArray(m) ? m : []) as Member[]);
                    setInvitations((Array.isArray(inv) ? inv : []) as Invitation[]);
                })
                .catch((e) => {
                    setError(formatBackendError(e.message) || "Failed to load workspace members");
                })
                .finally(() => {
                    setLoadingData(false);
                });
        }
    }, [activeWorkspaceId]);

    const handleInvite = async () => {
        if (!activeWorkspaceId) return;
        if (!email.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const res = await workspacesAPI.invite(String(activeWorkspaceId), { email: email.trim(), role });
            setLastInviteLink(res?.invite_link || "");

            setEmail("");
            setRole("viewer");
            await refreshInvitations();
        } catch (e: any) {
            setError(formatBackendError(e.message) || "Failed to send invitation");
        } finally {
            setLoading(false);
        }
    };

    const handleRevokeInvite = async (invitationId: string) => {
        if (!activeWorkspaceId || !invitationId) return;
        setError(null);
        setInviteActionLoading((prev) => ({ ...prev, [invitationId]: true }));
        try {
            await workspacesAPI.revokeInvitation(String(activeWorkspaceId), invitationId);
            await refreshInvitations();
        } catch (e: any) {
            setError(formatBackendError(e.message) || "Failed to remove invitation");
        } finally {
            setInviteActionLoading((prev) => {
                const next = { ...prev };
                delete next[invitationId];
                return next;
            });
        }
    };

    const refreshInvitations = async () => {
        if (!activeWorkspaceId) return;
        try {
            const inv = await workspacesAPI.getInvitations(String(activeWorkspaceId));
            setInvitations((Array.isArray(inv) ? inv : []) as Invitation[]);
        } catch (e) {
            console.error("Failed to refresh invitations", e);
        }
    };

    const refreshMembers = async () => {
        if (!activeWorkspaceId) return;
        try {
            const m = await workspacesAPI.getMembers(String(activeWorkspaceId));
            setMembers((Array.isArray(m) ? m : []) as Member[]);
        } catch (e) {
            console.error("Failed to refresh members", e);
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!activeWorkspaceId || !memberId) return;
        setError(null);
        setMemberActionLoading((prev) => ({ ...prev, [memberId]: true }));
        try {
            await workspacesAPI.removeMember(String(activeWorkspaceId), memberId);
            await refreshMembers();
        } catch (e: any) {
            setError(formatBackendError(e.message) || "Failed to remove member");
        } finally {
            setMemberActionLoading((prev) => {
                const next = { ...prev };
                delete next[memberId];
                return next;
            });
        }
    };

    const handleResendInvite = async (invitationId: string) => {
        if (!activeWorkspaceId || !invitationId) return;
        setError(null);
        setInviteActionLoading((prev) => ({ ...prev, [invitationId]: true }));
        try {
            await workspacesAPI.resendInvitation(String(activeWorkspaceId), invitationId);
            await refreshInvitations();
        } catch (e: any) {
            setError(formatBackendError(e.message) || "Failed to resend invitation");
        } finally {
            setInviteActionLoading((prev) => {
                const next = { ...prev };
                delete next[invitationId];
                return next;
            });
        }
    };

    const copyToClipboard = async (text?: string) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            // ignore
        }
    };

    const pendingInvites = invitations.filter((inv) => inv?.status === "pending");

    return (
        <CommonLayout activeActivity="invites">
            <div className="h-full flex flex-col bg-base-100 overflow-hidden relative">
                {loadingData && (
                    <div className="absolute inset-0 bg-base-100/60 z-50 flex flex-col items-center justify-center">
                        <SpiderSpinner className="w-12 h-12" />
                        <span className="text-xs text-base-content/40 mt-4 font-bold uppercase tracking-widest">
                            Coordinating...
                        </span>
                    </div>
                )}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 relative">
                    <div className="mx-auto w-full space-y-6"> {/*max-w-5xl */}
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-base-content">Team</h2>
                                <p className="text-sm text-base-content/60 mt-1">Manage members and invitations</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="badge badge-lg gap-2 bg-base-200 border-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="font-semibold">{members.length}</span>
                                    <span className="text-base-content/60">members</span>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="alert alert-error shadow-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
                            <div className="lg:col-span-3 space-y-6">
                                {/* Members Card */}
                                <div className="bg-base-100 rounded-2xl border border-base-300/50 shadow-sm overflow-hidden">
                                    <div className="px-5 py-4 border-b border-base-200">
                                        <h3 className="text-sm font-semibold text-base-content">Active Members</h3>
                                    </div>

                                    {members.length === 0 ? (
                                        <div className="p-10 text-center">
                                            <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-3">
                                                <svg className="w-6 h-6 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-sm text-base-content/50">No members found</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-base-200/50">
                                            {members.map((m) => (
                                                <div key={m.id} className="px-5 py-3 hover:bg-base-200/30 transition-colors group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="avatar">
                                                            <div className="w-9 h-9 rounded-full ring-2 ring-base-200 overflow-hidden bg-base-200 flex items-center justify-center">
                                                                {m.avatar ? (
                                                                    <img src={m.avatar} alt={m.name || m.email} />
                                                                ) : (
                                                                    <span className="text-xs font-bold opacity-30">{(m.name || m.email || "?").charAt(0).toUpperCase()}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium text-base-content truncate">{m.name || m.email}</span>
                                                                {m.user_id === currentUserId && (
                                                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">You</span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-xs text-base-content/50 truncate">{m.email}</span>
                                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${m.role === 'admin' ? 'bg-primary/10 text-primary' :
                                                                    m.role === 'editor' ? 'bg-accent/10 text-accent' :
                                                                        'bg-base-200 text-base-content/60'
                                                                    }`}>{m.role}</span>
                                                            </div>
                                                        </div>
                                                        {m.user_id !== currentUserId && (
                                                            <button
                                                                className="btn btn-ghost btn-sm btn-square opacity-0 group-hover:opacity-100 transition-opacity text-base-content/50 hover:text-error hover:bg-error/10"
                                                                onClick={() => handleRemoveMember(m.id)}
                                                                disabled={memberActionLoading[m.id]}
                                                                title="Remove member"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Pending Invites Card */}
                                <div className="bg-base-100 rounded-2xl border border-base-300/50 shadow-sm overflow-hidden">
                                    <div className="px-5 py-4 border-b border-base-200 flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-base-content">Pending Invitations</h3>
                                        {pendingInvites.length > 0 && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning font-medium">{pendingInvites.length} pending</span>
                                        )}
                                    </div>

                                    {pendingInvites.length === 0 ? (
                                        <div className="p-10 text-center">
                                            <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-3">
                                                <svg className="w-6 h-6 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <p className="text-sm text-base-content/50">No pending invitations</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-base-200/50">
                                            {pendingInvites.map((inv) => (
                                                <div key={inv.id} className="px-5 py-3 hover:bg-base-200/30 transition-colors group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-warning/10 text-warning flex-shrink-0">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-medium text-base-content truncate">{inv.email}</div>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${inv.role === 'admin' ? 'bg-primary/10 text-primary' :
                                                                    inv.role === 'editor' ? 'bg-accent/10 text-accent' :
                                                                        'bg-base-200 text-base-content/60'
                                                                    }`}>{inv.role}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            {inv.invite_link && (
                                                                <button
                                                                    className="btn btn-ghost btn-sm btn-square text-base-content/50 hover:text-primary"
                                                                    onClick={() => copyToClipboard(inv.invite_link)}
                                                                    title="Copy Link"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                            <button
                                                                className="btn btn-ghost btn-sm btn-square text-base-content/50 hover:text-info"
                                                                onClick={() => handleResendInvite(inv.id)}
                                                                disabled={inviteActionLoading[inv.id]}
                                                                title="Resend invitation"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                className="btn btn-ghost btn-sm btn-square text-base-content/50 hover:text-error hover:bg-error/10"
                                                                onClick={() => handleRevokeInvite(inv.id)}
                                                                disabled={inviteActionLoading[inv.id]}
                                                                title="Revoke invitation"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="lg:col-span-3">
                                <div className="bg-base-100 rounded-2xl border border-base-300/50 shadow-sm sticky top-6 overflow-hidden">
                                    <div className="px-5 py-4 border-b border-base-200 bg-gradient-to-r from-primary/5 to-transparent">
                                        <h3 className="text-sm font-semibold text-base-content flex items-center gap-2">
                                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            </svg>
                                            Invite New Member
                                        </h3>
                                    </div>

                                    <div className="p-5 space-y-4">
                                        <div>
                                            <label className="text-xs font-medium text-base-content/70 mb-1.5 block">Email Address</label>
                                            <input
                                                type="email"
                                                placeholder="colleague@company.com"
                                                className="input input-bordered w-full h-10 text-sm"
                                                value={email}
                                                onInput={(e: any) => setEmail(e.target.value)}
                                                disabled={loading}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-base-content/70 mb-1.5 block">Role</label>
                                            <div className="grid grid-cols-3 gap-1 p-1 bg-base-200 rounded-lg border border-base-300">
                                                {['viewer', 'editor', 'admin'].map((r) => (
                                                    <button
                                                        key={r}
                                                        type="button"
                                                        onClick={() => setRole(r)}
                                                        disabled={loading}
                                                        className={`py-1.5 px-3 rounded-md text-xs font-semibold transition-all ${role === r
                                                            ? "bg-base-100 text-primary shadow-sm"
                                                            : "text-base-content/50 hover:text-base-content"
                                                            }`}
                                                    >
                                                        {r.charAt(0).toUpperCase() + r.slice(1)}
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-[11px] text-base-content/50 mt-1.5">
                                                {role === 'admin' ? 'Can manage workspace settings and members' :
                                                    role === 'editor' ? 'Can create and edit collections/requests' :
                                                        'Can view collections and requests only'}
                                            </p>
                                        </div>

                                        <button
                                            className="btn btn-primary w-full h-10 text-sm"
                                            onClick={handleInvite}
                                            disabled={loading || !email.trim() || !activeWorkspaceId}
                                        >
                                            {loading ? (
                                                <SpiderSpinner className="w-4 h-4" />
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                    </svg>
                                                    Send Invitation
                                                </>
                                            )}
                                        </button>

                                        {lastInviteLink && (
                                            <div className="pt-4 border-t border-base-200 space-y-3 animate-in fade-in duration-300">
                                                <div className="flex items-center gap-2 text-success text-sm">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Invitation sent!
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-medium text-base-content/50 uppercase tracking-wider mb-1.5 block">Invite Link</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={lastInviteLink}
                                                            className="input input-bordered input-sm flex-1 text-xs font-mono bg-base-200/50"
                                                            readOnly
                                                        />
                                                        <button
                                                            className="btn btn-sm btn-ghost"
                                                            onClick={() => copyToClipboard(lastInviteLink)}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CommonLayout >
    );
}
