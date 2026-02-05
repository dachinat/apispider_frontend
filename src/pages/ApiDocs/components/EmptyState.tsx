interface EmptyStateProps {
    onNewDoc: () => void;
}

export default function EmptyState({ onNewDoc }: EmptyStateProps) {
    return (
        <div className="flex-1 flex items-center justify-center bg-base-100">
            <div className="text-center max-w-md p-10 rounded-xl bg-base-100 border border-base-300 shadow-lg relative z-10">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">API Documentation</h3>
                <p className="text-base-content/50 mb-8 leading-relaxed font-medium">Transform your collections into beautiful, shareable API documentation. Publish snapshots for your team in seconds.</p>
                <button
                    onClick={onNewDoc}
                    className="btn btn-primary h-12 px-8 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95"
                >
                    Create New Document
                </button>
            </div>
        </div>
    );
}
