import { useState, useEffect } from "preact/hooks";

interface Environment {
    id: string | number;
    name: string;
    baseUrl?: string;
    variables?: Record<string, string>;
}

interface VariableTableProps {
    variables: Record<string, string>;
    envId: string | number | null;
    updateVariable: (envId: string | number | null, oldKey: string, newKey: string, value: string) => void;
    deleteVariable: (envId: string | number | null, key: string) => void;
    addVariable: (envId: string | number | null) => void;
}

const VariableTable = ({ variables, envId, updateVariable, deleteVariable, addVariable }: VariableTableProps) => {
    const [localInputs, setLocalInputs] = useState<Record<string, { key: string; value: string }>>({});

    // Update local inputs when variables change (but not during typing)
    useEffect(() => {
        const newInputs: Record<string, { key: string; value: string }> = {};
        Object.entries(variables || {}).forEach(([key, value], index) => {
            const inputKey = `${envId}-${index}`;
            if (!localInputs[inputKey]) {
                newInputs[inputKey] = { key, value };
            } else {
                newInputs[inputKey] = localInputs[inputKey];
            }
        });
        setLocalInputs(newInputs);
    }, [variables, envId]);

    const handleKeyChange = (inputKey: string, newKey: string, currentValue: string) => {
        setLocalInputs(prev => ({
            ...prev,
            [inputKey]: { key: newKey, value: currentValue }
        }));
    };

    const handleValueChange = (inputKey: string, currentKey: string, newValue: string) => {
        setLocalInputs(prev => ({
            ...prev,
            [inputKey]: { key: currentKey, value: newValue }
        }));
    };

    const handleBlur = (inputKey: string, originalKey: string) => {
        const localInput = localInputs[inputKey];
        if (localInput) {
            updateVariable(envId, originalKey, localInput.key, localInput.value);
        }
    };

    const isEmpty = !variables || Object.keys(variables).length === 0;

    return (
        <div className="space-y-4">
            {isEmpty ? (
                <div className="text-center py-12 border border-dashed border-base-300 rounded-lg bg-base-200/50">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <p className="text-sm opacity-60 mb-4">No variables defined</p>
                    <button
                        className="btn btn-sm btn-outline"
                        onClick={() => addVariable(envId)}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add First Variable
                    </button>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto border border-base-300 rounded-lg">
                        <table className="table w-full">
                            <thead>
                                <tr className="bg-base-200/50">
                                    <th className="font-semibold">Variable Name</th>
                                    <th className="font-semibold">Value</th>
                                    <th className="w-20"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(variables || {}).map(([key, value], index) => {
                                    const inputKey = `${envId}-${index}`;
                                    const localInput = localInputs[inputKey] || { key, value };

                                    return (
                                        <tr key={inputKey} className="hover:bg-base-200/30">
                                            <td>
                                                <input
                                                    type="text"
                                                    className="input input-sm input-ghost w-full focus:bg-base-100"
                                                    value={localInput.key}
                                                    placeholder="variable_name"
                                                    onInput={(e) => handleKeyChange(inputKey, (e.target as HTMLInputElement).value, localInput.value)}
                                                    onBlur={() => handleBlur(inputKey, key)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            (e.target as HTMLInputElement).blur();
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="input input-sm input-ghost w-full focus:bg-base-100 font-mono text-sm"
                                                    value={localInput.value}
                                                    placeholder="value"
                                                    onInput={(e) => handleValueChange(inputKey, localInput.key, (e.target as HTMLInputElement).value)}
                                                    onBlur={() => handleBlur(inputKey, key)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            (e.target as HTMLInputElement).blur();
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                                                    onClick={() => deleteVariable(envId, key)}
                                                    title="Delete variable"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <button
                        className="btn btn-outline btn-sm gap-2"
                        onClick={() => addVariable(envId)}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Variable
                    </button>
                </>
            )}
        </div>
    );
};

interface EnvironmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    environments: Environment[];
    globalVariables: Record<string, string>;
    activeEnvironmentId: string | number | null;
    onSave: (data: { environments: Environment[]; globalVariables: Record<string, string> }) => void;
}

export default function EnvironmentModal({ isOpen, onClose, environments, globalVariables, activeEnvironmentId, onSave }: EnvironmentModalProps) {
    const [activeTab, setActiveTab] = useState<string>("global");
    const [editingEnvironments, setEditingEnvironments] = useState<Environment[]>([]);
    const [editingGlobalVars, setEditingGlobalVars] = useState<Record<string, string>>({});

    // Initialize editing state when modal opens
    useEffect(() => {
        if (isOpen) {
            setEditingEnvironments(environments.map(env => ({ ...env, variables: { ...(env.variables || {}) } })));
            setEditingGlobalVars({ ...globalVariables });
            setActiveTab(prev => {
                if (prev === "global") return prev;
                if (String(prev).startsWith("env-")) {
                    const id = String(prev).slice(4);
                    if (environments.some(env => String(env.id) === id)) {
                        return prev;
                    }
                }
                return "global";
            });
        }
    }, [isOpen, environments, globalVariables]);

    const handleSave = () => {
        onSave({
            environments: editingEnvironments,
            globalVariables: editingGlobalVars
        });
        onClose();
    };

    const addVariable = (envId: string | number | null = null) => {
        if (envId === null) {
            // Adding to global variables
            setEditingGlobalVars({ ...editingGlobalVars, "": "" });
        } else {
            // Adding to specific environment
            setEditingEnvironments(prev =>
                prev.map(env =>
                    env.id === envId
                        ? { ...env, variables: { ...(env.variables || {}), "": "" } }
                        : env
                )
            );
        }
    };

    const updateVariable = (envId: string | number | null, oldKey: string, newKey: string, value: string) => {
        if (envId === null) {
            // Updating global variable
            const newGlobals = { ...editingGlobalVars };
            if (oldKey !== newKey && oldKey in newGlobals) {
                delete newGlobals[oldKey];
            }
            newGlobals[newKey] = value;
            setEditingGlobalVars(newGlobals);
        } else {
            // Updating environment variable
            setEditingEnvironments(prev =>
                prev.map(env =>
                    env.id === envId
                        ? {
                            ...env,
                            variables: (() => {
                                const newVars = { ...(env.variables || {}) };
                                if (oldKey !== newKey && oldKey in newVars) {
                                    delete newVars[oldKey];
                                }
                                newVars[newKey] = value;
                                return newVars;
                            })()
                        }
                        : env
                )
            );
        }
    };

    const deleteVariable = (envId: string | number | null, key: string) => {
        if (envId === null) {
            // Deleting from global variables
            const newGlobals = { ...editingGlobalVars };
            delete newGlobals[key];
            setEditingGlobalVars(newGlobals);
        } else {
            // Deleting from environment
            setEditingEnvironments(prev =>
                prev.map(env =>
                    env.id === envId
                        ? {
                            ...env, variables: (() => {
                                const newVars = { ...(env.variables || {}) };
                                delete newVars[key];
                                return newVars;
                            })()
                        }
                        : env
                )
            );
        }
    };

    const updateEnvironmentField = (envId: string | number, field: keyof Environment, value: string) => {
        setEditingEnvironments(prev =>
            prev.map(env =>
                env.id === envId ? { ...env, [field]: value } : env
            )
        );
    };

    const addEnvironment = () => {
        const newEnv: Environment = {
            id: `new-${Date.now()}`,
            name: "New Environment",
            baseUrl: "",
            variables: {}
        };
        setEditingEnvironments([...editingEnvironments, newEnv]);
        setActiveTab(`env-${newEnv.id}`);
    };

    const deleteEnvironment = (envId: string | number) => {
        setEditingEnvironments(prev => prev.filter(env => env.id !== envId));
        setActiveTab("global");
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-5xl w-full">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Manage Environments</h2>
                        <p className="text-sm opacity-70 mt-1">Configure environment variables and base URLs</p>
                    </div>
                    <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="md:col-span-2">
                        <div className="border border-base-300 rounded-xl bg-base-100 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-base-300 bg-base-200/40">
                                <div className="text-xs font-bold uppercase tracking-widest opacity-60">
                                    Environments
                                </div>
                                <button
                                    className="btn btn-outline btn-xs gap-2"
                                    onClick={addEnvironment}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add
                                </button>
                            </div>

                            <div className="max-h-96 overflow-y-auto no-scrollbar">
                                <button
                                    className={`w-full text-left px-4 py-3 border-b border-base-300 transition-colors ${activeTab === "global" ? "bg-primary/10" : "hover:bg-base-200/40"
                                        }`}
                                    onClick={() => setActiveTab("global")}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-2 h-2 rounded-full flex-shrink-0 ${activeTab === "global" ? "bg-primary" : "bg-base-300"
                                                }`}
                                        ></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="truncate font-semibold text-sm">Global</div>
                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                <span className="badge badge-ghost badge-sm opacity-60">Variables</span>
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                {editingEnvironments.length === 0 ? (
                                    <div className="p-6 text-center">
                                        <p className="text-sm opacity-60 mb-4">No environments yet</p>
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={addEnvironment}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add Environment
                                        </button>
                                    </div>
                                ) : (
                                    editingEnvironments.map(env => {
                                        const isActive = env.id === activeEnvironmentId;
                                        const isSelected = activeTab === `env-${env.id}`;
                                        return (
                                            <button
                                                key={env.id}
                                                className={`w-full text-left px-4 py-3 border-b border-base-300 last:border-b-0 transition-colors ${isSelected ? "bg-primary/10" : "hover:bg-base-200/40"
                                                    }`}
                                                onClick={() => setActiveTab(`env-${env.id}`)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-2 h-2 rounded-full flex-shrink-0 ${isSelected ? "bg-primary" : "bg-base-300"
                                                            }`}
                                                    ></div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="truncate font-semibold text-sm">{env.name}</div>
                                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                            {isActive && (
                                                                <span className="badge badge-accent badge-sm">Active</span>
                                                            )}
                                                            {!isActive && (
                                                                <span className="badge badge-ghost badge-sm opacity-60">Environment</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        {activeTab === "global" && (
                            <div className="space-y-4">
                                <div className="bg-base-200/50 border border-base-300 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 mt-0.5 text-info flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-semibold mb-1">Global Variables</p>
                                            <p className="text-xs opacity-70">
                                                Available in all environments with the lowest priority. Environment-specific variables override these.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <VariableTable
                                    variables={editingGlobalVars}
                                    envId={null}
                                    updateVariable={updateVariable}
                                    deleteVariable={deleteVariable}
                                    addVariable={addVariable}
                                />
                            </div>
                        )}

                        {editingEnvironments.map(env => (
                            activeTab === `env-${env.id}` && (
                                <div key={env.id} className="space-y-4">
                                    {/* Environment Settings Card */}
                                    <div className="card border border-base-300 bg-base-100">
                                        <div className="card-body p-4">
                                            <div className="flex items-start gap-4">
                                                {/* Environment Icon */}
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${env.id === activeEnvironmentId
                                                    ? "bg-accent/20 text-accent"
                                                    : "bg-base-200 text-base-content/60"
                                                    }`}>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                    </svg>
                                                </div>

                                                {/* Environment Fields */}
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="label py-1">
                                                            <span className="label-text text-xs font-semibold opacity-70">Environment Name</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="input input-bordered w-full input-sm"
                                                            value={env.name}
                                                            onInput={(e) => updateEnvironmentField(env.id, "name", (e.target as HTMLInputElement).value)}
                                                            placeholder="e.g., Production, Staging"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="label py-1">
                                                            <span className="label-text text-xs font-semibold opacity-70">Base URL</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="input input-bordered w-full input-sm font-mono text-sm"
                                                            value={env.baseUrl}
                                                            placeholder="https://api.example.com"
                                                            onInput={(e) => updateEnvironmentField(env.id, "baseUrl", (e.target as HTMLInputElement).value)}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Delete Button */}
                                                <div className="flex-shrink-0 pt-7">
                                                    <button
                                                        className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                                                        onClick={() => deleteEnvironment(env.id)}
                                                        title="Delete environment"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Variables Section */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="label py-1">
                                                <span className="label-text text-sm font-semibold">Environment Variables</span>
                                            </label>
                                            {env.id === activeEnvironmentId && (
                                                <span className="badge badge-accent badge-sm gap-1.5">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                    Active Environment
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs opacity-70 mb-2">
                                            Variables specific to this environment. These override global variables.
                                        </p>
                                        <VariableTable
                                            variables={env.variables || {}}
                                            envId={env.id}
                                            updateVariable={updateVariable}
                                            deleteVariable={deleteVariable}
                                            addVariable={addVariable}
                                        />
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>

                <div className="modal-action mt-6">
                    <button className="btn btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
