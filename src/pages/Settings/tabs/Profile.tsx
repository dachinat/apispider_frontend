import { useState, useEffect } from "preact/hooks";
import { useAuth } from "../../../hooks/useAuth";

export default function Profile() {
  const { user, updateName } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [nameLoading, setNameLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Sync name when user is loaded
  useEffect(() => {
    if (user?.name && !name) {
      setName(user.name);
    }
  }, [user?.name]);

  const handleUpdateName = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }

    setNameLoading(true);
    const result = await updateName(name);
    setNameLoading(false);

    if (result.success) {
      setSuccess("Profile name updated successfully");
    } else {
      setError(result.error || "Failed to update profile name");
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback messages */}
      {error && (
        <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-success/10 border border-success/20 text-success rounded-xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          {success}
          <button
            onClick={() => setSuccess("")}
            className="btn btn-ghost btn-xs ml-auto"
          >
            ✕
          </button>
        </div>
      )}

      <div>
        <h3 className="text-lg font-bold text-base-content">
          Profile Information
        </h3>
        <p className="text-sm text-base-content/60 mt-1">
          Update your account's profile information and name.
        </p>
      </div>

      <form onSubmit={handleUpdateName} className="space-y-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Full Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full focus:input-primary transition-all"
            value={name}
            onInput={(e: any) => setName(e.target.value)}
            placeholder="e.g. John Doe"
            required
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Email Address</span>
          </label>
          <div className="relative">
            <input
              type="email"
              className="input input-bordered w-full bg-base-200/50 cursor-not-allowed pr-10"
              value={user?.email || ""}
              disabled
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none opacity-40">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <label className="label p-1 mt-2">
            <span className="label-text-alt opacity-50 italic">
              Email address cannot be changed right now.
            </span>
          </label>
        </div>

        <div className="divider my-2"></div>

        <div className="flex justify-end">
          <button
            type="submit"
            className={`btn btn-primary px-10 ${nameLoading ? "loading" : ""}`}
            disabled={nameLoading || name === user?.name}
          >
            {nameLoading ? "" : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
