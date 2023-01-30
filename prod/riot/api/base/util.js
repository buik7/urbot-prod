"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrlFromOptions = exports.waiter = void 0;
function waiter(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
exports.waiter = waiter;
function getUrlFromOptions(options) {
    let uri = options.url;
    if (!uri)
        throw new Error("Url not found");
    if (options.params) {
        uri += "?";
        uri += new URLSearchParams(options.params).toString();
    }
    return uri;
}
exports.getUrlFromOptions = getUrlFromOptions;
