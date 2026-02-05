import { useAuth } from "../../../hooks/useAuth";

const THEMES = [
  "apispider-light",
  "apispider-dark",
  "andromeda",
  "ayudark",
  "ayulight",
  "catppuccin",
  "dracula",
  "everforest",
  "everforestlight",
  "flexoki",
  "flexokilight",
  "githubdark",
  "githublight",
  "gruvbox",
  "gruvboxlight",
  "kanagawa",
  "kanagawalight",
  "monokai",
  "monokailight",
  "nightfox",
  "nightfoxlight",
  "nightowl",
  "nightowllight",
  "onedarkpro",
  "onedarklight",
  "rosepine",
  "rosepinelight",
  "solarized",
  "solarizedlight",
  "sublimetext",
  "sublimetextlight",
  "synthwave",
  "tokyonight",
  "vscodedark",
  "vscodelight",
];

export default function Appearance() {
  const { user, updateTheme } = useAuth();
  // Helper to get current theme from DOM or user object
  const currentTheme =
    user?.theme || document.documentElement.getAttribute("data-theme");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold">Theme Preferences</h3>
        <p className="text-sm opacity-60">
          Choose a theme that suits your style and workflow.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {THEMES.map((t) => (
          <div
            key={t}
            onClick={() => updateTheme(t)}
            className={`group relative cursor-pointer rounded-xl border-2 transition-all p-3 hover:scale-[1.02] active:scale-[0.98] ${
              currentTheme === t || (!currentTheme && t === "apispider-default")
                ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                : "border-base-300 bg-base-100 hover:border-primary/50"
            }`}
            data-theme={t}
          >
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold truncate capitalize">
                  {t.replace("apispider-", "")}
                </span>
                {(currentTheme === t ||
                  (!currentTheme && t === "apispider-default")) && (
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              {/* Theme Preview Square */}
              <div className="aspect-video w-full rounded-lg bg-base-100 shadow-inner overflow-hidden flex flex-col border border-base-content/10">
                {/* Dummy Header */}
                <div className="h-2 w-full bg-base-300 opacity-50"></div>
                <div className="flex-1 p-2 flex flex-col gap-1">
                  {/* Dummy Content */}
                  <div className="h-1.5 w-3/4 bg-primary rounded-full"></div>
                  <div className="h-1.5 w-1/2 bg-secondary rounded-full"></div>
                  <div className="mt-auto flex gap-1">
                    <div className="w-2 h-2 rounded-sm bg-accent"></div>
                    <div className="w-2 h-2 rounded-sm bg-neutral"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-base-content/0 group-hover:bg-base-content/5 rounded-xl transition-colors"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
