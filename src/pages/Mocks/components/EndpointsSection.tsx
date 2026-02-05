import { Endpoint, MockConfig } from "../types";
import EndpointCard from "./EndpointCard";

interface EndpointsSectionProps {
    endpoints: Endpoint[];
    mockConfig: MockConfig | null;
    onAdd: () => void;
    onRemove: (index: number) => void;
    onChange: (index: number, field: keyof Endpoint, value: any) => void;
}

export default function EndpointsSection({
    endpoints,
    mockConfig,
    onAdd,
    onRemove,
    onChange,
}: EndpointsSectionProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold tracking-tight">Endpoints</h3>
                        <p className="text-xs text-base-content/50 font-bold uppercase tracking-wider">
                            Configured Responses
                        </p>
                    </div>
                </div>
                <button
                    onClick={onAdd}
                    className="btn btn-primary btn-sm h-10 px-4 rounded-lg font-bold gap-2 shadow-sm"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Add Endpoint
                </button>
            </div>

            <div className="space-y-6">
                {endpoints.map((ep, idx) => (
                    <EndpointCard
                        key={idx}
                        endpoint={ep}
                        index={idx}
                        mockConfig={mockConfig}
                        isOnly={endpoints.length === 1}
                        onRemove={onRemove}
                        onChange={onChange}
                    />
                ))}
            </div>

            {endpoints.length === 0 && (
                <div className="p-16 text-center bg-base-100 rounded-xl border-2 border-dashed border-base-300">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-8 h-8 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">No endpoints defined</h3>
                    <p className="text-base-content/50 font-medium mb-8">
                        Start by adding your first endpoint response.
                    </p>
                    <button
                        onClick={onAdd}
                        className="btn btn-primary px-8 rounded-lg font-bold"
                    >
                        Add your first endpoint
                    </button>
                </div>
            )}
        </div>
    );
}
