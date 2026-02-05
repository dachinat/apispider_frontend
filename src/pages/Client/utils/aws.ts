import CryptoJS from "crypto-js";

export function getSignatureKey(key: string, date: string, regionName: string, serviceName: string) {
    const kDate = CryptoJS.HmacSHA256(date, "AWS4" + key);
    const kRegion = CryptoJS.HmacSHA256(regionName, kDate);
    const kService = CryptoJS.HmacSHA256(serviceName, kRegion);
    const kSigning = CryptoJS.HmacSHA256("aws4_request", kService);
    return kSigning;
}

export function prepareAWSRequest(
    tab: any,
    finalUrl: string,
    headers: Record<string, string>,
    body: any,
    replaceVariables: (s: string) => string
) {
    const authData = tab.authData || {};
    const accessKey = replaceVariables(authData.awsAccessKey || "").trim();
    const secretKey = replaceVariables(authData.awsSecretKey || "").trim();
    const region = replaceVariables(authData.awsRegion || "us-east-1").trim();
    const service = replaceVariables(authData.awsService || "execute-api").trim();
    const sessionToken = replaceVariables(authData.awsSessionToken || "").trim();

    if (!accessKey || !secretKey) return headers;

    try {
        const url = new URL(finalUrl);
        const method = (tab.method || "GET").toUpperCase();
        const amzDate = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, "");
        const dateStamp = amzDate.substr(0, 8);

        const newHeaders = { ...headers };
        newHeaders["host"] = url.host;
        newHeaders["x-amz-date"] = amzDate;
        if (sessionToken) {
            newHeaders["x-amz-security-token"] = sessionToken;
        }

        // Canonical Headers
        const canonicalHeaders = Object.keys(newHeaders)
            .sort()
            .map(key => `${key.toLowerCase()}:${newHeaders[key].trim()}`)
            .join("\n") + "\n";

        // Signed Headers
        const signedHeaders = Object.keys(newHeaders)
            .sort()
            .map(key => key.toLowerCase())
            .join(";");

        // Payload Hash
        let payload = "";
        if (body) {
            payload = typeof body === "string" ? body : JSON.stringify(body);
        }
        const payloadHash = CryptoJS.SHA256(payload).toString(CryptoJS.enc.Hex);
        newHeaders["x-amz-content-sha256"] = payloadHash;

        // Canonical Query String
        const queryParams: string[] = [];
        url.searchParams.sort();
        url.searchParams.forEach((value, key) => {
            queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        });
        const canonicalQueryString = queryParams.join("&");

        // Canonical Request
        const canonicalRequest = [
            method,
            url.pathname || "/",
            canonicalQueryString,
            canonicalHeaders,
            signedHeaders,
            payloadHash
        ].join("\n");

        // String to Sign
        const algorithm = "AWS4-HMAC-SHA256";
        const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
        const stringToSign = [
            algorithm,
            amzDate,
            credentialScope,
            CryptoJS.SHA256(canonicalRequest).toString(CryptoJS.enc.Hex)
        ].join("\n");

        // Signature
        const signingKey = getSignatureKey(secretKey, dateStamp, region, service);
        const signature = CryptoJS.HmacSHA256(stringToSign, signingKey).toString(CryptoJS.enc.Hex);

        // Authorization Header
        newHeaders["Authorization"] = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

        return newHeaders;
    } catch (e) {
        console.error("AWS Signing Failed:", e);
        return headers;
    }
}
