import { useState, useEffect } from "preact/hooks";
import { useAuth } from "./useAuth";

export const useTheme = () => {
    const { user } = useAuth();
    const [theme, setTheme] = useState<"apispider-light" | "apispider-dark">(
        "apispider-light"
    );

    useEffect(() => {
        const getThemeFromDOM = () => {
            if (typeof window !== "undefined") {
                return document.documentElement.getAttribute("data-theme") as
                    | "apispider-light"
                    | "apispider-dark"
                    | null;
            }
            return null;
        };

        if (user?.theme) {
            const currentDom = getThemeFromDOM();
            if (currentDom !== user.theme) {
                document.documentElement.setAttribute("data-theme", user.theme);
                localStorage.setItem("theme", user.theme);
            }
        }

        const domTheme = getThemeFromDOM();
        if (domTheme) {
            setTheme(domTheme);
        } else if (user?.theme) {
            setTheme(user.theme as "apispider-light" | "apispider-dark");
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (
                    mutation.type === "attributes" &&
                    mutation.attributeName === "data-theme"
                ) {
                    const newTheme = getThemeFromDOM();
                    if (newTheme) {
                        setTheme(newTheme);
                    }
                }
            });
        });

        if (typeof window !== "undefined") {
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ["data-theme"],
            });
        }

        return () => observer.disconnect();
    }, [user]);

    return { theme };
};
