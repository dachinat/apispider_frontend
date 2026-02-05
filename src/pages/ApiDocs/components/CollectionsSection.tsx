import { ApiDocTab, Collection } from "../types";

interface CollectionsSectionProps {
    currentTab: ApiDocTab;
    collections: Collection[];
    onUpdateTab: (updates: Partial<ApiDocTab>) => void;
}

export default function CollectionsSection({ currentTab, collections, onUpdateTab }: CollectionsSectionProps) {
    return (
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm">
            <div className="p-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold tracking-tight">Included Resources</h3>
                        <p className="text-xs text-base-content/50 font-bold uppercase tracking-wider">Collection Selection</p>
                    </div>
                </div>
                <p className="text-sm text-base-content/50 mb-8 font-medium">Select which collections to include in the published documentation.</p>

                {collections.length === 0 ? (
                    <div className="p-12 border-2 border-dashed border-base-300 rounded-xl text-center">
                        <p className="text-base-content/30 text-sm font-bold uppercase tracking-wider">No collections found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {collections.map((collection) => (
                            <label
                                key={collection.id}
                                className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 cursor-pointer ${currentTab.collection_ids.includes(collection.id)
                                    ? "bg-secondary/5 border-secondary/40 shadow-sm"
                                    : "bg-base-100 border-base-300 hover:border-secondary/30 hover:bg-base-200/50"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-secondary checkbox-sm rounded-md"
                                    checked={currentTab.collection_ids.includes(collection.id)}
                                    onChange={(e: any) => {
                                        if (e.target.checked) {
                                            onUpdateTab({
                                                collection_ids: [...currentTab.collection_ids, collection.id],
                                                saved: false,
                                            });
                                        } else {
                                            onUpdateTab({
                                                collection_ids: currentTab.collection_ids.filter((id) => id !== collection.id),
                                                saved: false,
                                            });
                                        }
                                    }}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className={`font-bold text-sm tracking-tight ${currentTab.collection_ids.includes(collection.id) ? "text-secondary" : ""}`}>{collection.name}</div>
                                    <div className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider mt-1">{collection.requests_count || collection.request_count || 0} Requests</div>
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
