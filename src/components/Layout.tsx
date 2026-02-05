import { useAuth } from "../hooks/useAuth";
import Footer from "./Footer";
import Branding from "./Branding";
import { ComponentChildren } from "preact";

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
        {activitySidebar}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
}
