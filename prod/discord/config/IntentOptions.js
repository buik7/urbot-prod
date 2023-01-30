"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentOptions = void 0;
const discord_js_1 = require("discord.js");
exports.IntentOptions = [
    discord_js_1.GatewayIntentBits.Guilds,
    discord_js_1.GatewayIntentBits.GuildMessages,
    discord_js_1.GatewayIntentBits.GuildMessageReactions,
];
