import { useState } from "preact/hooks";
import { useLocation } from "preact-iso";

import Layout from "../../../components/Layout";
import DarkModeToggle from "../../../components/DarkModeToggle";
import PasswordInput from "../../../components/PasswordInput";
import { useAuth } from "../../../hooks/useAuth";
import {
    validatePassword,
    validatePasswordMatch,
} from "../../../utils/validation";

export default function ResetPassword() {
    const location = useLocation();
    const { resetPassword } = useAuth();
    const [formData, setFormData] = useState({
        password: "",
        password_confirmation: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (error) setError("");
        if (success) setSuccess("");
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setError("");

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (!token) {
            setError("Reset token is missing from URL");
            return;
        }

        if (!validatePassword(formData.password)) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (
            !validatePasswordMatch(formData.password, formData.password_confirmation)
        ) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        const result = await resetPassword(token, formData.password);
        setLoading(false);

        if (result.success) {
            setSuccess("Password has been reset successfully. You can now log in.");
            const email = result.data?.email || "";
            setTimeout(() => {
                let target = `/sign-in?email=${encodeURIComponent(email)}&emailLocked=1&passwordReset=1`;
                location.route(target);
            }, 0);
        } else {
            setError(result.error || "Failed to reset password");
        }
    };

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
                        <h2 className="text-3xl font-bold text-center mb-2 text-base-content">
                            Password Recovery
                        </h2>
                        <p className="text-center text-base-content opacity-70 mb-8">
                            Set a new password
                        </p>

                        {error && (
                            <div className="alert alert-error mb-6 text-sm">
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="alert alert-success mb-6 text-sm">
                                <span>{success}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="password" className="label py-1">
                                    <span className="label-text font-semibold text-base-content/70">Password</span>
                                </label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a strong password"
                                    required
                                    disabled={loading}
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" className="label py-1">
                                    <span className="label-text font-semibold text-base-content/70">Confirm Password</span>
                                </label>
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    required
                                    disabled={loading}
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full h-12 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Setting password...
                                    </>
                                ) : (
                                    "Set password"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
