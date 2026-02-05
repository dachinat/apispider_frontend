import type { ComponentChildren } from "preact";

type ActivityId = "client" | "api" | "mocks" | "history" | "invites" | "settings";

interface MenuItem {
    id: ActivityId;
    label: string;
    icon: ComponentChildren;
    badge?: string;
}

interface ActivitySidebarProps {
    activeActivity: ActivityId;
    onActivityChange: (id: ActivityId) => void;
}

export default function ActivitySidebar({
    activeActivity,
    onActivityChange
}: ActivitySidebarProps) {
    const menuItems: MenuItem[] = [
        {
            id: "client",
            label: "Client",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            ),
        },
        {
            id: "api",
            label: "API",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                </svg>
            ),
        },
        {
            id: "mocks",
            label: "Mocks",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5h6a2 2 0 012 2v14H7V7a2 2 0 012-2z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 9h6M9 13h6M9 17h6"
                    />
                </svg>
            ),
        },
        {
            id: "history",
            label: "History",
            icon: (
                <svg
                    className="w-5 h-5"
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
            ),
        },
        {
            id: "invites",
            label: "Invites",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                </svg>
            ),
        },
    ];

    const bottomItems: MenuItem[] = [
        {
            id: "settings",
            label: "Settings",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            ),
        },
    ];

    return (
        <aside className="activity-sidebar w-16 md:w-20 bg-base-100 border-r border-base-300 flex flex-col items-center py-4 flex-shrink-0 z-20">
            <div className="flex-1 flex flex-col gap-4 w-full px-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => !item.badge && onActivityChange(item.id)}
                        className={`flex flex-col items-center justify-center gap-1 w-full py-3 rounded-xl transition-all duration-300 group relative ${activeActivity === item.id
                            ? "bg-primary/10 text-primary shadow-sm"
                            : "text-base-content/50 hover:bg-base-200 hover:text-base-content"
                            } ${item.badge ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                    >
                        <div className="relative">
                            {item.icon}
                            {activeActivity === item.id && (
                                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r-full" />
                            )}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-tight text-center leading-none">
                            {item.label}
                        </span>
                        {item.badge && (
                            <span className="absolute -top-1 -right-1 bg-base-300 text-[8px] px-1 rounded-md font-bold text-base-content/70 border border-base-300 uppercase">
                                {item.badge}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-4 w-full px-2">
                {bottomItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onActivityChange(item.id)}
                        className={`flex flex-col items-center justify-center gap-1 w-full py-3 rounded-xl transition-all duration-300 group relative ${activeActivity === item.id
                            ? "bg-primary/10 text-primary"
                            : "text-base-content/50 hover:bg-base-200 hover:text-base-content"
                            } cursor-pointer`}
                    >
                        <div className="relative">
                            {item.icon}
                            {activeActivity === item.id && (
                                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r-full" />
                            )}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-tight text-center leading-none">
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </aside>
    );
}