import { ApiDocument } from "../types";

interface ApiDocsSidebarProps {
  width: number;
  docs: ApiDocument[];
  currentDocId: string | null;
  editingDocId: string | null;
  editingName: string;
  inputRef: any;
  onSelectDoc: (doc: ApiDocument) => void;
  onNewDoc: () => void;
  onStartEditing: (doc: ApiDocument, e?: any) => void;
  onSaveEdit: (docId: string, nameOverride?: string) => void;
  onCancelEdit: () => void;
  onDeleteClick: (doc: ApiDocument) => void;
  onInputChange: (name: string) => void;
  saveOnBlur: { current: boolean };
}

export default function ApiDocsSidebar({
  width,
  docs,
  currentDocId,
  editingDocId,
  editingName,
  inputRef,
  onSelectDoc,
  onNewDoc,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onDeleteClick,
  onInputChange,
  saveOnBlur,
}: ApiDocsSidebarProps) {
  return (
    <div
      className="border-r border-base-300 flex flex-col flex-shrink-0"
      style={{ width: `${width}px` }}
    >
      <div className="p-4 border-b border-base-300 flex justify-between items-center">
        <h2 className="font-bold text-lg">API Documentation</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {docs.length === 0 ? (
          <div className="p-8 text-center text-base-content/50">
            <p>No API docs found</p>
            <button onClick={onNewDoc} className="btn btn-primary btn-sm mt-4">
              Create First Doc
            </button>
          </div>
        ) : (
          <div className="divide-y divide-base-200">
            {docs.map((doc) => (
              <div key={doc.id} className="relative group">
                <div
                  onClick={() => onSelectDoc(doc)}
                  className={`w-full p-3.5 text-left transition-all duration-200 cursor-pointer flex items-center justify-between group/item relative overflow-hidden ${
                    currentDocId === doc.id
                      ? "bg-primary text-primary-content shadow-sm"
                      : "hover:bg-base-200 text-base-content/80 hover:text-base-content"
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-8">
                    {editingDocId === doc.id ? (
                      <input
                        ref={inputRef}
                        type="text"
                        className={`input input-ghost input-xs w-full font-bold p-0 h-auto focus:outline-none`}
                        value={editingName}
                        onClick={(e) => e.stopPropagation()}
                        onInput={(e: any) => onInputChange(e.target.value)}
                        onKeyDown={(e: any) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            saveOnBlur.current = false;
                            onSaveEdit(doc.id, e.target.value);
                          } else if (e.key === "Escape") {
                            e.preventDefault();
                            saveOnBlur.current = false;
                            onCancelEdit();
                          }
                        }}
                        onBlur={() => {
                          if (saveOnBlur.current) onSaveEdit(doc.id);
                          saveOnBlur.current = true;
                        }}
                      />
                    ) : (
                      <div
                        className="text-sm font-bold truncate transition-all group-hover/item:translate-x-0.5"
                        onDblClick={(e) => onStartEditing(doc, e)}
                      >
                        {doc.name}
                      </div>
                    )}
                    <div
                      className={`text-[10px] flex items-center mt-1 font-bold uppercase tracking-wider ${currentDocId === doc.id ? "text-primary-content/70" : "opacity-50"}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${doc.is_published ? (currentDocId === doc.id ? "bg-white" : "bg-success") : "bg-warning"}`}
                      ></span>
                      {doc.is_published ? "Live" : "Draft"}
                    </div>
                  </div>
                </div>

                {/* Hover Actions */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-base-100 rounded-md p-0.5 shadow-sm border border-base-300">
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs btn-square hover:text-primary transition-colors h-7 w-7 min-h-0"
                    onClick={(e) => onStartEditing(doc, e)}
                    title="Rename"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs btn-square hover:text-error transition-colors h-7 w-7 min-h-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteClick(doc);
                    }}
                    title="Delete"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
