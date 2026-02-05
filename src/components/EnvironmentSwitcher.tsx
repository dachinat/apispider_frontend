import { useEnvironment } from "../context/EnvironmentContext";

interface EnvironmentSwitcherProps {
    onManageClick: () => void;
}

export default function EnvironmentSwitcher({ onManageClick }: EnvironmentSwitcherProps) {
    const { environments, activeEnvironmentId, setActiveEnvironmentId, getActiveEnvironment } = useEnvironment();
    const activeEnv = getActiveEnvironment();

    return (
        <div className="mb-4">
            <div className="dropdown dropdown-bottom w-full">
                <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost w-full justify-between h-auto py-2 px-4 border border-base-300 hover:border-primary/50 bg-base-100/50 hover:bg-base-200"
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${activeEnv ? "bg-accent/10 text-accent" : "bg-base-300 text-base-content/40"}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2 2 2 0 012 2v.657M7 20h11a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="flex flex-col items-start overflow-hidden">
                            <span className="text-[10px] opacity-60 uppercase font-bold tracking-wider">Environment</span>
                            <span className="truncate font-semibold text-sm max-w-[140px]">{activeEnv?.name || "No Environment"}</span>
                        </div>
                    </div>
                    <svg className="w-4 h-4 opacity-50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4 4 4-4" />
                    </svg>
                </div>
                <ul tabIndex={0} className="dropdown-content z-[20] menu p-2 shadow-2xl bg-base-100 rounded-xl w-full mt-2 border border-base-300">
                    <div className="px-3 py-2 text-[10px] font-bold text-base-content/40 uppercase tracking-widest">Switch Environment</div>
                    <div className="max-h-60 overflow-y-auto no-scrollbar px-1">
                        <li>
                            <button className={`flex items-center gap-3 py-3 px-3 rounded-lg ${!activeEnv ? "bg-base-200 font-bold" : ""}`} onClick={() => setActiveEnvironmentId(null)}>
                                <div className={`w-1.5 h-1.5 rounded-full ${!activeEnv ? "bg-base-content" : "bg-base-300"}`} />
                                <span className="flex-1 text-sm italic">No Environment</span>
                            </button>
                        </li>
                        {environments.map((env) => (
                            <li key={env.id}>
                                <button className={`flex items-center gap-3 py-3 px-3 rounded-lg ${activeEnvironmentId === env.id ? "bg-accent/10 text-accent font-bold" : ""}`} onClick={() => setActiveEnvironmentId(env.id)}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${activeEnvironmentId === env.id ? "bg-accent" : "bg-base-300"}`} />
                                    <span className="flex-1 text-sm">{env.name}</span>
                                </button>
                            </li>
                        ))}
                    </div>
                    <div className="divider my-1 opacity-50" />
                    <li>
                        <button className="flex items-center gap-3 py-3 px-3 hover:bg-base-200 text-sm font-semibold rounded-lg" onClick={onManageClick}>
                            Manage Environments...
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
