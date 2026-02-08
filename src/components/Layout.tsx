import { useAuth } from "../hooks/useAuth";
import Footer from "./Footer";
import Branding from "./Branding";
import { ComponentChildren } from "preact";
import { useLocation } from "preact-iso";

interface LayoutProps {
  children: ComponentChildren;
  buttons?: ComponentChildren;
  activitySidebar?: ComponentChildren;
}

export default function Layout({
  children,
  buttons = null,
  activitySidebar = null,
}: LayoutProps) {
  const { isAuthenticated } = useAuth();

  const { path } = useLocation();

  const isAuthPage =
    path.startsWith("/sign-in") ||
    path.startsWith("/sign-up") ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/reset-password") ||
    path.startsWith("/confirm-email") ||
    path.startsWith("/resend-confirmation") ||
    path.startsWith("/accept-invite");

  const showWelcome = !isAuthenticated && isAuthPage;

  return (
    <div className="h-screen flex flex-col bg-base-200">
      <div className="navbar bg-base-100 border-b border-base-300 z-30">
        <div className="flex-1 flex items-center">
          <a href="/" className="flex items-center gap-1 group">
            <Branding />
          </a>
        </div>
        <div className="flex gap-2 items-center">{buttons}</div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {showWelcome && (
          <div className="hidden lg:flex w-[45%] flex-col justify-between p-20 bg-base-100 border-r border-base-300 relative">
            <div className="relative z-10">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-8">
                Optimized for Productivity
              </div>
              <h1 className="text-5xl font-bold mb-6 leading-tight tracking-tight text-base-content">
                Build better APIs, faster.
              </h1>
              <p className="text-lg text-base-content/60 mb-12 max-w-md leading-relaxed">
                APISpider brings clarity to your backend development with a
                powerful, intuitive interface designed for modern engineering
                teams.
              </p>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex-none text-primary">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content">
                      Universal API client
                    </h3>
                    <p className="text-sm text-base-content/50">
                      Debug REST, GraphQL, and WebSockets in one unified
                      interface.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 flex-none text-primary">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content">
                      Automated API Documentation
                    </h3>
                    <p className="text-sm text-base-content/50">
                      Generate beautiful, interactive docs directly from your
                      test cases.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 flex-none text-primary">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content">
                      Integrated Mock Servers
                    </h3>
                    <p className="text-sm text-base-content/50">
                      Simulate API responses and test your frontend
                      independently.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-16 border-t border-base-200">
              <div className="flex items-center gap-4 text-sm font-medium text-base-content/40">
                <span>Free forever for individuals</span>
                <span className="w-1 h-1 rounded-full bg-base-300"></span>
                <span>
                  <a
                    href="https://github.com/dachinat/apispider_frontend"
                    target="_blank"
                  >
                    Open Source
                  </a>
                </span>
              </div>
            </div>
          </div>
        )}
        {activitySidebar}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
}
