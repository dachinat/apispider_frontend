import { createContext } from "preact";
import { useContext, useState, useEffect } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { environmentsAPI } from "../services/api";
import { useAuth } from "./AuthContext";

interface Environment {
  id: string | number;
  name: string;
  baseUrl: string;
  variables?: Record<string, string>;
  is_active?: boolean;
}

interface EnvironmentContextType {
  environments: Environment[];
  globalVariables: Record<string, string>;
  activeEnvironmentId: string | number | null;
  setActiveEnvironmentId: (id: string | number | null) => Promise<void>;
  updateEnvironments: (updates: {
    environments: Environment[];
    globalVariables: Record<string, string>;
  }) => Promise<void>;
  getActiveEnvironment: () => Environment | null;
  replaceVariables: (text: string) => string;
  getBaseUrl: () => string;
  loading: boolean;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(
  undefined,
);

export function EnvironmentProvider({
  children,
  activeWorkspaceId,
}: {
  children: ComponentChildren;
  activeWorkspaceId: string | null;
}) {
  const { isAuthenticated } = useAuth();

  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [globalVariables, setGlobalVariables] = useState<
    Record<string, string>
  >({});
  const [activeEnvironmentId, setActiveEnvironmentId] = useState<
    string | number | null
  >(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setEnvironments([]);
      setGlobalVariables({});
      setActiveEnvironmentId(null);
      return;
    }

    if (!activeWorkspaceId) {
      setEnvironments([]);
      setGlobalVariables({});
      setActiveEnvironmentId(null);
      return;
    }

    loadEnvironmentsFromAPI();
  }, [isAuthenticated, activeWorkspaceId]);

  const loadEnvironmentsFromAPI = async () => {
    setLoading(true);
    try {
      const workspaceEnvs = await environmentsAPI.getAll(activeWorkspaceId);
      const transformedEnvs = workspaceEnvs.map((env: any) => ({
        ...env,
        baseUrl: env.base_url || env.baseUrl || "",
      }));
      setEnvironments(transformedEnvs);

      const activeEnvFromApi = workspaceEnvs.find((env: any) => env.is_active);
      if (activeEnvFromApi) {
        setActiveEnvironmentId(activeEnvFromApi.id);
      } else if (workspaceEnvs.length > 0) {
        // If no active environment is returned from API, try to keep the current one if it's still valid
        const currentId = activeEnvironmentId;
        const isStillValid =
          currentId &&
          workspaceEnvs.some(
            (env: any) => String(env.id) === String(currentId),
          );

        if (isStillValid) {
          // Restore active status on backend if it was lost during update
          setActiveEnvironmentId(currentId);
          await environmentsAPI.setActive(String(currentId));
        } else {
          // Fallback to the first one if current is invalid or none selected
          const firstId = workspaceEnvs[0].id;
          setActiveEnvironmentId(firstId);
          await environmentsAPI.setActive(String(firstId));
        }
      } else {
        setActiveEnvironmentId(null);
      }

      const globalVars = await environmentsAPI.getGlobalVariables();
      const globalVarsObject: Record<string, string> = {};
      if (Array.isArray(globalVars)) {
        globalVars.forEach((item: any) => {
          if (item && item.key) {
            globalVarsObject[item.key] = item.value || "";
          }
        });
      }
      setGlobalVariables(globalVarsObject);
    } catch (error) {
      console.error("Failed to load environments:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateEnvironments = async ({
    environments: newEnvs,
    globalVariables: newGlobals,
  }: {
    environments: Environment[];
    globalVariables: Record<string, string>;
  }) => {
    if (!activeWorkspaceId) return;

    setLoading(true);
    try {
      await environmentsAPI.updateGlobalVariables(newGlobals);
      setGlobalVariables(newGlobals);

      const workspaceId =
        typeof activeWorkspaceId === "string"
          ? parseInt(activeWorkspaceId, 10)
          : activeWorkspaceId;

      // Delete environments that are no longer present
      const envsToDelete = environments.filter(
        (oldEnv) =>
          !newEnvs.find((newEnv) => String(newEnv.id) === String(oldEnv.id)),
      );
      for (const env of envsToDelete) {
        await environmentsAPI.delete(String(env.id));
      }

      // Create or Update environments
      const updatedEnvs: Environment[] = [];
      for (const env of newEnvs) {
        const envData = {
          name: env.name,
          base_url: env.baseUrl,
          variables: env.variables,
          workspace_id: workspaceId,
        };

        if (String(env.id).startsWith("new-")) {
          // Create new environment
          const createdEnv = await environmentsAPI.create(envData);
          updatedEnvs.push({
            ...createdEnv,
            baseUrl: createdEnv.base_url || createdEnv.baseUrl || "",
          });
        } else {
          // Update existing environment
          const updatedEnv = await environmentsAPI.update(
            String(env.id),
            envData,
          );
          updatedEnvs.push({
            ...updatedEnv,
            baseUrl: updatedEnv.base_url || updatedEnv.baseUrl || "",
          });
        }
      }

      setEnvironments(updatedEnvs);

      // Re-sync with API to ensure everything is correct
      await loadEnvironmentsFromAPI();
    } catch (error) {
      console.error("Failed to update environments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActiveEnvironment = () =>
    environments.find((env) => env.id === activeEnvironmentId) || null;

  const replaceVariables = (text: string) => {
    if (typeof text !== "string") return text;
    const activeEnv = getActiveEnvironment();
    return text.replace(
      /(\{\{|%7B%7B)([^%{}]+)(\}\}|%7D%7D)/g,
      (match, open, variableName) => {
        const trimmedName = variableName.trim();
        const resolved =
          activeEnv?.variables?.[trimmedName] ||
          globalVariables[trimmedName] ||
          `{{${trimmedName}}}`;
        return open === "%7B%7B" ? encodeURIComponent(resolved) : resolved;
      },
    );
  };

  const getBaseUrl = () => {
    const activeEnv = getActiveEnvironment();
    return activeEnv ? replaceVariables(activeEnv.baseUrl) : "";
  };

  const value = {
    environments,
    globalVariables,
    activeEnvironmentId,
    setActiveEnvironmentId: async (id: string | number | null) => {
      if (id) {
        await environmentsAPI.setActive(String(id));
      }
      setActiveEnvironmentId(id);
    },
    updateEnvironments,
    getActiveEnvironment,
    replaceVariables,
    getBaseUrl,
    loading,
  };

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  const context = useContext(EnvironmentContext);
  if (!context)
    throw new Error(
      "useEnvironment must be used within an EnvironmentProvider",
    );
  return context;
}
