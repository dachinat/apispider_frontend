import { useState, useEffect } from "preact/hooks";

interface URLEncodedTableProps {
    urlEncodedData?: Record<string, string>;
    onChange?: (data: Record<string, string>) => void;
}

interface Row {
    id: string;
    key: string;
    value: string;
    enabled: boolean;
}

export default function URLEncodedTable({ urlEncodedData = {}, onChange }: URLEncodedTableProps) {
    const [mode, setMode] = useState<"table" | "bulk">("table");
    const [rows, setRows] = useState<Row[]>([]);
    const [bulkText, setBulkText] = useState("");

    const urlEncodedToBulkText = (dataObj: Record<string, string>) => {
        return Object.entries(dataObj).map(([key, value]) => `${key}:${value}`).join("\n");
    };

    const bulkTextToURLEncoded = (text: string) => {
        if (!text.trim()) return {};
        const data: Record<string, string> = {};
        text.split("\n").forEach((line) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;
            const colonIndex = trimmedLine.indexOf(":");
            if (colonIndex === -1) return;
            const key = trimmedLine.substring(0, colonIndex).trim();
            const value = trimmedLine.substring(colonIndex + 1).trim();
            if (key) data[key] = value;
        });
        return data;
    };

    useEffect(() => {
        const isCurrentRowsEmpty = rows.length === 0 || (rows.length === 1 && rows[0].key === "" && rows[0].value === "");
        const hasDataInProps = Object.keys(urlEncodedData).length > 0;

        if (isCurrentRowsEmpty && hasDataInProps) {
            const dataRows = Object.entries(urlEncodedData).map(([key, value], index) => ({
                id: `urlencoded-${key}-${index}`,
                key,
                value,
                enabled: true,
            }));
            setRows([...dataRows, { id: "new", key: "", value: "", enabled: true }]);
            setBulkText(urlEncodedToBulkText(urlEncodedData));
        } else if (rows.length === 0) {
            setRows([{ id: "new", key: "", value: "", enabled: true }]);
            setBulkText("");
        }
    }, [urlEncodedData]);

    const notifyChange = (updatedRows: Row[]) => {
        const validData = updatedRows
            .filter((row) => row.key.trim() && row.enabled)
            .reduce((acc, row) => {
                acc[row.key] = row.value;
                return acc;
            }, {} as Record<string, string>);
        onChange?.(validData);
    };

    const handleRowChange = (id: string, field: keyof Row, value: any) => {
        const updatedRows = rows.map((row) => (row.id === id ? { ...row, [field]: value } : row));
        const updatedRow = updatedRows.find((row) => row.id === id);
        const isLastRow = rows[rows.length - 1].id === id;

        if (isLastRow && updatedRow && (updatedRow.key || updatedRow.value)) {
            updatedRows.push({ id: `urlencoded-${Date.now()}`, key: "", value: "", enabled: true });
        }

        setRows(updatedRows);
        notifyChange(updatedRows);
    };

    const handleDelete = (id: string) => {
        if (rows.length === 1) {
            setRows([{ id: "0", key: "", value: "", enabled: true }]);
            onChange?.({});
            return;
        }
        const updatedRows = rows.filter((row) => row.id !== id);
        if (!updatedRows.some((row) => !row.key && !row.value)) {
            updatedRows.push({ id: `urlencoded-${Date.now()}`, key: "", value: "", enabled: true });
        }
        setRows(updatedRows);
        notifyChange(updatedRows);
    };

    const switchMode = (newMode: "table" | "bulk") => {
        if (newMode === "bulk") {
            const currentData = rows.filter((r) => r.key.trim() && r.enabled).reduce((acc, r) => ({ ...acc, [r.key]: r.value }), {});
            setBulkText(urlEncodedToBulkText(currentData));
        } else {
            const newData = bulkTextToURLEncoded(bulkText);
            const dataRows = Object.entries(newData).map(([key, value], index) => ({ id: `urlencoded-${index}`, key, value, enabled: true }));
            setRows([...dataRows, { id: "new", key: "", value: "", enabled: true }]);
            onChange?.(newData);
        }
        setMode(newMode);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 p-2 border-b border-base-300">
                <div className="join">
                    <button className={`btn btn-xs join-item ${mode === "table" ? "btn-active" : ""}`} onClick={() => switchMode("table")}>Table</button>
                    <button className={`btn btn-xs join-item ${mode === "bulk" ? "btn-active" : ""}`} onClick={() => switchMode("bulk")}>Bulk</button>
                </div>
            </div>
            {mode === "table" ? (
                <div className="overflow-x-auto">
                    <table className="table table-sm w-full">
                        <thead>
                            <tr><th className="w-8" /><th>Key</th><th>Value</th><th className="w-8" /></tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr key={row.id} className={!row.enabled ? "opacity-50" : ""}>
                                    <td><input type="checkbox" className="checkbox checkbox-xs" checked={row.enabled} onChange={() => handleRowChange(row.id, "enabled", !row.enabled)} /></td>
                                    <td><input type="text" className="input input-xs input-bordered w-full" value={row.key} onInput={(e) => handleRowChange(row.id, "key", (e.target as HTMLInputElement).value)} /></td>
                                    <td><input type="text" className="input input-xs input-bordered w-full" value={row.value} onInput={(e) => handleRowChange(row.id, "value", (e.target as HTMLInputElement).value)} /></td>
                                    <td><button className="btn btn-ghost btn-xs" onClick={() => handleDelete(row.id)}>×</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-2 flex-1">
                    <textarea className="textarea textarea-bordered w-full h-[400px] font-mono text-xs" value={bulkText} onInput={(e) => {
                        const val = (e.target as HTMLTextAreaElement).value;
                        setBulkText(val);
                        onChange?.(bulkTextToURLEncoded(val));
                    }} />
                </div>
            )}
        </div>
    );
}
