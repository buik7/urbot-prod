"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const path_1 = __importDefault(require("path"));
const secrets_1 = require("../config/secrets");
const readFiles_1 = require("../utils/readFiles");
class CommandHandler extends discord_js_1.Collection {
    constructor(client) {
        super();
        this.client = client;
        this.init();
    }
    getCommandFiles() {
        const commandPath = path_1.default.join(__dirname, "..", "commands");
        return (0, readFiles_1.readAllFilesInDirectory)(commandPath);
    }
    init() {
        this.getCommandFiles().forEach((file) => {
            const commandClass = require(file).default;
            const command = new commandClass(this.client);
            this.set(command.data.name, command);
        });
    }
    deployGlobalCommands() {
        const commands = this.map((c) => c.data.toJSON());
        const rest = new discord_js_1.REST({ version: "10" }).setToken(secrets_1.DISCORD_BOT_TOKEN);
        rest
            .put(discord_js_1.Routes.applicationCommands(secrets_1.DISCORD_BOT_CLIENT_ID), {
            body: commands,
        })
            .then(() => console.log("Successfully registered application commands"))
            .catch(console.error);
    }
    deployCommands() {
        const commands = this.map((c) => c.data.toJSON());
        const rest = new discord_js_1.REST({ version: "10" }).setToken(secrets_1.DISCORD_BOT_TOKEN);
        rest
            .put(discord_js_1.Routes.applicationGuildCommands(secrets_1.DISCORD_BOT_CLIENT_ID, secrets_1.DISCORD_BOT_GUILD_ID), { body: commands })
            .then(() => console.log("Successfully registered application commands"))
            .catch(console.error);
    }
}
exports.default = CommandHandler;
