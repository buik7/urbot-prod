"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmojiEncoding = void 0;
const getEmojiEncoding = (emoji) => {
    return `<:${emoji.name}:${emoji.id}>`;
};
exports.getEmojiEncoding = getEmojiEncoding;
