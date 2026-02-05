import { useLocation } from "preact-iso";

interface BackToAppBtnProps {
    forceText?: string | null;
}

export default function BackToAppBtn({ forceText = null }: BackToAppBtnProps) {
    const location = useLocation();

    return (
        <button
            onClick={() => {
                location.route("/");
            }}
            className="btn btn-sm btn-primary h-8 min-h-0 px-4 font-bold"
        >
            {forceText || "Back to Application"}
        </button>
    );
}
