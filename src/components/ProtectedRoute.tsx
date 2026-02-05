import { useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";
import { useAuth } from "../hooks/useAuth";
import { ComponentType } from "preact";

interface ProtectedRouteProps {
    component: ComponentType<any>;
    [key: string]: any;
}

export default function ProtectedRoute({ component: Component, ...rest }: ProtectedRouteProps) {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            location.route("/sign-in");
        }
    }, [isAuthenticated, loading, location]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return isAuthenticated ? <Component {...rest} /> : null;
}
