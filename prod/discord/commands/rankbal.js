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
            .setName("rankbal")
            .setDescription("List top 5 users with highest balance");
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const highestBalanceUsers = yield (0, controller_1.rankGuildUserByBalance)(interaction.guildId);
            if (!highestBalanceUsers || highestBalanceUsers.length === 0) {
                yield interaction.reply("All users have zero balance. Use `daily` to get some gold!");
                return;
            }
            let ranking = " ";
            const rankIcons = [":first_place:", ":second_place:", ":third_place:"];
            for (let i = 0; i < Math.min(highestBalanceUsers.length, 5); i++) {
                let user = highestBalanceUsers[i];
                const balanceString = user.gameId.balance.toLocaleString();
                if (i < 3) {
                    ranking += `${rankIcons[i]} \`${balanceString}\` - ${user.tag}\n`;
                }
                else {
                    ranking += `:small_blue_diamond: \`${balanceString}\` - ${user.tag}\n`;
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
