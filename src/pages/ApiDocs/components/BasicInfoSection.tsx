import { ApiDocTab } from "../types";

interface BasicInfoSectionProps {
    currentTab: ApiDocTab;
    onUpdateTab: (updates: Partial<ApiDocTab>) => void;
}

export default function BasicInfoSection({ currentTab, onUpdateTab }: BasicInfoSectionProps) {
    return (
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm">
            <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold tracking-tight">Basic Information</h3>
                        <p className="text-xs text-base-content/50 font-bold uppercase tracking-wider">Overview & Details</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="form-control">
                        <label className="label pb-2"><span className="label-text font-bold text-xs uppercase tracking-wider opacity-60">Public Summary</span></label>
                        <textarea
                            className="textarea textarea-bordered w-full bg-base-100 border-base-300 focus:border-primary transition-all h-32 rounded-lg font-medium"
                            placeholder="Brief summary of your API"
                            value={currentTab.summary}
                            onInput={(e: any) => onUpdateTab({ summary: e.target.value, saved: false })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
