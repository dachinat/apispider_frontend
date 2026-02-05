import { useState, useCallback, useEffect } from "preact/hooks";

export type ResponsePosition = "bottom" | "right";

export const useLayout = () => {
    const [responsePosition, setResponsePosition] = useState<ResponsePosition>(() => {
        try {
            const saved = localStorage.getItem("apispider_response_position");
            return (saved as ResponsePosition) || "bottom";
        } catch (e) {
            return "bottom";
        }
    });

    const [sidebarWidth, setSidebarWidth] = useState(() => {
        try {
            const saved = localStorage.getItem("apispider_sidebar_width");
            return saved ? parseInt(saved, 10) : 320;
        } catch (e) {
            return 320;
        }
    });

    const [panelSize, setPanelSize] = useState(() => {
        try {
            const saved = localStorage.getItem("apispider_panel_size");
            return saved ? parseInt(saved, 10) : 320;
        } catch (e) {
            return 320;
        }
    });

    const [isResizingSidebar, setIsResizingSidebar] = useState(false);
    const [isResizingPanel, setIsResizingPanel] = useState(false);

    useEffect(() => {
        localStorage.setItem("apispider_response_position", responsePosition);
    }, [responsePosition]);

    useEffect(() => {
        localStorage.setItem("apispider_sidebar_width", sidebarWidth.toString());
    }, [sidebarWidth]);

    useEffect(() => {
        localStorage.setItem("apispider_panel_size", panelSize.toString());
    }, [panelSize]);

    const ensureResponsePanelVisibility = useCallback(() => {
        setPanelSize((prevSize) => {
            if (responsePosition === "bottom") {
                if (prevSize < 300) return 350;
            } else if (responsePosition === "right") {
                if (prevSize < 400) return 450;
            }
            return prevSize;
        });
    }, [responsePosition]);

    return {
        responsePosition,
        setResponsePosition,
        sidebarWidth,
        setSidebarWidth,
        panelSize,
        setPanelSize,
        isResizingSidebar,
        setIsResizingSidebar,
        isResizingPanel,
        setIsResizingPanel,
        ensureResponsePanelVisibility,
    };
};
