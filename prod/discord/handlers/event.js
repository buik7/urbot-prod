"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const path_1 = __importDefault(require("path"));
const readFiles_1 = require("../utils/readFiles");
class EventHandler extends discord_js_1.Collection {
    constructor(client) {
        super();
        this.client = client;
        this.init();
    }
    getEventFiles() {
        const eventPath = path_1.default.join(__dirname, "..", "events");
        return (0, readFiles_1.readAllFilesInDirectory)(eventPath);
    }
    init() {
        this.getEventFiles().forEach((file) => {
            const eventClass = require(file).default;
            const event = new eventClass(this.client);
            this.set(event.name, event);
            if (event.once) {
                this.client.once(event.name, (...args) => event.execute(...args));
            }
            else {
                this.client.on(event.name, (...args) => event.execute(...args));
            }
        });
    }
}
exports.default = EventHandler;
