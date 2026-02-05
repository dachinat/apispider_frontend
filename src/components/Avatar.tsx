import { useLocation } from "preact-iso";
import { useMemo } from "preact/hooks";
import { useAuth } from "../hooks/useAuth";

type User = {
  name?: string;
  email?: string;
  avatar?: string;
};

type UseAuthResult = {
  user: User | null;
  logout: () => void;
  isAuthenticated: boolean;
};

export default function Avatar() {
  const location = useLocation();
  const { user, logout } = useAuth() as UseAuthResult;

  const avatar = useMemo<string>(() => user?.avatar ?? "", [user?.avatar]);

  return (
    <div className="dropdown dropdown-end">
      <label
        tabIndex={0}
        className="btn btn-ghost btn-circle avatar border border-base-content/10"
      >
        <div className="w-8 rounded-full">
          <img
            src={avatar}
            alt={user?.name ?? "User avatar"}
            referrerPolicy="no-referrer"
          />
        </div>
      </label>

      <ul
        tabIndex={0}
        className="mt-3 z-[100] p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 border border-base-content/10 rounded-box w-52"
      >
        <li className="menu-title px-4 py-2 flex flex-col items-start gap-1">
          <span className="text-sm font-semibold text-base-content">
            {user?.name}
          </span>
          <span className="text-xs font-normal">{user?.email}</span>
        </li>

        <div className="divider my-0" />

        <li>
          <a onClick={() => location.route("/settings")}>
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profile Settings
          </a>
        </li>

        <div className="divider my-0" />

        <li>
          <a
            onClick={() => {
              logout();
              location.route("/sign-in");
            }}
            className="text-error"
          >
            Sign Out
          </a>
        </li>
      </ul>
    </div>
  );
}
