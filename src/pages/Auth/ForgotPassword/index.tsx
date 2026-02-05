import { useState } from "preact/hooks";

import Layout from "../../../components/Layout";
import DarkModeToggle from "../../../components/DarkModeToggle";
import AuthLinks from "../Links";

import { useAuth } from "../../../hooks/useAuth";
import { validateEmail } from "../../../utils/validation";

export default function ForgotPassword() {
    const { forgotPassword } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
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

        if (!validateEmail(formData.email)) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        const result = await forgotPassword(formData.email);
        setLoading(false);

        if (result.success) {
            setSuccess(
                result.data?.message ||
                "If an account exists for this email, you will receive reset instructions.",
            );
        } else {
            setError(result.error || "Failed to send reset instructions");
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
                            Forgot a Password?
                        </h2>
                        <p className="text-center text-base-content opacity-70 mb-8">
                            Reset a password with your email
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
                                <label htmlFor="email" className="label py-1">
                                    <span className="label-text font-semibold text-base-content/70">Email</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input input-bordered w-full focus:input-primary transition-all duration-200"
                                    placeholder="your@email.com"
                                    required
                                    disabled={loading}
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
                                        Sending...
                                    </>
                                ) : (
                                    "Reset password"
                                )}
                            </button>
                        </form>

                        <AuthLinks linkToSkip="forgot-password" />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
