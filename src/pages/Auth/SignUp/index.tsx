import { useState } from "preact/hooks";
import { useLocation } from "preact-iso";

import Layout from "../../../components/Layout";
import DarkModeToggle from "../../../components/DarkModeToggle";
import AuthLinks from "../Links";
import PasswordInput from "../../../components/PasswordInput";
import { useAuth } from "../../../hooks/useAuth";
import {
    validateEmail,
    validatePassword,
    validatePasswordMatch,
    validateRequired,
} from "../../../utils/validation";

export default function SignUp() {
    const location = useLocation();
    const { signup } = useAuth();

    let urlParams: URLSearchParams | undefined;

    if (typeof window !== "undefined") {
        urlParams = new URLSearchParams(window.location.search);
    }
    const nextParam = urlParams?.get("next");
    const invitedEmail = urlParams?.get("email") || "";
    const emailLocked = urlParams?.get("emailLocked") === "1";

    const [formData, setFormData] = useState({
        name: "",
        email: invitedEmail,
        password: "",
        password_confirmation: "",
        termsAccepted: false,
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: any) => {
        const value =
            e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value,
        });
        // Clear alerts when user starts typing
        if (error) setError("");
        if (success) setSuccess("");
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Frontend validation
        if (!validateRequired(formData.name)) {
            setError("Name is required");
            setLoading(false);
            return;
        }

        if (!validateEmail(formData.email)) {
            setError("Please enter a valid email address");
            setLoading(false);
            return;
        }

        if (!validatePassword(formData.password)) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        if (
            !validatePasswordMatch(formData.password, formData.password_confirmation)
        ) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (!formData.termsAccepted) {
            setError("You must accept the Terms of Service to create an account");
            setLoading(false);
            return;
        }

        const result = await signup(
            formData.name,
            formData.email,
            formData.password,
        );

        setLoading(false);

        if (result.success) {
            if (emailLocked && nextParam) {
                const qs = new URLSearchParams({
                    next: nextParam,
                    email: formData.email,
                    emailLocked: "1",
                });
                location.route(`/sign-in?${qs.toString()}`);
                return;
            }

            setSuccess(
                emailLocked
                    ? "Registration successful! You can now sign in."
                    : "Registration successful! Please check your email to confirm your account.",
            );
            setFormData({
                name: "",
                email: emailLocked ? formData.email : "",
                password: "",
                password_confirmation: "",
                termsAccepted: false,
            });
        } else {
            setError(result.error || "Failed to sign up");
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
                        <h2 className="text-3xl font-bold text-center mb-2 text-base-content">Sign Up</h2>
                        <p className="text-center text-base-content opacity-70 mb-8">
                            Create your account to get started
                        </p>

                        {error && (
                            <div className="alert alert-error mb-6 text-sm">
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
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="alert alert-success mb-6 text-sm">
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
                                <span>{success}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="label py-1">
                                    <span className="label-text font-semibold text-base-content/70">Name</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input input-bordered w-full focus:input-primary transition-all duration-200"
                                    placeholder="Enter your full name"
                                    disabled={loading}
                                    required
                                />
                            </div>

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
                                    disabled={loading || emailLocked}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="label py-1">
                                    <span className="label-text font-semibold text-base-content/70">Password</span>
                                </label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    disabled={loading}
                                    required
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
                                    disabled={loading}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="form-control mt-2">
                                <label className="label cursor-pointer justify-start gap-3">
                                    <input
                                        type="checkbox"
                                        name="termsAccepted"
                                        checked={formData.termsAccepted}
                                        onChange={handleChange}
                                        className="checkbox checkbox-primary checkbox-sm rounded"
                                    />
                                    <span className="label-text text-sm">
                                        I agree to the{" "}
                                        <a
                                            href="/terms-of-service"
                                            target="_blank"
                                            className="link link-primary font-medium"
                                        >
                                            Terms of Service
                                        </a>
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full h-12 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all mt-4"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Creating account...
                                    </>
                                ) : (
                                    "Sign Up"
                                )}
                            </button>
                        </form>

                        <AuthLinks linkToSkip="sign-up" />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
