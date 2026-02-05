import { Tab } from "../types";
import { prepareAWSRequest } from "./aws";

export function generateHTTPPreview(
    currentTab: Tab,
    prepareHttpRequest: (tab: Tab) => { finalUrl: string; headers: Record<string, string> },
    replaceVariables: (text: string) => string
): string {
    if (!currentTab || currentTab.requestType !== "http") return "";

    try {
        const { finalUrl, headers: baseHeaders } = prepareHttpRequest(currentTab);
        const method = currentTab.method || "GET";
        const headers = { ...baseHeaders };

        let snippet = `// HTTP Request Preview\n`;
        let bodyCode = "";
        let contentType = "";

        // Handle different body types
        if (method !== "GET" && method !== "HEAD") {
            switch (currentTab.bodyType) {
                case "json":
                    contentType = "application/json";
                    const jsonBody = currentTab.bodyJson || "";
                    try {
                        const parsed = JSON.parse(jsonBody);
                        bodyCode = `JSON.stringify(${JSON.stringify(parsed, null, 2).replace(/\n/g, "\n  ") || "{}"})`;
                    } catch {
                        bodyCode = `JSON.stringify(${jsonBody})`;
                    }
                    break;
                case "urlencoded":
                    contentType = "application/x-www-form-urlencoded";
                    snippet += `const params = new URLSearchParams();\n`;
                    Object.entries(currentTab.urlEncodedData || {}).forEach(([k, v]) => {
                        snippet += `params.append("${replaceVariables(k)}", "${replaceVariables(v)}");\n`;
                    });
                    bodyCode = `params`;
                    break;
                case "form-data":
                    // Fetch automatically sets content-type for FormData
                    snippet += `const formData = new FormData();\n`;
                    (currentTab.formData || []).forEach(item => {
                        if (item.type === "text") {
                            snippet += `formData.append("${replaceVariables(item.key)}", "${replaceVariables(item.value)}");\n`;
                        } else {
                            snippet += `// formData.append("${replaceVariables(item.key)}", fileInput.files[0]); // File uploads require a File object\n`;
                        }
                    });
                    bodyCode = `formData`;
                    break;
                case "xml":
                    contentType = "application/xml";
                    bodyCode = `\`${(currentTab.bodyXml || "").replace(/`/g, "\\`").replace(/\${/g, "\\${")}\``;
                    break;
                case "text":
                    contentType = "text/plain";
                    bodyCode = `\`${(currentTab.bodyText || "").replace(/`/g, "\\`").replace(/\${/g, "\\${")}\``;
                    break;
                case "graphql":
                    contentType = "application/json";
                    bodyCode = `JSON.stringify({\n  query: \`${(currentTab.bodyGraphQLQuery || "").replace(/`/g, "\\`").replace(/\${/g, "\\${")}\`,\n  variables: ${currentTab.bodyGraphQLVariables || "{}"}\n})`;
                    break;
                case "binary":
                    contentType = "application/octet-stream";
                    bodyCode = `// binary file content here (e.g. from File API)`;
                    break;
            }
        }

        if (contentType && !headers["Content-Type"]) {
            headers["Content-Type"] = contentType;
        }

        // Apply AWS Signature if needed
        let finalHeaders = { ...headers };
        if (currentTab.authType === "aws") {
            // we estimate the body for preview
            let estBody = "";
            if (currentTab.bodyType === "json") estBody = currentTab.bodyJson || "";
            else if (currentTab.bodyType === "text") estBody = currentTab.bodyText || "";
            else if (currentTab.bodyType === "xml") estBody = currentTab.bodyXml || "";
            else if (currentTab.bodyType === "graphql") estBody = JSON.stringify({ query: currentTab.bodyGraphQLQuery, variables: JSON.parse(currentTab.bodyGraphQLVariables || "{}") });

            finalHeaders = prepareAWSRequest(
                currentTab,
                finalUrl,
                headers,
                estBody,
                replaceVariables
            );
        }

        snippet += `fetch("${finalUrl}", {\n`;
        snippet += `  method: "${method}",\n`;

        if (Object.keys(finalHeaders).length > 0) {
            snippet += `  headers: ${JSON.stringify(finalHeaders, null, 2).replace(/\n/g, "\n  ")},\n`;
        }

        if (bodyCode) {
            snippet += `  body: ${bodyCode}\n`;
        }

        snippet += `})\n.then(response => response.json())\n.then(data => console.log(data))\n.catch(error => console.error(error));`;

        return snippet;
    } catch (e) {
        return `// Error generating preview: ${e instanceof Error ? e.message : String(e)}`;
    }
}
