import { useEffect, useRef } from "preact/hooks";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    confirmClass?: string;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm",
    message = "Are you sure?",
    confirmText = "Delete",
    cancelText = "Cancel",
    confirmClass = "btn-error",
}: ConfirmModalProps) {
    const modalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.showModal();
        } else if (!isOpen && modalRef.current) {
            modalRef.current.close();
        }
    }, [isOpen]);

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    const handleDialogClick = (e: MouseEvent) => {
        if (e.target === modalRef.current) {
            onClose();
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <dialog
            ref={modalRef}
            className="modal modal-bottom sm:modal-middle"
            onClick={handleDialogClick as any}
            onKeyDown={handleKeyDown as any}
        >
            <div className="modal-box">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {title}
                </h3>
                <p className="py-4 text-base-content/70">{message}</p>
                <div className="modal-action">
                    <button className="btn btn-ghost" onClick={handleCancel}>
                        {cancelText}
                    </button>
                    <button className={`btn ${confirmClass}`} onClick={handleConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
}
