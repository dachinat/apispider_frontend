import { useLocation } from "preact-iso";
import { useAuth } from "../hooks/useAuth.js";
import Sidebar from "./Sidebar.jsx";
import DarkModeToggle from "./DarkModeToggle.jsx";
import Avatar from "./Avatar.jsx";
import Footer from "./Footer.jsx";
import Branding from "./Branding.jsx";
import { ComponentChildren } from "preact";

type ActivityId = "client" | "mocks" | "invites" | "history" | "settings" | "api";

interface CommonLayoutProps {
    children: ComponentChildren;
    buttons?: ComponentChildren;
    activeActivity?: ActivityId;
}

export default function CommonLayout({
    children,
    buttons = null,
    activeActivity = "client",
}: CommonLayoutProps) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    const handleActivityChange = (id: ActivityId): void => {
        if (id === "client") {
            location.route("/");
        } else if (id === "mocks") {
            location.route("/mocks");
        } else if (id === "invites") {
            location.route("/invites");
        } else if (id === "history") {
            location.route("/history");
        } else if (id === "settings") {
            location.route("/settings");
        } else if (id === "api") {
            location.route("/api");
        }
    };

    return (
        <div className="h-screen flex flex-col bg-base-200">
            <div className="navbar bg-base-100 border-b border-base-300 z-30">
                <div className="flex-1 flex items-center">
                    <a href="/" className="flex items-center gap-1 group">
                        <Branding />
                    </a>
                </div>
                <div className="flex gap-2 items-center">
                    {buttons}
                    <div className="divider divider-horizontal mx-1 h-6 opacity-20"></div>
                    <DarkModeToggle />
                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <Avatar />
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                location.route("/sign-up");
                            }}
                            className="btn btn-sm btn-primary h-8 min-h-0 px-4 font-bold"
                        >
                            Sign up
                        </button>
                    )}
                    <div className="mr-2"></div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <Sidebar
                    activeActivity={activeActivity}
                    onActivityChange={handleActivityChange}
                />
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {children}
                </div>
            </div>

            <Footer />
        </div>
    );
}