import { useContext } from "preact/hooks";
import { AuthContext } from "../context/AuthContext";
import type { AuthContextType } from "../context/AuthContext";

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}