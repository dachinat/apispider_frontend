import MethodSelector from "../../../components/MethodSelector";
import CodeMirrorEditor from "../../../components/CodeMirrorEditor";
import { Endpoint, MockConfig } from "../types";

const METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"];

interface EndpointCardProps {
  endpoint: Endpoint;
  index: number;
  mockConfig: MockConfig | null;
  isOnly: boolean;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof Endpoint, value: any) => void;
}

export default function EndpointCard({
  endpoint,
  index,
  mockConfig,
  isOnly,
  onRemove,
  onChange,
}: EndpointCardProps) {
  return (
    <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm group/ep">
      <div className="p-4 bg-base-200/50 border-b border-base-300 flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center bg-base-100 border border-base-300 rounded-lg overflow-hidden focus-within:border-primary transition-all">
          <MethodSelector
            value={endpoint.method}
            onChange={(m) => onChange(index, "method", m)}
            methods={METHODS}
            showCustom={false}
          />
          <div className="flex-1 flex items-center px-4 gap-3">
            <span className="text-[10px] font-bold uppercase text-base-content/20 tracking-widest whitespace-nowrap">
              {mockConfig?.format === "subdomain" ? "PATH" : "MOCK PATH"}
            </span>
            <input
              type="text"
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 h-10 font-mono text-sm pl-0"
              placeholder="/users/:id"
              value={endpoint.path}
              onInput={(e: any) => onChange(index, "path", e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={() => onRemove(index)}
          className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10 rounded-lg opacity-0 group-hover/ep:opacity-100 transition-opacity"
          disabled={isOnly}
        >
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text font-bold text-xs uppercase tracking-wider opacity-60">
                  Status Code
                </span>
              </label>
              <input
                type="number"
                className="input input-bordered bg-base-100 border-base-300 rounded-lg focus:border-primary transition-all font-bold h-11"
                value={endpoint.response_code}
                onInput={(e: any) =>
                  onChange(index, "response_code", e.target.value)
                }
              />
            </div>
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text font-bold text-xs uppercase tracking-wider opacity-60">
                  Delay (ms)
                </span>
              </label>
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-base-content/30 tracking-widest uppercase">
                  <span>0ms</span>
                  <span className="text-primary font-bold">
                    {endpoint.delay}ms
                  </span>
                  <span>30s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30000"
                  step="100"
                  className="range range-primary range-xs"
                  value={endpoint.delay}
                  onChange={(e: any) =>
                    onChange(index, "delay", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="form-control">
            <label className="label pb-3">
              <span className="label-text font-bold text-xs uppercase tracking-wider opacity-60">
                Status Shortcuts
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[200, 201, 204, 400, 401, 403, 404, 500].map((code) => (
                <button
                  key={code}
                  onClick={() => onChange(index, "response_code", code)}
                  className={`btn btn-xs rounded-lg border h-8 px-3 font-bold transition-all ${endpoint.response_code === code ? "btn-primary shadow-sm" : "btn-ghost bg-base-200 border-base-300 hover:bg-base-300"}`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-control">
          <div className="flex items-center justify-between mb-2">
            <label className="label p-0">
              <span className="label-text font-bold text-xs uppercase tracking-wider opacity-60">
                Response Body
              </span>
            </label>
            <button
              className="text-[10px] font-bold uppercase tracking-wider text-primary hover:text-primary-focus transition-colors"
              onClick={() => {
                try {
                  const parsed = JSON.parse(endpoint.response_body);
                  onChange(
                    index,
                    "response_body",
                    JSON.stringify(parsed, null, 2),
                  );
                } catch (e) {
                  //showToast("Invalid JSON", "error");
                }
              }}
            >
              Format JSON
            </button>
          </div>
          <div className="border border-base-300 rounded-xl overflow-hidden h-64 shadow-sm bg-base-100">
            <CodeMirrorEditor
              value={endpoint.response_body}
              onChange={(val) => onChange(index, "response_body", val)}
              language="json"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
