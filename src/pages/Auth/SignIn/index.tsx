import { useState } from "preact/hooks";
import { useLocation } from "preact-iso";

import Layout from "../../../components/Layout";
import DarkModeToggle from "../../../components/DarkModeToggle";
import AuthLinks from "../Links";
import PasswordInput from "../../../components/PasswordInput";
import { useAuth } from "../../../hooks/useAuth";

import { validateEmail, validateRequired } from "../../../utils/validation";

export default function SignIn() {
  const location = useLocation();
  const { login } = useAuth();

  let urlParams: URLSearchParams | undefined;

  if (typeof window !== "undefined") {
    urlParams = new URLSearchParams(window.location.search);
  }

  const nextParam = urlParams?.get("next");
  const invitedEmail = urlParams?.get("email") || "";
  const emailLocked = urlParams?.get("emailLocked") === "1";
  const workspaceName = urlParams?.get("workspaceName") || "";
  const invitedByName = urlParams?.get("invitedByName") || "";
  const invitedByEmail = urlParams?.get("invitedByEmail") || "";
  const isConfirmedFlow = urlParams?.get("confirmed") === "1";
  const isPasswordResetFlow = urlParams?.get("passwordReset") === "1";

  const [formData, setFormData] = useState({
    email: invitedEmail,
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Frontend validation
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!validateRequired(formData.password)) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);

    setLoading(false);

    if (result.success) {
      if (nextParam) {
        let target = nextParam;
        if (result.isFirstLogin) {
          target += nextParam.includes("?") ? "&" : "?";
          target += "firstLogin=1";
        }

        location.route(target);
        return;
      }

      // No invitation flow; send first-time users to appearance selection.
      if (result.isFirstLogin) {
        location.route("/settings?tab=theme");
        return;
      }

      location.route("/");
    } else {
      setError(result.error || "Failed to sign in");
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
              Sign In
            </h2>
            <p className="text-center text-base-content opacity-70 mb-8">
              Sign in with your credentials
            </p>

            {isConfirmedFlow && (
              <div className="alert alert-success mb-6">
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
                <span>Email confirmed successfully. You can now log in.</span>
              </div>
            )}

            {isPasswordResetFlow && (
              <div className="alert alert-success mb-6">
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
                <span>Password reset successfully. You can now log in.</span>
              </div>
            )}

            {(workspaceName || invitedByName || invitedByEmail) && (
              <div className="rounded-lg border border-base-300 bg-base-200/30 p-4 text-sm mb-6 space-y-2 text-base-content">
                {workspaceName && (
                  <div>
                    <span className="font-semibold">Workspace:</span>{" "}
                    {workspaceName}
                  </div>
                )}
                {(invitedByName || invitedByEmail) && (
                  <div>
                    <span className="font-semibold">Invited by:</span>{" "}
                    {invitedByName || invitedByEmail}
                    {invitedByName && invitedByEmail && (
                      <span className="opacity-70"> ({invitedByEmail})</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="alert alert-error mb-6">
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
                <span className="text-sm">
                  {error}
                  {error.toString().includes("confirm your email") && (
                    <div className="mt-2 text-xs">
                      <a
                        href="/resend-confirmation"
                        className="link link-hover"
                      >
                        Resend confirmation email?
                      </a>
                    </div>
                  )}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="label py-1">
                  <span className="label-text font-semibold text-base-content/70">
                    Email
                  </span>
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
                  <span className="label-text font-semibold text-base-content/70">
                    Password
                  </span>
                </label>
                <PasswordInput
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={loading}
                  required
                  minLength={1}
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
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <AuthLinks linkToSkip="sign-in" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
