"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const IntentOptions_1 = require("./config/IntentOptions");
const secrets_1 = require("./config/secrets");
const command_1 = __importDefault(require("./handlers/command"));
const event_1 = __importDefault(require("./handlers/event"));
class DiscordClient extends discord_js_1.Client {
    constructor() {
        super({ intents: IntentOptions_1.IntentOptions });
        this.events = new event_1.default(this);
        this.commands = new command_1.default(this);
        this.login(secrets_1.DISCORD_BOT_TOKEN);
    }
}
exports.default = DiscordClient;
