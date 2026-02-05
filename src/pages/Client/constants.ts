export const DEFAULT_HEADERS = {
    "Cache-Control": "no-cache",
    "Content-Length": "0",
    "User-Agent": "ApiSpider/1.0.0",
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
};

export const WEBSOCKET_HEADERS = {
    "Connection": "Upgrade",
    "Upgrade": "websocket",
    "Sec-WebSocket-Version": "13",
    "Sec-WebSocket-Extensions": "permessage-deflate; client_max_window_bits",
};

export const SOCKETIO_HEADERS = {
    "Connection": "Upgrade",
    "Upgrade": "websocket",
    "Sec-WebSocket-Version": "13",
    "Sec-WebSocket-Extensions": "permessage-deflate; client_max_window_bits",
};
