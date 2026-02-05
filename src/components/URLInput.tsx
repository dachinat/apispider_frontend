import { useState, useEffect, useRef } from "preact/hooks";
import { historyService } from "../services/history";
import { useWorkspace } from "../context/WorkspaceContext";

interface URLInputProps {
    value: string;
    onChange: (e: any) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    requestType?: string | null;
}

export default function URLInput({ value, onChange, placeholder, disabled, className, requestType }: URLInputProps) {
    const { activeWorkspaceId } = useWorkspace();
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dropdownMouseDownRef = useRef(false);

    useEffect(() => {
        const loadHistory = async () => {
            setHistoryLoaded(false);
            try {
                if (!localStorage.getItem("token")) {
                    setSuggestions([]);
                    return;
                }

                const history = await historyService.getAll({
                    limit: 100,
                    offset: 0,
                    ...(activeWorkspaceId ? { workspace_id: activeWorkspaceId } : {}),
                });

                let historyItems: any[] = [];
                if (Array.isArray(history)) {
                    historyItems = history;
                } else if (history && Array.isArray(history.data)) {
                    historyItems = history.data;
                }

                if (historyItems.length > 0) {
                    const filteredItems = requestType
                        ? historyItems.filter(item => {
                            const itemRequestType = item.request_type;
                            const itemMethod = item.method;

                            // Determine the actual request type
                            let itemType = itemRequestType || "http";
                            if (itemMethod === "WEBSOCKET" || itemType === "websocket") {
                                itemType = "websocket";
                            } else if (itemMethod === "SOCKETIO" || itemType === "socketio") {
                                itemType = "socketio";
                            }

                            return itemType === requestType;
                        })
                        : historyItems;
                    const uniqueUrls = [...new Set(filteredItems.map(item => item.url))].filter(Boolean) as string[];
                    setSuggestions(uniqueUrls);
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.error("Failed to load URL history:", error);
                setSuggestions([]);
            } finally {
                setHistoryLoaded(true);
            }
        };

        loadHistory();
    }, [activeWorkspaceId, requestType]);

    const updateDropdownPosition = () => {
        if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    };

    useEffect(() => {
        if (showSuggestions) {
            window.addEventListener('scroll', updateDropdownPosition, true);
            window.addEventListener('resize', updateDropdownPosition);
            updateDropdownPosition();

            return () => {
                window.removeEventListener('scroll', updateDropdownPosition, true);
                window.removeEventListener('resize', updateDropdownPosition);
            };
        }
    }, [showSuggestions]);

    useEffect(() => {
        if (!historyLoaded) return;

        if (!value) {
            setFilteredSuggestions([]);
            return;
        }

        const lowerValue = value.toLowerCase();
        const filtered = suggestions
            .filter(url => url.toLowerCase().includes(lowerValue))
            .slice(0, 10);

        setFilteredSuggestions(filtered);
    }, [value, historyLoaded, suggestions]);

    const handleFocus = () => {
        updateDropdownPosition();
        if (value && filteredSuggestions.length > 0) {
            setShowSuggestions(true);
        } else if (!value && suggestions.length > 0) {
            setFilteredSuggestions(suggestions.slice(0, 10));
            setShowSuggestions(true);
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (!dropdownMouseDownRef.current) {
                setShowSuggestions(false);
                setSelectedIndex(-1);
            }
        }, 150);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!showSuggestions || filteredSuggestions.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prev => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prev => (prev > -1 ? prev - 1 : -1));
        } else if (e.key === "Enter") {
            if (selectedIndex >= 0) {
                e.preventDefault();
                selectSuggestion(filteredSuggestions[selectedIndex]);
            } else {
                setShowSuggestions(false);
            }
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
            setSelectedIndex(-1);
        }
    };

    const selectSuggestion = (url: string) => {
        onChange({ target: { value: url } });
        setShowSuggestions(false);
        setSelectedIndex(-1);
        dropdownMouseDownRef.current = false;
    };

    return (
        <div className="relative flex-1 flex">
            <input
                ref={inputRef}
                type="text"
                className={`${className} transition-colors duration-200`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown as any}
                onInput={(e) => {
                    onChange(e);
                    setShowSuggestions(true);
                    updateDropdownPosition();
                }}
                disabled={disabled}
                autoComplete="off"
            />

            {showSuggestions && filteredSuggestions.length > 0 && (
                <div
                    ref={dropdownRef}
                    className="fixed bg-base-100/95 backdrop-blur-sm border border-base-300 rounded-lg shadow-xl max-h-60 overflow-y-auto z-[9999] animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                        width: `${dropdownPosition.width}px`
                    }}
                    onMouseEnter={() => { dropdownMouseDownRef.current = true; }}
                    onMouseLeave={() => { dropdownMouseDownRef.current = false; }}
                >
                    {filteredSuggestions.map((url, index) => (
                        <div
                            key={index}
                            className={`px-3 py-2.5 cursor-pointer text-sm truncate transition-all duration-150 flex items-center gap-2 group ${index === selectedIndex
                                ? "bg-primary/10 text-primary scale-[0.98]"
                                : "hover:bg-base-200"
                                }`}
                            onClick={() => selectSuggestion(url)}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            <svg
                                className={`w-4 h-4 flex-shrink-0 transition-colors ${index === selectedIndex ? "text-primary" : "text-base-content/40 group-hover:text-base-content/60"
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span className="flex-1 truncate">{url}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
