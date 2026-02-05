import { useState } from "preact/hooks";
import { useAuth } from "../../../hooks/useAuth";
import PasswordInput from "../../../components/PasswordInput";

export default function Security() {
    const { updatePassword } = useAuth();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleUpdatePassword = async (e: any) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters");
            return;
        }

        if (currentPassword === newPassword) {
            setError("New password must be different from current");
            return;
        }

        setPasswordLoading(true);
        const result = await updatePassword(currentPassword, newPassword);
        setPasswordLoading(false);

        if (result.success) {
            setSuccess("Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } else {
            setError(
                result.error ||
                "Failed to update password. Please check your current password."
            );
        }
    };

    return (
        <div className="space-y-6">
            {/* Feedback messages */}
            {error && (
                <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-success/10 border border-success/20 text-success rounded-xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {success}
                    <button onClick={() => setSuccess("")} className="btn btn-ghost btn-xs ml-auto">✕</button>
                </div>
            )}

            <div>
                <h3 className="text-lg font-bold text-base-content">Password & Security</h3>
                <p className="text-sm text-base-content/60 mt-1">Update your password to keep your account secure</p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="form-control w-full">
                    <label className="label"><span className="label-text font-medium">Current Password</span></label>
                    <PasswordInput
                        name="current_password"
                        value={currentPassword}
                        onChange={(e: any) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={passwordLoading}
                        className="w-full"
                    />
                </div>

                <div className="divider my-4"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text font-medium">New Password</span></label>
                        <PasswordInput
                            name="new_password"
                            value={newPassword}
                            onChange={(e: any) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            disabled={passwordLoading}
                            className="w-full"
                        />
                        <label className="label p-1">
                            <span className="label-text-alt opacity-50 italic">Minimum 6 characters</span>
                        </label>
                    </div>

                    <div className="form-control w-full">
                        <label className="label"><span className="label-text font-medium">Confirm New Password</span></label>
                        <PasswordInput
                            name="confirm_password"
                            value={confirmPassword}
                            onChange={(e: any) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            disabled={passwordLoading}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="divider my-2"></div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className={`btn btn-primary px-10 ${passwordLoading ? "loading" : ""}`}
                        disabled={
                            passwordLoading ||
                            !currentPassword ||
                            !newPassword ||
                            !confirmPassword
                        }
                    >
                        {passwordLoading ? "" : "Change Password"}
                    </button>
                </div>
            </form>
        </div>
    );
}
