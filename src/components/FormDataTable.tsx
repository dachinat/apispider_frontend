import { useState, useEffect } from "preact/hooks";

interface FormDataItem {
    key: string;
    value: string;
    type: "text" | "file";
    fileName?: string;
    file?: File | null;
}

interface FormDataRow extends FormDataItem {
    id: string;
    enabled: boolean;
}

interface FormDataTableProps {
    formData?: FormDataItem[];
    onChange?: (data: FormDataItem[]) => void;
}

export default function FormDataTable({ formData = [], onChange }: FormDataTableProps) {
    const [rows, setRows] = useState<FormDataRow[]>([]);

    useEffect(() => {
        const isCurrentRowsEmpty = rows.length === 0 || (rows.length === 1 && rows[0].key === "" && rows[0].value === "" && rows[0].type === "text");
        const hasDataInProps = formData && Array.isArray(formData) && formData.length > 0;

        if (isCurrentRowsEmpty && hasDataInProps) {
            const formDataRows = formData.map((item, index) => ({
                id: `formdata-${item.key}-${index}`,
                key: item.key || "",
                value: item.value || "",
                type: item.type || "text",
                fileName: item.fileName || "",
                file: item.file || null,
                enabled: true,
            }));
            setRows([
                ...formDataRows,
                { id: `formdata-new`, key: "", value: "", type: "text", enabled: true },
            ] as FormDataRow[]);
        } else if (rows.length === 0) {
            setRows([
                { id: `formdata-0`, key: "", value: "", type: "text", enabled: true },
            ]);
        }
    }, [formData]);

    const notifyChange = (updatedRows: FormDataRow[]) => {
        const validFormData = updatedRows
            .filter((row) => row.key.trim() && row.enabled)
            .map((row) => ({
                key: row.key,
                value: row.value,
                type: row.type,
                fileName: row.fileName,
                file: row.file,
            }));
        onChange?.(validFormData);
    };

    const handleRowChange = (id: string, field: keyof FormDataRow, value: any) => {
        const updatedRows = rows.map((row) =>
            row.id === id ? { ...row, [field]: value } : row
        );

        const updatedRow = updatedRows.find((row) => row.id === id);
        const isLastRow = rows[rows.length - 1].id === id;

        if (isLastRow && updatedRow && (updatedRow.key || updatedRow.value)) {
            updatedRows.push({
                id: `formdata-${Date.now()}`,
                key: "",
                value: "",
                type: "text",
                enabled: true,
            });
        }

        setRows(updatedRows);
        notifyChange(updatedRows);
    };

    const handleFileChange = (id: string, file: File | null) => {
        const updatedRows = rows.map((row) =>
            row.id === id
                ? {
                    ...row,
                    type: "file" as const,
                    file: file,
                    fileName: file ? file.name : "",
                    value: "",
                }
                : row
        );

        const isLastRow = rows[rows.length - 1].id === id;
        if (isLastRow && file) {
            updatedRows.push({
                id: `formdata-${Date.now()}`,
                key: "",
                value: "",
                type: "text",
                enabled: true,
            });
        }

        setRows(updatedRows);
        notifyChange(updatedRows);
    };

    const handleDelete = (id: string) => {
        if (rows.length === 1) {
            const reset = [{ id: `formdata-0`, key: "", value: "", type: "text" as const, enabled: true }];
            setRows(reset);
            onChange?.([]);
            return;
        }

        const updatedRows = rows.filter((row) => row.id !== id);
        if (!updatedRows.some((row) => !row.key && !row.value)) {
            updatedRows.push({
                id: `formdata-${Date.now()}`,
                key: "",
                value: "",
                type: "text",
                enabled: true,
            });
        }

        setRows(updatedRows);
        notifyChange(updatedRows);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-x-auto">
                <table className="table table-sm w-full">
                    <thead>
                        <tr>
                            <th className="w-8" />
                            <th className="w-1/4">Key</th>
                            <th className="w-1/6">Type</th>
                            <th className="w-1/2">Value</th>
                            <th className="w-8" />
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.id} className={`hover ${!row.enabled ? "opacity-50" : ""}`}>
                                <td>
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-xs"
                                        checked={row.enabled}
                                        onChange={() => handleRowChange(row.id, "enabled", !row.enabled)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="input input-xs input-bordered w-full"
                                        placeholder="Key"
                                        value={row.key}
                                        onInput={(e) => handleRowChange(row.id, "key", (e.target as HTMLInputElement).value)}
                                        disabled={!row.enabled}
                                    />
                                </td>
                                <td>
                                    <select
                                        className="select select-xs select-bordered w-full"
                                        value={row.type}
                                        onChange={(e) => handleRowChange(row.id, "type", (e.target as HTMLSelectElement).value)}
                                        disabled={!row.enabled}
                                    >
                                        <option value="text">Text</option>
                                        <option value="file">File</option>
                                    </select>
                                </td>
                                <td>
                                    {row.type === "text" ? (
                                        <input
                                            type="text"
                                            className="input input-xs input-bordered w-full"
                                            placeholder="Value"
                                            value={row.value}
                                            onInput={(e) => handleRowChange(row.id, "value", (e.target as HTMLInputElement).value)}
                                            disabled={!row.enabled}
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="file"
                                                className="file-input file-input-xs file-input-bordered w-full"
                                                onChange={(e) => handleFileChange(row.id, (e.target as HTMLInputElement).files?.[0] || null)}
                                                disabled={!row.enabled}
                                            />
                                            {row.fileName && <span className="text-xs opacity-60 truncate max-w-[100px]">{row.fileName}</span>}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <button className="btn btn-ghost btn-xs btn-square hover:text-error" onClick={() => handleDelete(row.id)}>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
