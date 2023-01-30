"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DiscordEvent {
    constructor(client) {
        this.once = false;
        this.client = client;
    }
}
exports.default = DiscordEvent;
