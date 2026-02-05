import { useState, useRef, useEffect } from "preact/hooks";
import { createPortal } from "preact/compat";
import { getMethodColor } from "../utils/methods";

interface MethodSelectorProps {
    value: string | null;
    onChange: (method: string) => void;
    methods: string[];
    showCustom?: boolean;
}

export default function MethodSelector({ value, onChange, methods, showCustom = true }: MethodSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [customValue, setCustomValue] = useState(value || "");
    const dropdownRef = useRef<HTMLUListElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

    const updateDropdownPosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('scroll', updateDropdownPosition, true);
            window.addEventListener('resize', updateDropdownPosition);
            updateDropdownPosition();

            return () => {
                window.removeEventListener('scroll', updateDropdownPosition, true);
                window.removeEventListener('resize', updateDropdownPosition);
            };
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (method: string) => {
        if (method === "CUSTOM") {
            setIsEditing(true);
            setIsOpen(false);
            setCustomValue("");
            setTimeout(() => inputRef.current?.focus(), 0);
        } else {
            onChange(method);
            setIsOpen(false);
            setIsEditing(false);
        }
    };

    const handleCustomSubmit = () => {
        if (customValue.trim()) {
            onChange(customValue.trim().toUpperCase());
            setIsEditing(false);
        }
    };

    const handleCustomKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleCustomSubmit();
        } else if (e.key === "Escape") {
            setIsEditing(false);
            setCustomValue(value || "");
        }
    };

    const handleButtonClick = (e: MouseEvent) => {
        e.stopPropagation();
        updateDropdownPosition();
        setIsOpen(!isOpen);
    };

    const displayValue = value || "GET";

    return (
        <div className="relative">
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={customValue}
                    onChange={(e) => setCustomValue((e.target as HTMLInputElement).value)}
                    onKeyDown={(e) => handleCustomKeyDown(e as any)}
                    onBlur={handleCustomSubmit}
                    placeholder="METHOD"
                    className="input w-25 h-10 rounded-none border-0 border-r border-base-300 bg-base-100 focus:outline-none uppercase font-bold text-xs text-center"
                    maxLength={10}
                />
            ) : (
                <button
                    ref={buttonRef}
                    type="button"
                    onClick={handleButtonClick as any}
                    className="input w-25 h-10 flex items-center justify-between gap-2 cursor-pointer rounded-none border-0 border-r border-base-300 bg-base-100 focus:outline-none"
                >
                    <span className={`badge badge-xs ${getMethodColor(displayValue)}`}>
                        {displayValue}
                    </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                    </svg>
                </button>
            )}

            {isOpen && !isEditing && createPortal(
                <ul
                    ref={dropdownRef}
                    className="fixed bg-base-100 border border-base-300 rounded-lg shadow-lg z-[9999] overflow-hidden"
                    style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                        width: `${dropdownPosition.width}px`
                    }}
                >
                    {methods.map((method) => (
                        <li key={method}>
                            <button
                                type="button"
                                onClick={() => handleSelect(method)}
                                className={`w-full text-left px-3 py-2 hover:bg-base-200 transition-colors flex items-center justify-center ${value === method ? "bg-base-200" : ""
                                    }`}
                            >
                                <span className={`badge badge-xs ${getMethodColor(method)}`}>
                                    {method}
                                </span>
                            </button>
                        </li>
                    ))}
                    {showCustom && (
                        <li className="border-t border-base-300">
                            <button
                                type="button"
                                onClick={() => handleSelect("CUSTOM")}
                                className="w-full px-3 py-2 hover:bg-base-200 transition-colors text-xs font-semibold text-center text-base-content/60"
                            >
                                Custom...
                            </button>
                        </li>
                    )}
                </ul>,
                document.body
            )}
        </div>
    );
}
