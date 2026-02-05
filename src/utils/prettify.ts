export function prettifyJSON(content: string | object): string {
    try {
        const obj = typeof content === 'string' ? JSON.parse(content) : content;
        return JSON.stringify(obj, null, 2);
    } catch (error) {
        return typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    }
}

export function prettifyXML(xml: string): string {
    if (!xml || typeof xml !== 'string') {
        return xml;
    }

    try {
        let formatted = '';
        let indent = 0;
        const tab = '  ';

        xml = xml.replace(/>\s*</g, '><');

        xml.split(/(<[^>]+>)/g).forEach(node => {
            if (!node.trim()) return;

            if (node.match(/^<\/\w/)) {
                indent--;
            }

            if (node.startsWith('<')) {
                formatted += tab.repeat(Math.max(0, indent)) + node.trim() + '\n';
            } else {
                const trimmed = node.trim();
                if (trimmed) {
                    formatted += tab.repeat(Math.max(0, indent)) + trimmed + '\n';
                }
            }

            if (node.match(/^<\w[^>]*[^/]>$/)) {
                indent++;
            }
        });

        return formatted.trim();
    } catch (error) {
        return xml;
    }
}

export function prettifyHTML(html: string): string {
    if (!html || typeof html !== 'string') {
        return html;
    }

    try {
        let formatted = '';
        let indent = 0;
        const tab = '  ';
        const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
        const inlineTags = ['a', 'abbr', 'b', 'bdi', 'bdo', 'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd', 'mark', 'q', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var'];

        html = html.replace(/>\s+</g, '><');
        const tokens = html.match(/(<[^>]+>|[^<]+)/g) || [];

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (!token.trim()) continue;

            if (token.startsWith('<')) {
                const tagMatch = token.match(/<\/?(\w+)/);
                if (!tagMatch) {
                    formatted += token;
                    continue;
                }

                const tagName = tagMatch[1].toLowerCase();
                const isClosing = token.startsWith('</');
                const isSelfClosing = token.endsWith('/>') || selfClosingTags.includes(tagName);
                const isInline = inlineTags.includes(tagName);

                if (isClosing && !isInline) {
                    indent = Math.max(0, indent - 1);
                }

                if (isInline) {
                    formatted += token;
                } else {
                    formatted += tab.repeat(indent) + token.trim() + '\n';
                }

                if (!isClosing && !isSelfClosing && !isInline) {
                    indent++;
                }
            } else {
                const trimmed = token.trim();
                if (trimmed) {
                    const prevToken = i > 0 ? tokens[i - 1] : '';
                    const prevTagName = prevToken.match(/<(\w+)/)?.[1]?.toLowerCase();
                    const prevIsInline = prevTagName && inlineTags.includes(prevTagName);

                    if (prevIsInline) {
                        formatted += trimmed;
                    } else {
                        formatted += tab.repeat(indent) + trimmed + '\n';
                    }
                }
            }
        }

        return formatted.trim();
    } catch (error) {
        return html;
    }
}

export function prettify(content: any, type: string = 'auto'): string {
    if (!content) return '';

    const contentStr = typeof content === 'string' ? content : JSON.stringify(content, null, 2);

    if (type === 'json') {
        return prettifyJSON(content);
    } else if (type === 'xml') {
        return prettifyXML(contentStr);
    } else if (type === 'html' || type === 'markup') {
        return prettifyHTML(contentStr);
    } else if (type === 'auto') {
        const trimmed = contentStr.trim();
        if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
            (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
            try {
                return prettifyJSON(content);
            } catch (e) { }
        }

        if (trimmed.startsWith('<')) {
            if (trimmed.match(/^<\?xml/i) || !trimmed.match(/<html/i)) {
                return prettifyXML(contentStr);
            } else {
                return prettifyHTML(contentStr);
            }
        }
    }

    return contentStr;
}
