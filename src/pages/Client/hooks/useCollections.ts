import { useState, useCallback, useEffect } from "preact/hooks";
import { collectionsAPI, requestsAPI } from "../../../services/api";
import { Collection } from "../types";

export const useCollections = (activeWorkspaceId: string | number | null) => {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [collectionsLoading, setCollectionsLoading] = useState(true);

    const loadCollections = useCallback(async () => {
        if (!activeWorkspaceId) return;
        setCollectionsLoading(true);
        try {
            const collectionsData = await collectionsAPI.getAll(String(activeWorkspaceId));
            const collectionsList = Array.isArray(collectionsData) ? collectionsData : [];

            // Fetch requests for each collection
            const collectionsWithRequests = await Promise.all(collectionsList.map(async (col) => {
                try {
                    const requests = await requestsAPI.getAll(String(col.id));
                    return { ...col, requests: Array.isArray(requests) ? requests : [] };
                } catch (err) {
                    console.warn(`Failed to fetch requests for collection ${col.id}`, err);
                    return { ...col, requests: [] };
                }
            }));

            setCollections(collectionsWithRequests);
        } catch (error) {
            console.error("Failed to load collections:", error);
            setCollections([]); // Set empty array on error
        } finally {
            setCollectionsLoading(false);
        }
    }, [activeWorkspaceId]);

    useEffect(() => {
        loadCollections();
    }, [loadCollections]);

    const handleCollectionRename = useCallback(async (id: string, newName: string) => {
        try {
            await collectionsAPI.update(id, { name: newName });
            setCollections(prev => prev.map(c => String(c.id) === String(id) ? { ...c, name: newName } : c));
            return true;
        } catch (error) {
            console.error("Failed to rename collection:", error);
            return false;
        }
    }, []);

    const handleCollectionDelete = useCallback(async (id: string) => {
        try {
            await collectionsAPI.delete(id);
            setCollections(prev => prev.filter(c => String(c.id) !== String(id)));
        } catch (error) {
            console.error("Failed to delete collection:", error);
        }
    }, []);

    const handleRequestRename = useCallback(async (requestId: string, newName: string) => {
        const collection = collections.find(c => c.requests?.some(r => String(r.id) === String(requestId)));
        const request = collection?.requests?.find(r => String(r.id) === String(requestId));

        if (!request || !collection) return false;

        try {
            await requestsAPI.update(requestId, {
                ...request,
                name: newName,
                collection_id: parseInt(String(collection.id), 10)
            });
            setCollections(prev => prev.map(c => ({
                ...c,
                requests: (c.requests || []).map(r => String(r.id) === String(requestId) ? { ...r, name: newName } : r)
            })));
            return true;
        } catch (error) {
            console.error("Failed to rename request:", error);
            return false;
        }
    }, [collections]);

    const handleRequestDelete = useCallback(async (requestId: string) => {
        try {
            await requestsAPI.delete(requestId);
            setCollections(prev => prev.map(c => ({
                ...c,
                requests: (c.requests || []).filter(r => String(r.id) !== String(requestId))
            })));
        } catch (error) {
            console.error("Failed to delete request:", error);
        }
    }, []);

    const handleAddCollection = useCallback(async (name: string) => {
        if (!activeWorkspaceId) return false;
        try {
            const workspaceId = typeof activeWorkspaceId === 'string'
                ? parseInt(activeWorkspaceId, 10)
                : activeWorkspaceId;
            const newCollection = await collectionsAPI.create({ name, workspace_id: workspaceId });
            setCollections(prev => [...prev, { ...newCollection, requests: [] }]);
            return true;
        } catch (error) {
            console.error("Failed to add collection:", error);
            return false;
        }
    }, [activeWorkspaceId]);

    const saveRequest = useCallback(async (requestId: string, data: any) => {
        const collection = collections.find(c => c.requests?.some(r => String(r.id) === String(requestId)));
        if (!collection) {
            console.error("Collection not found for request:", requestId);
            throw new Error("Collection not found");
        }

        try {
            // Merge existing request data with updates to ensure nothing is lost if partial data provided
            // And ensure collection_id is present
            const updatedRequest = await requestsAPI.update(requestId, {
                ...data,
                collection_id: parseInt(String(collection.id), 10)
            });

            setCollections(prev => prev.map(c => ({
                ...c,
                requests: (c.requests || []).map(r => String(r.id) === String(requestId) ? updatedRequest : r)
            })));
            return updatedRequest;
        } catch (error) {
            console.error("Failed to save request:", error);
            throw error;
        }
    }, [collections]);

    const saveRequestAs = useCallback(async (collectionId: string, data: any) => {
        try {
            const numericCollectionId = parseInt(collectionId, 10);
            const newRequest = await requestsAPI.create({ ...data, collection_id: numericCollectionId });
            setCollections(prev => prev.map(c => String(c.id) === String(collectionId)
                ? { ...c, requests: [...(c.requests || []), newRequest] }
                : c
            ));
            return newRequest;
        } catch (error) {
            console.error("Failed to save request as:", error);
            throw error;
        }
    }, []);

    const handleRequestMove = useCallback(async (requestId: string, targetCollectionId: string) => {
        const sourceCollection = collections.find(c => c.requests?.some(r => String(r.id) === String(requestId)));
        const request = sourceCollection?.requests?.find(r => String(r.id) === String(requestId));

        if (!request) return;

        try {
            const numericTargetId = parseInt(targetCollectionId, 10);
            await requestsAPI.update(requestId, {
                ...request,
                collection_id: numericTargetId
            });

            setCollections(prev => {
                let movedRequest: any = null;
                const newCollections = prev.map(c => {
                    const reqIndex = (c.requests || []).findIndex(r => String(r.id) === String(requestId));
                    if (reqIndex !== -1) {
                        movedRequest = c.requests![reqIndex];
                        return {
                            ...c,
                            requests: c.requests!.filter(r => String(r.id) !== String(requestId))
                        };
                    }
                    return c;
                });

                if (movedRequest) {
                    return newCollections.map(c => {
                        if (String(c.id) === String(targetCollectionId)) {
                            return {
                                ...c,
                                requests: [...(c.requests || []), { ...movedRequest, collection_id: numericTargetId }]
                            };
                        }
                        return c;
                    });
                }
                return prev;
            });
        } catch (error) {
            console.error("Failed to move request:", error);
        }
    }, [collections]);

    return {
        collections,
        collectionsLoading,
        loadCollections,
        handleCollectionRename,
        handleCollectionDelete,
        handleRequestRename,
        handleRequestDelete,
        handleAddCollection,
        handleRequestMove,
        saveRequest,
        saveRequestAs,
        setCollections,
    };
};
