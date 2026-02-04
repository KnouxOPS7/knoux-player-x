import { session } from "electron";

export const setupSecurity = () => {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                "Content-Security-Policy": [
                    "default-src 'self';",
                    "script-src 'self' 'unsafe-inline';",
                    "style-src 'self' 'unsafe-inline';",
                    "img-src 'self' data: https:;",
                    "font-src 'self' data:;",
                    "connect-src 'self' https://api.github.com;",
                    "media-src 'self' knoux:;"
                ].join(" ")
            }
        });
    });
};
