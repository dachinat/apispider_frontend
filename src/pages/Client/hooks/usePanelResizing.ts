import { useState, useCallback, useEffect } from "preact/hooks";

export const usePanelResizing = () => {
    const [sidebarWidth, setSidebarWidth] = useState(320);
    const [responsePosition, setResponsePosition] = useState<"bottom" | "right">("bottom");
    const [panelSize, setPanelSize] = useState(350);
    const [isResizingSidebar, setIsResizingSidebar] = useState(false);
    const [isResizingPanel, setIsResizingPanel] = useState(false);

    const startResizingSidebar = useCallback(() => setIsResizingSidebar(true), []);
    const startResizingPanel = useCallback(() => setIsResizingPanel(true), []);

    const stopResizing = useCallback(() => {
        setIsResizingSidebar(false);
        setIsResizingPanel(false);
    }, []);

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            if (isResizingSidebar) {
                const newWidth = e.clientX;
                // Adjustment for main sidebar
                const sidebar = document.querySelector(".activity-sidebar");
                const sidebarOffset = sidebar ? sidebar.clientWidth : 0;
                const adjustedWidth = newWidth - sidebarOffset;
                if (adjustedWidth > 200 && adjustedWidth < 600)
                    setSidebarWidth(adjustedWidth);
            }

            if (isResizingPanel) {
                if (responsePosition === "bottom") {
                    const newHeight = window.innerHeight - e.clientY;
                    if (newHeight > 100 && newHeight < window.innerHeight - 200) {
                        setPanelSize(newHeight);
                    }
                } else {
                    const newWidth = window.innerWidth - e.clientX;
                    if (newWidth > 300 && newWidth < window.innerWidth - 400) {
                        setPanelSize(newWidth);
                    }
                }
            }
        },
        [isResizingSidebar, isResizingPanel, responsePosition],
    );

    useEffect(() => {
        if (isResizingSidebar || isResizingPanel) {
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", stopResizing);
        }
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [isResizingSidebar, isResizingPanel, onMouseMove, stopResizing]);

    return {
        sidebarWidth,
        setSidebarWidth,
        responsePosition,
        setResponsePosition,
        panelSize,
        setPanelSize,
        isResizingSidebar,
        isResizingPanel,
        startResizingSidebar,
        startResizingPanel,
    };
};
