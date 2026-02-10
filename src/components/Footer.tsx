import { useState, useEffect } from "preact/hooks";

import DownloadAgentModal from "./DownloadAgentModal.jsx";
import GitHubButton from "react-github-btn";
import { useTheme } from "../hooks/useTheme";

export default function Footer() {
  const { theme } = useTheme();
  const [accepted, setAccepted] = useState<boolean>(true);
  const [isDownloadModalOpen, setIsDownloadModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const isAccepted = localStorage.getItem("cookie-consent-accepted");
    if (!isAccepted) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = (): void => {
    localStorage.setItem("cookie-consent-accepted", "true");
    setAccepted(true);
  };

  return (
    <footer className="flex justify-between items-center px-4 py-2 bg-base-200 text-base-content border-t border-base-300 text-[10px]">
      <div className="flex items-center gap-4">
        {!accepted && (
          <div className="flex items-center gap-1.5 bg-success/10 text-success px-2 py-0.5 rounded border border-success/20">
            <span className="font-medium">I accept Cookie Policy</span>
            <button
              onClick={handleAccept}
              className="btn btn-ghost btn-xs h-4 min-h-0 w-4 p-0 bg-success text-white hover:bg-success/80 rounded-sm"
              aria-label="Accept Cookies"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <a href="/terms-of-service" className="link link-hover">
            Terms
          </a>
          <a href="/privacy-policy" className="link link-hover">
            Privacy
          </a>
          <a href="/cookie-policy" className="link link-hover">
            Cookies
          </a>
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="link link-hover font-medium text-primary"
          >
            Download Agent
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <p>
          © {new Date().getFullYear()} -{" "}
          <a href="/" className="hover:underline">
            apispider.com
          </a>
        </p>
      </div>
      <nav className="flex items-center gap-4">

        <a href="https://paypal.me/dachina">
          <img
            src="/paypal.png"
            alt="Sponsor APISpider project with PayPal"
          />
        </a>

        <GitHubButton
          href="https://github.com/dachinat/apispider_frontend"
          data-color-scheme={
            theme === "apispider-light" ? "light" : "dark"
          }
          data-size="large"
          data-show-count="true"
          aria-label="Star dachinat/apispider_frontend on GitHub"
        >
          Star on GitHub
        </GitHubButton>
      </nav>
      <DownloadAgentModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </footer>
  );
}
