import { useState, useRef, useEffect, useCallback } from "preact/hooks";
import { useAuth } from "../hooks/useAuth";
import { useWorkspace } from "../context/WorkspaceContext";
import { workspacesAPI } from "../services/api";

interface Member {
    id: string;
    user_id: string;
    workspace_id: string | number;
    role: string;
    email?: string;
    name?: string;
    avatar?: string;
}

export default function AvatarMembers() {
    const { isAuthenticated } = useAuth();
    const { activeWorkspaceId } = useWorkspace();
    const [workspaceMembers, setWorkspaceMembers] = useState<Member[]>([]);
    const workspaceMembersLoadSeqRef = useRef(0);

    const refreshWorkspaceMembers = useCallback(async () => {
        if (!activeWorkspaceId) {
            setWorkspaceMembers([]);
            return;
        }

        const seq = ++workspaceMembersLoadSeqRef.current;
        try {
            const m = await workspacesAPI.getMembers(String(activeWorkspaceId));
            if (seq !== workspaceMembersLoadSeqRef.current) return;
            setWorkspaceMembers((Array.isArray(m) ? m : []) as any[]);
        } catch {
            if (seq !== workspaceMembersLoadSeqRef.current) return;
            setWorkspaceMembers([]);
        }
    }, [isAuthenticated, activeWorkspaceId]);

    useEffect(() => {
        refreshWorkspaceMembers();
    }, [refreshWorkspaceMembers]);

    if (!activeWorkspaceId || workspaceMembers.length <= 1) {
        return null;
    }

    return (
        <div className="avatar-group -space-x-3 pr-1">
            {workspaceMembers.map((m) => {
                const key = `${m?.user_id ?? ""}-${m?.id ?? ""}`;
                const title = m?.name || m?.email || "Member";
                const alt = m?.name || m?.email || "Member";
                return (
                    <div className="avatar" key={key} title={title}>
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-base-200 flex items-center justify-center">
                            {m.avatar ? (
                                <img src={m.avatar} alt={alt} />
                            ) : (
                                <span className="text-[10px] font-bold opacity-30">{(m.name || m.email || "?").charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
