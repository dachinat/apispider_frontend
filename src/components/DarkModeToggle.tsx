import { useEffect } from "preact/hooks";
import { useAuth } from "../hooks/useAuth.js";
import { useTheme } from "../hooks/useTheme";

type Theme = "apispider-light" | "apispider-dark";

export default function DarkModeToggle() {
  const { isAuthenticated, updateTheme } = useAuth();
  const { theme } = useTheme();

  const isDark = theme === "apispider-dark";

  const showToggle =
    !isAuthenticated || ["apispider-light", "apispider-dark"].includes(theme);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = async (
      e: MediaQueryListEvent
    ): Promise<void> => {
      if (["apispider-light", "apispider-dark"].includes(theme)) {
        const newIsDark = e.matches;
        const newTheme: Theme = newIsDark
          ? "apispider-dark"
          : "apispider-light";

        if (newTheme !== theme) {
          document.documentElement.setAttribute("data-theme", newTheme);
          localStorage.setItem("theme", newTheme);

          if (isAuthenticated) {
            await updateTheme(newTheme);
          }
        }
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [theme, isAuthenticated, updateTheme]);


  useEffect(() => {
    if (!document.documentElement.getAttribute("data-theme")) {
      const saved = localStorage.getItem("theme");
      if (saved) {
        document.documentElement.setAttribute("data-theme", saved);
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.setAttribute("data-theme", "apispider-dark");
      } else {
        document.documentElement.setAttribute("data-theme", "apispider-light");
      }
    }
  }, []);

  const toggleTheme = async (): Promise<void> => {
    const newTheme: Theme =
      theme === "apispider-light" ? "apispider-dark" : "apispider-light";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    if (isAuthenticated) {
      await updateTheme(newTheme);
    }
  };

  if (!showToggle) return null;

  return (
    <>
      <button
        onClick={toggleTheme}
        className="btn btn-ghost btn-square"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </button>
    </>
  );
}
