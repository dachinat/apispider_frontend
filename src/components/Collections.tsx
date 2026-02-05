import { useState, useRef, useEffect } from "preact/hooks";
import { getMethodColor } from "../utils/methods";
import SpiderSpinner from "./SpiderSpinner";
import ConfirmModal from "./ConfirmModal";
import { Tab } from "../pages/Client/types";
import { DEFAULT_HEADERS } from "../pages/Client/constants";
import { mapRequestToTab } from "../pages/Client/utils/tabMapper";

interface SavedRequest {
    id: string;
    name: string;
    collection_id?: string;
    method: string;
    url: string;
    requestType?: string;
    request_type?: string;
    params?: Record<string, string>;
    headers?: Record<string, string>;
    authType?: string;
    auth_type?: string;
    authData?: any;
    auth_data?: any;
    bodyType?: string;
    body_type?: string;
    bodyJson?: string;
    body_json?: string;
    bodyXml?: string;
    body_xml?: string;
    bodyText?: string;
    body_text?: string;
    bodyGraphQLQuery?: string;
    body_graphql_query?: string;
    bodyGraphQLVariables?: string;
    body_graphql_variables?: string;
    formData?: any[];
    form_data?: any[];
    urlEncodedData?: Record<string, string>;
    url_encoded?: Record<string, string>;
    body?: string;
    activeTab?: string;
}

interface Collection {
    id: string;
    name: string;
    requests?: SavedRequest[];
}

interface CollectionsProps {
    collections: Collection[];
    collectionsLoading?: boolean;
    handleDragEnd: (e: DragEvent) => void;
    handleDragStart: (e: DragEvent, item: any, type: string) => void;
    handleCollectionRename: (id: string, name: string) => Promise<boolean>;
    handleCollectionDelete: (id: string) => void;
    handleRequestRename: (id: string, name: string) => Promise<boolean>;
    handleRequestDelete: (id: string) => void;
    tabs: Tab[];
    setActiveTabId: (id: any) => void;
    setTabs: (tabs: any) => void;
    setCollections: (collections: any) => void;
    draggedItem: any;
    handleRequestMove: (requestId: string, targetCollectionId: string, sourceCollectionId?: string) => Promise<void>;
    activeTabId: number | string | null;
}

export default function Collections({
    collections,
    collectionsLoading = false,
    handleDragEnd,
    handleDragStart,
    handleCollectionRename,
    handleCollectionDelete,
    handleRequestRename,
    handleRequestDelete,
    tabs,
    setActiveTabId,
    setTabs,
    draggedItem,
    handleRequestMove,
    activeTabId,
}: CollectionsProps) {
    const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
    const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");
    const [dragOverCollectionId, setDragOverCollectionId] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const requestInputRef = useRef<HTMLInputElement>(null);
    const saveOnBlur = useRef(true);
    const saveRequestOnBlur = useRef(true);

    const activeRequestTab = tabs.find((t) => t.id === activeTabId);

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
    });

    useEffect(() => {
        if (editingCollectionId && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingCollectionId]);

    useEffect(() => {
        if (editingRequestId && requestInputRef.current) {
            requestInputRef.current.focus();
            requestInputRef.current.select();
        }
    }, [editingRequestId]);

    const startEditing = (collection: Collection, e?: Event) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        saveOnBlur.current = true;
        setEditingCollectionId(collection.id);
        setEditingName(collection.name);
    };

    const saveEdit = async (collectionId: string, nameOverride?: string) => {
        const nameToSave = nameOverride !== undefined ? nameOverride : editingName;
        if (nameOverride === undefined && !saveOnBlur.current) return;
        if (nameToSave.trim()) {
            await handleCollectionRename(collectionId, nameToSave.trim());
        }
        setEditingCollectionId(null);
        setEditingName("");
    };

    const startRequestEditing = (request: SavedRequest, e?: Event) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        saveRequestOnBlur.current = true;
        setEditingRequestId(request.id);
        setEditingName(request.name);
    };

    const saveRequestEdit = async (requestId: string, nameOverride?: string) => {
        const nameToSave = nameOverride !== undefined ? nameOverride : editingName;
        if (nameOverride === undefined && !saveRequestOnBlur.current) return;
        if (nameToSave.trim()) {
            await handleRequestRename(requestId, nameToSave.trim());
        }
        setEditingRequestId(null);
        setEditingName("");
    };

    const handleCollectionDragOver = (e: DragEvent, collectionId: string) => {
        if (draggedItem && draggedItem.type === "request") {
            e.preventDefault();
            e.stopPropagation();
            setDragOverCollectionId(collectionId);
        }
    };

    const handleCollectionDrop = async (e: DragEvent, targetCollectionId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverCollectionId(null);

        if (!draggedItem || draggedItem.type !== "request") return;

        const requestId = draggedItem.id;
        const sourceCollection = collections.find((col) => col.requests?.some((req) => req.id === requestId));
        if (sourceCollection?.id === targetCollectionId) return;

        await handleRequestMove(requestId, targetCollectionId, sourceCollection?.id);
    };

    if (collectionsLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <SpiderSpinner className="w-8 h-8 opacity-40" />
                <span className="text-[10px] uppercase tracking-widest opacity-20 mt-2 font-bold">Spinning...</span>
            </div>
        );
    }

    if (collections.length === 0) {
        return (
            <div className="text-center py-10 px-4">
                <div className="bg-base-200 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                </div>
                <p className="text-sm font-medium opacity-40">No collections</p>
            </div>
        );
    }

    return (
        <>
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
            />
            <div className="space-y-1">
                {Array.isArray(collections) && collections.map((collection) => (
                    <div key={collection.id} className="group/coll">
                        <details open className="group">
                            <summary
                                draggable={editingCollectionId !== collection.id}
                                onDragStart={(e) => handleDragStart(e, collection, "collection")}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => handleCollectionDragOver(e, collection.id)}
                                onDragLeave={() => setDragOverCollectionId(null)}
                                onDrop={(e) => handleCollectionDrop(e, collection.id)}
                                className={`list-none cursor-pointer p-2 rounded-lg transition-all duration-200 flex items-center gap-2 hover:bg-base-200/50 ${dragOverCollectionId === collection.id ? "bg-primary/10 border border-primary/30" : "border border-transparent"}`}
                            >
                                <div className="flex items-center gap-2 flex-1">
                                    <svg className="w-4 h-4 transition-transform duration-200 group-open:rotate-90 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    <div className={`w-6 h-6 rounded-md flex items-center justify-center ${dragOverCollectionId === collection.id ? "bg-primary text-white" : "bg-base-200 text-base-content/60"}`}>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                                    </div>
                                    {editingCollectionId === collection.id ? (
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            className="input input-ghost input-xs h-7 flex-1 font-medium bg-base-100/50 border-primary/30"
                                            value={editingName}
                                            onClick={(e) => e.stopPropagation()}
                                            onInput={(e) => setEditingName((e.target as HTMLInputElement).value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    saveOnBlur.current = false;
                                                    saveEdit(collection.id, (e.target as HTMLInputElement).value);
                                                } else if (e.key === "Escape") {
                                                    saveOnBlur.current = false;
                                                    setEditingCollectionId(null);
                                                }
                                            }}
                                            onBlur={() => {
                                                if (saveOnBlur.current) saveEdit(collection.id);
                                                saveOnBlur.current = true;
                                            }}
                                        />
                                    ) : (
                                        <span className="flex-1 text-sm font-semibold truncate" onDblClick={() => startEditing(collection)}>
                                            {collection.name}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover/coll:opacity-100 transition-opacity">
                                    <button className="btn btn-ghost btn-xs btn-square hover:text-primary" onClick={(e) => startEditing(collection, e as any)} title="Rename">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button className="btn btn-ghost btn-xs btn-square hover:text-error" onClick={(e) => {
                                        e.preventDefault(); e.stopPropagation();
                                        setConfirmModal({
                                            isOpen: true,
                                            title: "Delete Collection",
                                            message: `Are you sure you want to delete "${collection.name}"?`,
                                            onConfirm: () => handleCollectionDelete(collection.id),
                                        });
                                    }} title="Delete">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </summary>
                            <div className="pl-4 mt-1 space-y-0.5">
                                {collection.requests?.map((request) => (
                                    <div key={request.id} className="group/req">
                                        <div
                                            draggable={editingRequestId !== request.id}
                                            onDragStart={(e) => handleDragStart(e, request, "request")}
                                            onDragEnd={handleDragEnd}
                                            onClick={() => {
                                                if (editingRequestId === request.id) return;
                                                const existingTab = tabs.find((t) => t.savedRequestId === request.id);
                                                if (existingTab) {
                                                    setActiveTabId(existingTab.id);
                                                } else {
                                                    const newTab = mapRequestToTab(request, "request");
                                                    setTabs([...tabs, newTab]);
                                                    setActiveTabId(newTab.id);
                                                }
                                            }}
                                            className={`flex items-center gap-2 p-2 cursor-pointer rounded-lg transition-all ${activeRequestTab?.savedRequestId === request.id ? "bg-primary/15 border border-primary/20" : "hover:bg-base-200/40"}`}
                                        >
                                            {(request.method === "WEBSOCKET" || (request.request_type || request.requestType) === "websocket") && (
                                                <span className="text-[8px] font-black w-8 text-center py-0.5 rounded bg-purple-500/20 text-purple-500">
                                                    WS
                                                </span>
                                            )}
                                            {(request.method === "SOCKETIO" || (request.request_type || request.requestType) === "socketio") && (
                                                <span className="text-[8px] font-black w-8 text-center py-0.5 rounded bg-cyan-500/20 text-cyan-500">
                                                    SOCK
                                                </span>
                                            )}
                                            {((request.request_type || request.requestType) === "http" || !request.method) && (request.bodyType || request.body_type) === "graphql" && (
                                                <span className="text-[8px] font-black w-8 text-center py-0.5 rounded bg-pink-500/20 text-pink-500">
                                                    GQL
                                                </span>
                                            )}
                                            {request.method !== "WEBSOCKET" && request.method !== "SOCKETIO" && (request.request_type || request.requestType) !== "websocket" && (request.request_type || request.requestType) !== "socketio" && (request.bodyType || request.body_type) !== "graphql" && (
                                                <span className={`text-[8px] font-black w-8 text-center py-0.5 rounded ${getMethodColor(request.method).replace("badge", "bg")}/20 ${getMethodColor(request.method)}`}>
                                                    {request.method}
                                                </span>
                                            )}
                                            {editingRequestId === request.id ? (
                                                <input
                                                    ref={requestInputRef}
                                                    type="text"
                                                    className="input input-ghost input-xs h-6 flex-1 font-medium bg-base-100/50 border-primary/30 text-xs"
                                                    value={editingName}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onInput={(e) => setEditingName((e.target as HTMLInputElement).value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            saveRequestOnBlur.current = false;
                                                            saveRequestEdit(request.id, (e.target as HTMLInputElement).value);
                                                        } else if (e.key === "Escape") {
                                                            saveRequestOnBlur.current = false;
                                                            setEditingRequestId(null);
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        if (saveRequestOnBlur.current) saveRequestEdit(request.id);
                                                        saveRequestOnBlur.current = true;
                                                    }}
                                                />
                                            ) : (
                                                <span className="flex-1 text-xs truncate font-medium opacity-80">{request.name}</span>
                                            )}
                                            <div className="flex items-center gap-0.5 opacity-0 group-hover/req:opacity-100 transition-opacity">
                                                <button className="btn btn-ghost btn-xs btn-square h-6 w-6 min-h-0" onClick={(e) => startRequestEditing(request, e as any)} title="Rename">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button className="btn btn-ghost btn-xs btn-square h-6 w-6 min-h-0 hover:text-error" onClick={(e) => {
                                                    e.preventDefault(); e.stopPropagation();
                                                    setConfirmModal({
                                                        isOpen: true,
                                                        title: "Delete Request",
                                                        message: `Are you sure you want to delete "${request.name}"?`,
                                                        onConfirm: () => handleRequestDelete(request.id),
                                                    });
                                                }} title="Delete">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </details>
                    </div>
                ))}
            </div>
        </>
    );
}
