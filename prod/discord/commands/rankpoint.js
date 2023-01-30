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
const controller_1 = require("../../database/dtos/user/controller");
const Command_1 = __importDefault(require("../types/Command"));
class RankBalCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName("rankpoint")
            .setDescription("List top 5 users with highest points");
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const highestPointUsers = yield (0, controller_1.rankGuildUserByPoints)(interaction.guildId);
            if (!highestPointUsers || highestPointUsers.length === 0) {
                yield interaction.reply("All users have 0 point! Buy champions with `/shop` to earn points");
                return;
            }
            let ranking = " ";
            const rankIcons = [":first_place:", ":second_place:", ":third_place:"];
            for (let i = 0; i < Math.min(highestPointUsers.length, 5); i++) {
                let user = highestPointUsers[i];
                const pointString = user.gameId.points.toLocaleString();
                if (i < 3) {
                    ranking += `${rankIcons[i]} \`${pointString}\` - ${user.tag}\n`;
                }
                else {
                    ranking += `:small_blue_diamond: \`${pointString}\` - ${user.tag}\n`;
                }
            }
            const embed = new builders_1.EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle("Balance leaderboard")
                .setDescription(ranking);
            yield interaction.reply({ embeds: [embed] });
        });
    }
}
exports.default = RankBalCommand;
