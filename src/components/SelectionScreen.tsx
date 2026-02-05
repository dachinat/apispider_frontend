import { JSX } from "preact";

interface SelectionScreenProps {
    onSelect: (type: string) => void;
}

export default function SelectionScreen({ onSelect }: SelectionScreenProps) {
    const requestTypes = [
        {
            id: "http",
            name: "HTTP Request",
            description: "Create REST API requests with full control over headers, parameters, and body",
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            color: "primary",
            available: true,
        },
        {
            id: "websocket",
            name: "WebSocket",
            description: "Establish real-time bidirectional connections for live data streams",
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            color: "primary",
            available: true,
        },
        {
            id: "socketio",
            name: "Socket.IO",
            description: "Real-time event-based communication with automatic reconnection and fallback support",
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
            ),
            color: "primary",
            available: true,
        },
        {
            id: "graphql",
            name: "GraphQL",
            description: "Query and mutate data using GraphQL with variables support",
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
            ),
            color: "primary",
            available: true,
        },
    ];

    return (
        <div className="h-full overflow-y-auto flex items-start justify-center px-4 sm:px-8 pb-4 sm:pb-8 pt-0 relative">
            <div className="max-w-4xl w-full my-auto">
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">Create New Request</h2>
                    <p className="text-sm sm:text-base text-base-content/60">Choose the type of request you want to create</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {requestTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => type.available && onSelect(type.id)}
                            disabled={!type.available}
                            className={`card bg-base-200 hover:bg-base-300 transition-all cursor-pointer border-2 border-transparent hover:border-${type.color} ${!type.available ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                                }`}
                        >
                            <div className="card-body items-center text-center gap-4">
                                <div className={`text-${type.color}`}>{type.icon}</div>
                                <div>
                                    <h3 className="card-title text-lg justify-center">
                                        {type.name}
                                        {!type.available && <span className="badge badge-sm badge-ghost">Coming Soon</span>}
                                    </h3>
                                    <p className="text-sm text-base-content/70 mt-2">{type.description}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
