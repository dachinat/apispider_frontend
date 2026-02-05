interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    shareUrl: string;
}

export default function ShareModal({ isOpen, onClose, shareUrl }: ShareModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal modal-open z-[99999]">
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-lg mb-4">Share Request</h3>
                <p className="text-sm text-base-content/70 mb-4">
                    Copy the link below to share this request. Anyone with the link
                    can open it in APISpider.
                </p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="input input-bordered flex-1 font-mono text-xs"
                        value={shareUrl}
                        readOnly
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={(event) => {
                            navigator.clipboard.writeText(shareUrl);
                            // Show a brief feedback
                            const btn = event.currentTarget as HTMLButtonElement;
                            const originalText = btn.textContent;
                            btn.textContent = "Copied!";
                            setTimeout(() => {
                                btn.textContent = originalText;
                            }, 1500);
                        }}
                    >
                        Copy
                    </button>
                </div>
                <div className="modal-action">
                    <button
                        className="btn btn-ghost"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
            <div
                className="modal-backdrop bg-black/50"
                onClick={onClose}
            ></div>
        </div>
    );
}
