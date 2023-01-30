"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DISCORD_BOT_CLIENT_ID = exports.DISCORD_BOT_GUILD_ID = exports.DISCORD_BOT_TOKEN = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
exports.DISCORD_BOT_GUILD_ID = process.env.DISCORD_BOT_GUILD_ID;
exports.DISCORD_BOT_CLIENT_ID = process.env
    .DISCORD_BOT_CLIENT_ID;
