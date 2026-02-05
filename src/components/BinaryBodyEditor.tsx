import { useRef } from "preact/hooks";

interface BinaryBodyEditorProps {
    file: File | null | undefined;
    onChange: (file: File | null) => void;
}

export default function BinaryBodyEditor({ file, onChange }: BinaryBodyEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const selectedFile = target.files?.[0] || null;
        onChange(selectedFile);
    };

    const removeFile = () => {
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 border-2 border-dashed border-base-300 rounded-xl bg-base-100/50">
            {file ? (
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-bold text-lg truncate max-w-xs">{file.name}</p>
                        <p className="text-xs opacity-50 mt-1">
                            {(file.size / 1024).toFixed(2)} KB • {file.type || "application/octet-stream"}
                        </p>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Change File
                        </button>
                        <button
                            className="btn btn-ghost btn-sm text-error"
                            onClick={removeFile}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center text-base-content/30">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-bold">Select a file to send as binary body</p>
                        <p className="text-xs opacity-50 mt-1">Your file will be sent as application/octet-stream</p>
                    </div>
                    <button
                        className="btn btn-outline btn-primary mt-2"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Select File
                    </button>
                </div>
            )}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}
