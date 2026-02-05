import { ApiDocTab } from "../types";

const THEMES = [
    { id: "apispider-light", name: "Light" },
    { id: "apispider-dark", name: "Dark" },
    { id: "system", name: "System" },
];

interface AppearanceSectionProps {
    currentTab: ApiDocTab;
    onUpdateTab: (updates: Partial<ApiDocTab>) => void;
    handleLogoUpload: (e: any, theme: "light" | "dark") => void;
}

export default function AppearanceSection({ currentTab, onUpdateTab, handleLogoUpload }: AppearanceSectionProps) {
    return (
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm">
            <div className="p-8">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.828 2.828a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold tracking-tight">Appearance & Branding</h3>
                        <p className="text-xs text-base-content/50 font-bold uppercase tracking-wider">Styling & Themes</p>
                    </div>
                </div>

                <div className="space-y-12">
                    <div className="form-control">
                        <label className="label pb-4"><span className="label-text font-bold text-xs uppercase tracking-wider opacity-60">Visual Theme</span></label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {THEMES.map((theme) => {
                                const isSelected = currentTab.theme === theme.id;
                                const isDark = theme.id === "apispider-dark";
                                const isSystem = theme.id === "system";

                                return (
                                    <button
                                        key={theme.id}
                                        type="button"
                                        onClick={() => onUpdateTab({ theme: theme.id, saved: false })}
                                        className={`relative flex flex-col items-center p-2 rounded-xl border-2 transition-all duration-200 group ${isSelected
                                            ? "border-primary bg-primary/5 shadow-sm"
                                            : "border-base-300 bg-base-100 hover:border-base-300 hover:bg-base-200/50"
                                            }`}
                                    >
                                        <div className={`w-full aspect-[16/10] rounded-lg mb-3 border border-base-300 overflow-hidden relative shadow-sm ${isDark ? "bg-slate-900" : "bg-white"}`}>
                                            {isSystem ? (
                                                <div className="absolute inset-0 flex">
                                                    <div className="flex-1 bg-white border-r border-base-300">
                                                        <div className="p-3 space-y-2 opacity-30">
                                                            <div className="h-2 w-2/3 rounded-full bg-gray-200"></div>
                                                            <div className="h-2 w-full rounded-full bg-gray-100"></div>
                                                            <div className="h-2 w-1/2 rounded-full bg-gray-100"></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 bg-slate-900">
                                                        <div className="p-3 space-y-2 opacity-30">
                                                            <div className="h-2 w-2/3 rounded-full bg-slate-700"></div>
                                                            <div className="h-2 w-full rounded-full bg-slate-800"></div>
                                                            <div className="h-2 w-1/2 rounded-full bg-slate-800"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-3 space-y-2">
                                                    <div className={`h-2 w-1/2 rounded-full ${isDark ? "bg-slate-700" : "bg-gray-100"}`}></div>
                                                    <div className="flex gap-2"><div className={`h-2 flex-1 rounded-full ${isDark ? "bg-primary/30" : "bg-primary/20"}`}></div><div className={`h-2 flex-1 rounded-full ${isDark ? "bg-slate-800" : "bg-gray-50"}`}></div></div>
                                                    <div className={`h-2 w-full rounded-full ${isDark ? "bg-slate-800" : "bg-gray-50"}`}></div>
                                                </div>
                                            )}
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                                                    <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-md">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="py-1">
                                            <span className={`text-[11px] font-bold uppercase tracking-wider ${isSelected ? "text-primary" : "text-base-content/40"}`}>{theme.name}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="form-control">
                            <label className="label pb-4"><span className="label-text font-bold text-xs uppercase tracking-wider opacity-60">Brand Logos</span></label>
                            <div className="flex gap-6">
                                <div className="flex flex-col items-center gap-3">
                                    {currentTab.logo_url_light ? (
                                        <div className="relative group/logo">
                                            <div className="w-24 h-24 rounded-xl border border-base-300 bg-white flex items-center justify-center p-3 overflow-hidden shadow-sm cursor-pointer hover:border-primary/30 transition-all">
                                                <img src={currentTab.logo_url_light} alt="Light logo" className="max-w-full max-h-full object-contain" />
                                            </div>
                                            <button type="button" className="btn btn-circle btn-xs btn-error absolute -top-1 -right-1 shadow-sm" onClick={() => onUpdateTab({ logo_url_light: "", saved: false })}>✕</button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-base-300 rounded-xl hover:border-primary/50 hover:bg-base-200/50 cursor-pointer transition-all group">
                                            <svg className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, "light")} />
                                        </label>
                                    )}
                                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-30">Light Mode</span>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    {currentTab.logo_url_dark ? (
                                        <div className="relative group/logo">
                                            <div className="w-24 h-24 rounded-xl border border-base-300 bg-neutral flex items-center justify-center p-3 overflow-hidden shadow-sm cursor-pointer hover:border-primary/30 transition-all">
                                                <img src={currentTab.logo_url_dark} alt="Dark logo" className="max-w-full max-h-full object-contain" />
                                            </div>
                                            <button type="button" className="btn btn-circle btn-xs btn-error absolute -top-1 -right-1 shadow-sm" onClick={() => onUpdateTab({ logo_url_dark: "", saved: false })}>✕</button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-base-300 rounded-xl hover:border-primary/50 hover:bg-base-200/50 cursor-pointer transition-all group">
                                            <svg className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, "dark")} />
                                        </label>
                                    )}
                                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-30">Dark Mode</span>
                                </div>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label pb-4"><span className="label-text font-bold text-xs uppercase tracking-wider opacity-60">Documentation Footer</span></label>
                            <input
                                type="text"
                                className="input input-bordered w-full bg-base-100 border-base-300 focus:border-accent transition-all h-10 rounded-lg font-bold placeholder:opacity-20"
                                placeholder="e.g. © 2024 ApiSpider Documentation"
                                value={currentTab.footer_text}
                                onInput={(e: any) => onUpdateTab({ footer_text: e.target.value, saved: false })}
                            />
                            <p className="mt-2 text-[10px] font-medium text-base-content/40 pl-1 italic">This text appears at the bottom of every page.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
