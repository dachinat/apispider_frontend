import { useState, useEffect, useRef } from "preact/hooks";

const COMMON_HEADERS = [
    "Accept", "Accept-Charset", "Accept-Encoding", "Accept-Language", "Authorization",
    "Cache-Control", "Connection", "Content-Encoding", "Content-Length", "Content-Type",
    "Cookie", "Date", "Host", "Origin", "Pragma", "Referer", "User-Agent", "X-Request-Id"
];

interface HeadersTableProps {
    headers?: Record<string, string>;
    onChange?: (headers: Record<string, string>) => void;
}

interface Row {
    id: string;
    key: string;
    value: string;
    enabled: boolean;
}

export default function HeadersTable({ headers = {}, onChange }: HeadersTableProps) {
    const [mode, setMode] = useState<"table" | "bulk">("table");
    const [rows, setRows] = useState<Row[]>([]);
    const [bulkText, setBulkText] = useState("");
    const [activeRowId, setActiveRowId] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const dropdownMouseDownRef = useRef(false);
    const activeInputRef = useRef<HTMLInputElement>(null);

    const headersToBulkText = (h: Record<string, string>) => Object.entries(h).map(([k, v]) => `${k}:${v}`).join("\n");
    const bulkTextToHeaders = (t: string) => {
        const res: Record<string, string> = {};
        t.split("\n").forEach(l => {
            const parts = l.split(":");
            if (parts.length >= 2) res[parts[0].trim()] = parts.slice(1).join(":").trim();
        });
        return res;
    };

    useEffect(() => {
        const isCurrentRowsEmpty = rows.length === 0 || (rows.length === 1 && rows[0].key === "" && rows[0].value === "");
        const hasHeadersInProps = Object.keys(headers).length > 0;

        if (isCurrentRowsEmpty && hasHeadersInProps) {
            const hrs = Object.entries(headers).map(([k, v], i) => ({ id: `h-${i}`, key: k, value: v, enabled: true }));
            setRows([...hrs, { id: "new", key: "", value: "", enabled: true }]);
            setBulkText(headersToBulkText(headers));
        } else if (rows.length === 0) {
            setRows([{ id: "new", key: "", value: "", enabled: true }]);
            setBulkText("");
        }
    }, [headers]);

    useEffect(() => {
        const update = () => {
            if (activeInputRef.current) {
                const r = activeInputRef.current.getBoundingClientRect();
                setDropdownPosition({ top: r.bottom, left: r.left, width: r.width });
            }
        };
        if (activeRowId) {
            window.addEventListener('scroll', update, true);
            window.addEventListener('resize', update);
            return () => {
                window.removeEventListener('scroll', update, true);
                window.removeEventListener('resize', update);
            };
        }
    }, [activeRowId]);

    const notifyChange = (updatedRows: Row[]) => {
        const valid = updatedRows.filter(r => r.key.trim() && r.enabled).reduce((acc, r) => ({ ...acc, [r.key]: r.value }), {});
        onChange?.(valid);
    };

    const handleRowChange = (id: string, field: keyof Row, value: any) => {
        const updatedRows = rows.map(r => r.id === id ? { ...r, [field]: value } : r);
        if (field === "key") {
            setActiveRowId(id);
            const filtered = value.trim() ? COMMON_HEADERS.filter(h => h.toLowerCase().includes(value.toLowerCase())) : [];
            setSuggestions(filtered);
            setSelectedSuggestionIndex(-1);
        }
        const updatedRow = updatedRows.find(r => r.id === id);
        if (rows[rows.length - 1].id === id && updatedRow && (updatedRow.key || updatedRow.value)) {
            updatedRows.push({ id: `h-${Date.now()}`, key: "", value: "", enabled: true });
        }
        setRows(updatedRows);
        notifyChange(updatedRows);
    };

    const selectSuggestion = (s: string, id: string) => {
        const updatedRows = rows.map(r => r.id === id ? { ...r, key: s } : r);
        setRows(updatedRows);
        setSuggestions([]);
        setActiveRowId(null);
        notifyChange(updatedRows);
    };

    return (
        <>
            {suggestions.length > 0 && activeRowId && (
                <div className="fixed bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-48 overflow-y-auto z-[9999]" style={{ top: dropdownPosition.top, left: dropdownPosition.left, width: dropdownPosition.width }}>
                    {suggestions.map((s, i) => (
                        <div key={s} className={`px-3 py-1.5 cursor-pointer hover:bg-base-200 text-xs ${i === selectedSuggestionIndex ? "bg-base-200" : ""}`} onClick={() => selectSuggestion(s, activeRowId)} onMouseDown={e => e.preventDefault()}>
                            {s}
                        </div>
                    ))}
                </div>
            )}
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 p-2 border-b border-base-300">
                    <div className="join">
                        <button className={`btn btn-xs join-item ${mode === "table" ? "btn-active" : ""}`} onClick={() => setMode("table")}>Table</button>
                        <button className={`btn btn-xs join-item ${mode === "bulk" ? "btn-active" : ""}`} onClick={() => setMode("bulk")}>Bulk</button>
                    </div>
                </div>
                {mode === "table" ? (
                    <div className="overflow-x-auto">
                        <table className="table table-sm w-full">
                            <thead><tr><th className="w-8" /><th>Key</th><th>Value</th><th className="w-8" /></tr></thead>
                            <tbody>
                                {rows.map(r => (
                                    <tr key={r.id} className={!r.enabled ? "opacity-50" : ""}>
                                        <td><input type="checkbox" className="checkbox checkbox-xs" checked={r.enabled} onChange={() => handleRowChange(r.id, "enabled", !r.enabled)} /></td>
                                        <td><input ref={activeRowId === r.id ? activeInputRef : null} type="text" className="input input-xs input-bordered w-full" value={r.key} onFocus={e => setActiveRowId(r.id)} onInput={e => handleRowChange(r.id, "key", (e.target as HTMLInputElement).value)} onBlur={() => setTimeout(() => !dropdownMouseDownRef.current && setActiveRowId(null), 150)} /></td>
                                        <td><input type="text" className="input input-xs input-bordered w-full" value={r.value} onInput={e => handleRowChange(r.id, "value", (e.target as HTMLInputElement).value)} /></td>
                                        <td><button className="btn btn-ghost btn-xs" onClick={() => {
                                            const updated = rows.filter(row => row.id !== r.id);
                                            if (updated.length === 0) updated.push({ id: "0", key: "", value: "", enabled: true });
                                            setRows(updated);
                                            notifyChange(updated);
                                        }}>×</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-2 flex-1"><textarea className="textarea textarea-bordered w-full h-[400px] font-mono text-xs" value={bulkText} onInput={e => {
                        const v = (e.target as HTMLTextAreaElement).value;
                        setBulkText(v);
                        onChange?.(bulkTextToHeaders(v));
                    }} /></div>
                )}
            </div>
        </>
    );
}
