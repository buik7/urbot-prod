"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../types/Command"));
class HelpCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName("help")
            .setDescription("List all available commands");
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const description = `
      **Getting started**
      \`/daily\`: gain 30 gold every 6 hours
      \`/roll\`: roll a champion
      \`/link\`: Link your Riot Games account to Urbot
      \`/info\`: View every information about your account

      **Game commands**
      \`/shop\`: Buy a champion
      \`/shopitem\`: Buy an item
      \`/inventory\`: View all your purchased champions and items
      \`/equip\`: Equip a champion, or an item
      \`/fight\`: Fight other user
      \`/rankpoint\`: Rank users by points
      \`/rankbal\`: Rank users by balance

      **Teamfight Tactics**
      \`/tftrank\`: View your rank in TFT
      \`/tftlastgame\`: View your last game in TFT

      **League of Legends**
      \`/lolrank\`: View your rank in League of Legends
      \`/masteries\`: View your champion masteries in League of Legends
    `;
            const embed = new builders_1.EmbedBuilder()
                .setTitle("Available commands")
                .setDescription(description);
            yield interaction.reply({ embeds: [embed] });
        });
    }
}
exports.default = HelpCommand;
