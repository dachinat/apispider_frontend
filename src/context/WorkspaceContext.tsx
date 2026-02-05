import { createContext } from "preact";
import { useContext, useState, useEffect, useRef } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { workspacesAPI } from "../services/api";
import { useAuth } from "./AuthContext";

interface Workspace {
    id: string | number;
    name: string;
    description?: string;
}

interface WorkspaceContextType {
    workspaces: Workspace[];
    activeWorkspaceId: string | number | null;
    activeWorkspace: Workspace | null;
    loading: boolean;
    switchWorkspace: (workspaceId: string | number) => Promise<void>;
    createWorkspace: (workspaceData: Partial<Workspace>) => Promise<Workspace>;
    updateWorkspace: (workspaceId: string | number, workspaceData: Partial<Workspace>) => Promise<Workspace>;
    deleteWorkspace: (workspaceId: string | number) => Promise<void>;
    refreshWorkspaces: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ComponentChildren }) {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | number | null>(null);
    const [loading, setLoading] = useState(false);
    const loadSeqRef = useRef(0);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            setWorkspaces([]);
            setActiveWorkspaceId(null);
            return;
        }
        loadWorkspacesFromAPI();
    }, [isAuthenticated, authLoading]);



    const loadWorkspacesFromAPI = async () => {
        const seq = ++loadSeqRef.current;
        setLoading(true);
        try {
            let workspacesList = await workspacesAPI.getAll();
            if (seq !== loadSeqRef.current) return;

            // If no workspaces exist, create a default one
            if (workspacesList.length === 0) {
                try {
                    const defaultWs = await workspacesAPI.create({
                        name: "My Workspace",
                        description: "Your personal workspace"
                    });
                    workspacesList = [defaultWs];
                } catch (createError) {
                    console.error("Failed to create default workspace:", createError);
                }
            }

            setWorkspaces(workspacesList);

            const savedWorkspaceId = localStorage.getItem("activeWorkspaceId");
            if (savedWorkspaceId) {
                const workspaceExists = workspacesList.find(ws => String(ws.id) === savedWorkspaceId);
                if (workspaceExists) {
                    setActiveWorkspaceId(workspaceExists.id);
                    return;
                }
            }

            if (workspacesList.length > 0) {
                const firstWs = workspacesList[0];
                setActiveWorkspaceId(firstWs.id);
                localStorage.setItem("activeWorkspaceId", String(firstWs.id));
            }
        } catch (error) {
            console.error("Failed to load workspaces:", error);
        } finally {
            if (seq === loadSeqRef.current) setLoading(false);
        }
    };

    const switchWorkspace = async (workspaceId: string | number) => {
        setActiveWorkspaceId(workspaceId);
        localStorage.setItem("activeWorkspaceId", String(workspaceId));
    };

    const value = {
        workspaces,
        activeWorkspaceId,
        activeWorkspace: workspaces.find(ws => ws.id === activeWorkspaceId) || null,
        loading,
        switchWorkspace,
        createWorkspace: async (data: any) => {
            const newWs = await workspacesAPI.create(data);
            setWorkspaces(prev => [...prev, newWs]);
            return newWs;
        },
        updateWorkspace: async (id: any, data: any) => {
            const updatedWs = await workspacesAPI.update(id, data);
            setWorkspaces(prev => prev.map(ws => ws.id === id ? updatedWs : ws));
            return updatedWs;
        },
        deleteWorkspace: async (id: any) => {
            await workspacesAPI.delete(id);
            setWorkspaces(prev => prev.filter(ws => String(ws.id) !== String(id)));
        },
        refreshWorkspaces: isAuthenticated ? loadWorkspacesFromAPI : () => { }
    };

    return (
        <WorkspaceContext.Provider value={value}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext);
    if (!context) throw new Error("useWorkspace must be used within a WorkspaceProvider");
    return context;
}
