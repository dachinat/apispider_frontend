import { useState, useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";

import Layout from "../../../components/Layout";
import DarkModeToggle from "../../../components/DarkModeToggle";
import AuthLinks from "../Links";
import { useAuth } from "../../../hooks/useAuth";

export default function ConfirmEmail() {
    const location = useLocation();
    const { confirmEmail } = useAuth();
    const [status, setStatus] = useState<"confirming" | "success" | "error">("confirming");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (!token) {
            setStatus("error");
            setMessage("No confirmation token found in URL.");
            return;
        }

        const doConfirm = async () => {
            const result = await confirmEmail(token);
            if (result.success) {
                setStatus("success");
                setMessage(result.data?.message || "Email confirmed successfully!");

                // Auto redirect after a short delay
                const email = result.data?.email || "";
                const next = new URLSearchParams(window.location.search).get("next");

                setTimeout(() => {
                    let target = `/sign-in?email=${encodeURIComponent(email)}&emailLocked=1&confirmed=1`;
                    if (next) {
                        target += `&next=${encodeURIComponent(next)}`;
                    }
                    location.route(target);
                }, 0);
            } else {
                setStatus("error");
                setMessage(result.error || "Failed to confirm email.");
            }
        };

        doConfirm();
    }, [confirmEmail, location]);

    return (
        <Layout
            buttons={
                <>
                    <DarkModeToggle />
                </>
            }
        >
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
                <div className="w-full max-w-md">
                    <div className="bg-base-100 rounded-lg shadow-lg p-8">
                        <h2 className="text-3xl font-bold text-center mb-8 text-base-content">
                            Email Confirmation
                        </h2>

                        {status === "confirming" && (
                            <div className="flex flex-col items-center space-y-4">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                                <p className="text-base-content opacity-70">Confirming your email...</p>
                            </div>
                        )}

                        {status === "success" && (
                            <div className="space-y-6">
                                <div className="alert alert-success text-sm">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="stroke-current shrink-0 h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>{message}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        const next = new URLSearchParams(window.location.search).get("next");
                                        if (next) {
                                            location.route(`/sign-in?next=${encodeURIComponent(next)}`);
                                            return;
                                        }
                                        location.route("/sign-in");
                                    }}
                                    className="btn btn-primary w-full h-12 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
                                >
                                    Go to Sign In
                                </button>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="space-y-6">
                                <div className="alert alert-error text-sm">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="stroke-current shrink-0 h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>{message}</span>
                                </div>
                                <button
                                    onClick={() => location.route("/resend-confirmation")}
                                    className="btn btn-outline w-full h-12 hover:bg-base-200 transition-all"
                                >
                                    Resend Confirmation Email
                                </button>
                            </div>
                        )}

                        <div className="mt-8">
                            <AuthLinks />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
