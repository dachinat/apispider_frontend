import { useState } from "preact/hooks";
import MethodSelector from "./MethodSelector";
import URLInput from "./URLInput";
import ParamsTable from "./ParamsTable";
import HeadersTable from "./HeadersTable";
import FormDataTable from "./FormDataTable";
import URLEncodedTable from "./URLEncodedTable";
import CodeMirrorEditor from "./CodeMirrorEditor";
import GraphQLEditor from "./GraphQLEditor";
import BinaryBodyEditor from "./BinaryBodyEditor";
import SpiderSpinner from "./SpiderSpinner";
import { useEnvironment } from "../context/EnvironmentContext";
import { Tab } from "../pages/Client/types";

interface HttpRequestPanelProps {
    currentTab: Tab;
    isLoading: boolean;
    methods: string[];
    updateCurrentTab: (updates: Partial<Tab>) => void;
    parseUrlParams: (url: string) => Record<string, string>;
    buildUrlWithParams: (url: string, params: Record<string, string>) => string;
    handleSendRequest: () => void;
    generateHTTPPreview?: () => string;
    debouncedUpdateBodyJson?: (value: string) => void;
    debouncedUpdateBodyXml?: (value: string) => void;
    debouncedUpdateBodyText?: (value: string) => void;
}

export default function HttpRequestPanel({
    currentTab,
    isLoading,
    methods,
    updateCurrentTab,
    parseUrlParams,
    buildUrlWithParams,
    handleSendRequest,
    generateHTTPPreview,
    debouncedUpdateBodyJson,
    debouncedUpdateBodyXml,
    debouncedUpdateBodyText,
}: HttpRequestPanelProps) {
    const { replaceVariables } = useEnvironment();
    const [showToken, setShowToken] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!isLoading && currentTab?.url) {
                        handleSendRequest();
                    }
                }}
                className="overflow-hidden flex gap-0 rounded-lg border border-base-300 shadow-sm hover:shadow-md transition-all duration-200 focus-within:border-primary"
            >
                <MethodSelector
                    value={currentTab?.method || "GET"}
                    onChange={(method) => updateCurrentTab({ method, saved: false })}
                    methods={methods}
                />
                <URLInput
                    className="input flex-1 border-0 rounded-none focus:outline-none bg-base-100"
                    placeholder="Enter request URL — https:// is added if missing"
                    value={currentTab?.url || ""}
                    requestType="http"
                    onChange={(e) => {
                        const newUrl = (e.target as HTMLInputElement).value;
                        const parsedParams = parseUrlParams(newUrl);
                        updateCurrentTab({ url: newUrl, params: parsedParams, saved: false });
                    }}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="btn btn-primary border-0 rounded-none shadow-none hover:shadow-none transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                    disabled={isLoading || (currentTab?.requestType === "http" && !currentTab?.url)}
                >
                    {isLoading ? (
                        <>
                            <SpiderSpinner className="w-5 h-5 mr-2" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                            Send
                        </>
                    )}
                </button>
            </form>

            <div className="tabs tabs-bordered mt-4 flex">
                <div className="flex-1 flex">
                    <button
                        className={`tab ${currentTab?.activeTab === "params" ? "tab-active !border-b-primary !border-b-2" : ""}`}
                        onClick={() => updateCurrentTab({ activeTab: "params" })}
                    >
                        Params
                        {currentTab?.params && Object.keys(currentTab.params).length > 0 && (
                            <span className="ml-1 opacity-60">({Object.keys(currentTab.params).length})</span>
                        )}
                    </button>
                    <button
                        className={`tab ${currentTab?.activeTab === "authorization" ? "tab-active !border-b-primary !border-b-2" : ""}`}
                        onClick={() => updateCurrentTab({ activeTab: "authorization" })}
                    >
                        Authorization
                    </button>
                    <button
                        className={`tab ${currentTab?.activeTab === "headers" ? "tab-active !border-b-primary !border-b-2" : ""}`}
                        onClick={() => updateCurrentTab({ activeTab: "headers" })}
                    >
                        Headers
                        {currentTab?.headers && Object.keys(currentTab.headers).length > 0 && (
                            <span className="ml-1 opacity-60">({Object.keys(currentTab.headers).length})</span>
                        )}
                    </button>
                    <button
                        className={`tab ${currentTab?.activeTab === "body" ? "tab-active !border-b-primary !border-b-2" : ""}`}
                        onClick={() => updateCurrentTab({ activeTab: "body" })}
                    >
                        Body
                    </button>
                </div>

                <button
                    className={`tab ${currentTab?.activeTab === "code" ? "tab-active !border-b-primary !border-b-2" : ""}`}
                    onClick={() => updateCurrentTab({ activeTab: "code" })}
                    title="HTTP Code Preview"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Preview
                </button>
            </div>

            <div className="mt-4 bg-base-100 rounded-lg border border-base-300 overflow-visible">
                {currentTab?.activeTab === "params" && (
                    <ParamsTable
                        key={currentTab.id}
                        params={currentTab?.params || {}}
                        onChange={(newParams) => {
                            const baseUrl = currentTab?.url?.split("?")[0] || "";
                            const newUrl = buildUrlWithParams(baseUrl, newParams);
                            updateCurrentTab({ params: newParams, url: newUrl, saved: false });
                        }}
                    />
                )}
                {currentTab?.activeTab === "authorization" && (
                    <div className="p-4">
                        <div className="form-control w-full max-w-xs">
                            <label className="label"><span className="label-text">Auth Type</span></label>
                            <select
                                className="select select-bordered"
                                value={currentTab?.authType || "none"}
                                onChange={(e) => updateCurrentTab({ authType: (e.target as HTMLSelectElement).value, saved: false })}
                            >
                                <option value="none">No Auth</option>
                                <option value="bearer">Bearer Token</option>
                                <option value="basic">Basic Auth</option>
                                <option value="api-key">API Key</option>
                                <option value="oauth2">OAuth 2.0</option>
                                <option value="hawk">Hawk Authentication</option>
                                <option value="aws">AWS Signature</option>
                            </select>
                        </div>

                        {currentTab?.authType === "bearer" && (
                            <div className="form-control w-full mt-4">
                                <label className="label pt-0"><span className="label-text text-xs opacity-60">Token</span></label>
                                <div className="relative">
                                    <input
                                        type={showToken ? "text" : "password"}
                                        className="input input-bordered w-full pr-10 h-10 text-sm"
                                        placeholder="Enter bearer token"
                                        value={currentTab?.authData?.token || ""}
                                        onInput={(e) => updateCurrentTab({ authData: { ...currentTab.authData, token: (e.target as HTMLInputElement).value }, saved: false })}
                                    />
                                    <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:text-primary transition-colors" onClick={() => setShowToken(!showToken)}>
                                        {showToken ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentTab?.authType === "basic" && (
                            <div className="flex flex-col gap-3 mt-4">
                                <div className="form-control w-full">
                                    <label className="label pt-0"><span className="label-text text-xs opacity-60">Username</span></label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full h-10 text-sm"
                                        placeholder="Username"
                                        value={currentTab?.authData?.username || ""}
                                        onInput={(e) => updateCurrentTab({ authData: { ...currentTab.authData, username: (e.target as HTMLInputElement).value }, saved: false })}
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label pt-0"><span className="label-text text-xs opacity-60">Password</span></label>
                                    <input
                                        type="password"
                                        className="input input-bordered w-full h-10 text-sm"
                                        placeholder="Password"
                                        value={currentTab?.authData?.password || ""}
                                        onInput={(e) => updateCurrentTab({ authData: { ...currentTab.authData, password: (e.target as HTMLInputElement).value }, saved: false })}
                                    />
                                </div>
                            </div>
                        )}

                        {currentTab?.authType === "api-key" && (
                            <div className="flex flex-col gap-3 mt-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="form-control w-full">
                                        <label className="label pt-0"><span className="label-text text-xs opacity-60">Key</span></label>
                                        <input
                                            type="text"
                                            className="input input-bordered w-full h-10 text-sm"
                                            placeholder="e.g. X-API-Key"
                                            value={currentTab?.authData?.key || ""}
                                            onInput={(e) => updateCurrentTab({ authData: { ...currentTab.authData, key: (e.target as HTMLInputElement).value }, saved: false })}
                                        />
                                    </div>
                                    <div className="form-control w-full">
                                        <label className="label pt-0"><span className="label-text text-xs opacity-60">Value</span></label>
                                        <input
                                            type="text"
                                            className="input input-bordered w-full h-10 text-sm"
                                            placeholder="Value"
                                            value={currentTab?.authData?.value || ""}
                                            onInput={(e) => updateCurrentTab({ authData: { ...currentTab.authData, value: (e.target as HTMLInputElement).value }, saved: false })}
                                        />
                                    </div>
                                </div>
                                <div className="form-control w-full">
                                    <label className="label pt-0"><span className="label-text text-xs opacity-60">Add to</span></label>
                                    <select
                                        className="select select-bordered select-sm h-10 text-sm"
                                        value={currentTab?.authData?.addTo || "header"}
                                        onChange={(e) => updateCurrentTab({ authData: { ...currentTab.authData, addTo: (e.target as HTMLSelectElement).value }, saved: false })}
                                    >
                                        <option value="header">Header</option>
                                        <option value="query">Query Params</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {currentTab?.authType === "oauth2" && (
                            <div className="flex flex-col gap-3 mt-4">
                                <div className="form-control w-full">
                                    <label className="label pt-0"><span className="label-text text-xs opacity-60">Access Token</span></label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full h-10 text-sm"
                                        placeholder="Paste token here"
                                        value={currentTab?.authData?.accessToken || ""}
                                        onInput={(e) => updateCurrentTab({ authData: { ...currentTab.authData, accessToken: (e.target as HTMLInputElement).value }, saved: false })}
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label pt-0"><span className="label-text text-xs opacity-60">Header Prefix</span></label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full h-10 text-sm"
                                        placeholder="Bearer"
                                        value={currentTab?.authData?.tokenType || ""}
                                        onInput={(e) => updateCurrentTab({ authData: { ...currentTab.authData, tokenType: (e.target as HTMLInputElement).value }, saved: false })}
                                    />
                                </div>
                            </div>
                        )}

                        {currentTab?.authType === "aws" && (
                            <div className="flex flex-col gap-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="form-control w-full">
                                        <label className="label pt-0"><span className="label-text text-xs font-bold opacity-60 uppercase tracking-tight">Access Key</span></label>
                                        <input
                                            type="text"
                                            className="input input-bordered w-full h-10 text-sm focus:border-primary transition-all rounded-lg"
                                            placeholder="AWS Access Key"
                                            value={currentTab?.authData?.awsAccessKey || ""}
                                            onInput={(e) => updateCurrentTab({ authData: { ...currentTab.authData, awsAccessKey: (e.target as HTMLInputElement).value }, saved: false })}
                                        />
                                    </div>
                                    <div className="form-control w-full">
                                        <label className="label pt-0"><span className="label-text text-xs font-bold opacity-60 uppercase tracking-tight">Secret Key</span></label>
                                        <input
                                            type="password"
                                            className="input input-bordered w-full h-10 text-sm focus:border-primary transition-all rounded-lg"
                                            placeholder="AWS Secret Key"
                                            value={currentTab?.authData?.awsSecretKey || ""}
                                            onInput={(e) => updateCurrentTab({ authData: { ...currentTab.authData, awsSecretKey: (e.target as HTMLInputElement).value }, saved: false })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="form-control w-full">
                                        <label className="label pt-0"><span className="label-text text-xs font-bold opacity-60 uppercase tracking-tight">AWS Region</span></label>
                                        <input
                                            type="text"
                                            className="input input-bordered w-full h-10 text-sm focus:border-primary transition-all rounded-lg"
                                            placeholder="e.g. us-east-1"
                                            value={currentTab?.authData?.awsRegion || ""}
                                            onInput={(e) => updateCurrentTab({ authData: { ...currentTab.authData, awsRegion: (e.target as HTMLInputElement).value }, saved: false })}
                                        />
                                    </div>
                                    <div className="form-control w-full">
                                        <label className="label pt-0"><span className="label-text text-xs font-bold opacity-60 uppercase tracking-tight">Service Name</span></label>
                                        <input
                                            type="text"
                                            className="input input-bordered w-full h-10 text-sm focus:border-primary transition-all rounded-lg"
                                            placeholder="e.g. execute-api"
                                            value={currentTab?.authData?.awsService || ""}
                                            onInput={(e) => updateCurrentTab({ authData: { ...currentTab.authData, awsService: (e.target as HTMLInputElement).value }, saved: false })}
                                        />
                                    </div>
                                </div>
                                <div className="form-control w-full">
                                    <label className="label pt-0"><span className="label-text text-xs font-bold opacity-60 uppercase tracking-tight">Session Token (Optional)</span></label>
                                    <input
                                        type="password"
                                        className="input input-bordered w-full h-10 text-sm focus:border-primary transition-all rounded-lg"
                                        placeholder="AWS Session Token"
                                        value={currentTab?.authData?.awsSessionToken || ""}
                                        onInput={(e) => updateCurrentTab({ authData: { ...currentTab.authData, awsSessionToken: (e.target as HTMLInputElement).value }, saved: false })}
                                    />
                                </div>
                                <div className="mt-2 p-3 bg-base-200 rounded-lg border border-base-300">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-primary mb-1">AWS SigV4 Info</p>
                                    <p className="text-xs opacity-60 leading-relaxed">
                                        Authentication will be calculating using HMAC-SHA256 signature version 4. Headers like <code className="bg-base-300 px-1 rounded">X-Amz-Date</code> will be automatically added during request execution.
                                    </p>
                                </div>
                            </div>
                        )}

                        {currentTab?.authType === "hawk" && (
                            <div className="mt-4 p-4 rounded-lg bg-base-200 border border-base-300">
                                <p className="text-sm font-medium text-warning flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    Coming Soon
                                </p>
                                <p className="text-xs opacity-50 mt-1">HAWK authentication is currently being implemented.</p>
                            </div>
                        )}

                        {currentTab?.authType === "none" && <div className="mt-4 text-sm opacity-50 text-center py-8 border-2 border-dashed border-base-300 rounded-xl">This request does not use any authentication.</div>}
                    </div>
                )}

                {currentTab?.activeTab === "headers" && (
                    <HeadersTable
                        key={currentTab.id}
                        headers={currentTab?.headers || {}}
                        onChange={(newHeaders) => updateCurrentTab({ headers: newHeaders, saved: false })}
                    />
                )}

                {currentTab?.activeTab === "body" && (
                    <div className="flex flex-col h-full">
                        <div className="flex gap-2 p-3 border-b border-base-300 overflow-x-auto no-scrollbar">
                            {["none", "form-data", "urlencoded", "json", "xml", "text", "binary", "graphql"].map((type) => (
                                <button
                                    key={type}
                                    className={`btn btn-xs gap-1 ${currentTab?.bodyType === type ? "btn-primary" : "btn-outline"}`}
                                    onClick={() => updateCurrentTab({ bodyType: type as any, saved: false })}
                                >
                                    {type === "urlencoded" ? "x-www-form-urlencoded" : type}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 p-4">
                            {currentTab?.bodyType === "none" && (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-sm opacity-50">This request does not have a body</p>
                                </div>
                            )}

                            {currentTab?.bodyType === "form-data" && (
                                <FormDataTable
                                    key={currentTab.id}
                                    formData={currentTab?.formData || []}
                                    onChange={(newFormData) => updateCurrentTab({ formData: newFormData, saved: false })}
                                />
                            )}

                            {currentTab?.bodyType === "urlencoded" && (
                                <URLEncodedTable
                                    key={currentTab.id}
                                    urlEncodedData={currentTab?.urlEncodedData || {}}
                                    onChange={(newData) => updateCurrentTab({ urlEncodedData: newData, saved: false })}
                                />
                            )}

                            {currentTab?.bodyType === "json" && (
                                <CodeMirrorEditor
                                    key={`${currentTab.id}-json`}
                                    value={currentTab?.bodyJson || ""}
                                    onChange={debouncedUpdateBodyJson}
                                    language="json"
                                    placeholder='{"key": "value"}'
                                />
                            )}

                            {currentTab?.bodyType === "xml" && (
                                <CodeMirrorEditor
                                    key={`${currentTab.id}-xml`}
                                    value={currentTab?.bodyXml || ""}
                                    onChange={debouncedUpdateBodyXml}
                                    language="xml"
                                    placeholder='<?xml version="1.0"?><root><item>value</item></root>'
                                />
                            )}

                            {currentTab?.bodyType === "text" && (
                                <CodeMirrorEditor
                                    key={`${currentTab.id}-text`}
                                    value={currentTab?.bodyText || ""}
                                    onChange={debouncedUpdateBodyText}
                                    language="text"
                                    placeholder="Enter plain text..."
                                />
                            )}

                            {currentTab?.bodyType === "binary" && (
                                <BinaryBodyEditor
                                    file={currentTab?.binaryFile}
                                    onChange={(file) => updateCurrentTab({ binaryFile: file, saved: false })}
                                />
                            )}

                            {currentTab?.bodyType === "graphql" && (
                                <GraphQLEditor
                                    key={`graphql-editor-${currentTab.id}`}
                                    tabId={currentTab.id}
                                    query={currentTab?.bodyGraphQLQuery || ""}
                                    variables={currentTab?.bodyGraphQLVariables || ""}
                                    onQueryChange={(value) => updateCurrentTab({ bodyGraphQLQuery: value, saved: false })}
                                    onVariablesChange={(value) => updateCurrentTab({ bodyGraphQLVariables: value, saved: false })}
                                />
                            )}
                        </div>
                    </div>
                )}

                {currentTab?.activeTab === "code" && (
                    <div className="p-4">
                        <CodeMirrorEditor
                            readOnly
                            value={generateHTTPPreview ? generateHTTPPreview() : ""}
                            language="javascript"
                        />
                    </div>
                )}
            </div>
        </>
    );
}
