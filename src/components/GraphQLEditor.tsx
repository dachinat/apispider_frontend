import { useState, useRef, useEffect } from "preact/hooks";
import { memo } from "preact/compat";
import CodeMirrorEditor from "./CodeMirrorEditor";

interface GraphQLEditorProps {
    tabId: string | number;
    query: string;
    variables: string;
    onQueryChange: (value: string) => void;
    onVariablesChange: (value: string) => void;
}

function GraphQLEditor({ tabId, query, variables, onQueryChange, onVariablesChange }: GraphQLEditorProps) {
    const [leftWidth, setLeftWidth] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const percentage = (offsetX / rect.width) * 100;
            const clampedPercentage = Math.max(20, Math.min(80, percentage));
            setLeftWidth(clampedPercentage);
        };

        const handleMouseUp = () => setIsDragging(false);

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div ref={containerRef} className="flex h-full gap-0" style={{ userSelect: isDragging ? "none" : "auto" }}>
            <div className="flex flex-col border border-base-300 rounded-lg overflow-hidden bg-base-100" style={{ width: `${leftWidth}%` }}>
                <div className="flex items-center px-3 py-2 bg-base-200 border-b border-base-300">
                    <span className="text-sm font-semibold">Query</span>
                </div>
                <div className="flex-1 min-h-0">
                    <CodeMirrorEditor
                        key={`gql-query-${tabId}`}
                        value={query}
                        onChange={onQueryChange}
                        language="javascript"
                        placeholder="query {\n  # Your GraphQL query here\n}"
                    />
                </div>
            </div>

            <div
                className={`flex items-center justify-center px-1 cursor-col-resize hover:bg-primary/10 transition-colors ${isDragging ? "bg-primary/20" : ""}`}
                onMouseDown={handleMouseDown as any}
            >
                <div className="w-1 h-12 rounded-full bg-base-content/20" />
            </div>

            <div className="flex flex-col border border-base-300 rounded-lg overflow-hidden bg-base-100" style={{ width: `${100 - leftWidth}%` }}>
                <div className="flex items-center gap-2 px-3 py-2 bg-base-200 border-b border-base-300">
                    <span className="text-sm font-semibold">Variables</span>
                    <span className="text-xs text-base-content/60">(JSON)</span>
                </div>
                <div className="flex-1 min-h-0">
                    <CodeMirrorEditor
                        key={`gql-vars-${tabId}`}
                        value={variables}
                        onChange={onVariablesChange}
                        language="json"
                        placeholder="{\n  // Variables for your query\n}"
                    />
                </div>
            </div>
        </div>
    );
}

export default memo(GraphQLEditor, (prevProps, nextProps) => {
    return (
        prevProps.tabId === nextProps.tabId &&
        prevProps.query === nextProps.query &&
        prevProps.variables === nextProps.variables
    );
});
