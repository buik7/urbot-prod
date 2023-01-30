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
const controller_1 = require("../../database/dtos/game/controller");
const controller_2 = require("../../database/dtos/inventory/controller");
const controller_3 = require("../../database/dtos/riotinfo/controller");
const controller_4 = require("../../database/dtos/user/controller");
const champion_1 = __importDefault(require("../../riot/api/tft/champion"));
const Command_1 = __importDefault(require("../types/Command"));
const date_1 = require("../utils/date");
class GameInfoCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName("info")
            .setDescription("View account balance, points, daily cooldown, equipped champion, item and linked League account");
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = {
                discordUserId: interaction.user.id,
                discordGuildId: interaction.guild.id,
            };
            const user = yield (0, controller_4.findDbUserById)(_id);
            if (!user) {
                yield interaction.reply("You don't have an account yet. Please use **`/daily`** to create an account.");
                return;
            }
            const userGame = yield (0, controller_1.findGameById)(user.gameId);
            if (!userGame) {
                yield this.displayError(interaction);
                return;
            }
            const now = new Date();
            let dailyCD = "None";
            if (userGame.dailyCooldown > now) {
                const waitingTime = userGame.dailyCooldown.getTime() - now.getTime();
                const { h, m, s } = (0, date_1.msToTime)(waitingTime);
                dailyCD = `${h} hours, ${m} minutes and ${s} seconds`;
            }
            let linkedLeagueAccountDescription = "None";
            if (user.riotInfoId) {
                const userRiotInfo = yield (0, controller_3.findRiotInfoById)(user.riotInfoId);
                if (userRiotInfo) {
                    linkedLeagueAccountDescription = `${userRiotInfo.summonerName} (${userRiotInfo.region})`;
                }
            }
            let mainChampionDescription = "None";
            let mainItemDescription = "None";
            if (userGame.inventoryId) {
                const inventory = yield (0, controller_2.findInventoryById)(userGame.inventoryId);
                if (inventory) {
                    if (inventory.mainChampion.name) {
                        const star = champion_1.default.getChampionStar(inventory.mainChampion.count);
                        mainChampionDescription = inventory.mainChampion.name;
                        for (let i = 0; i < star; i++) {
                            mainChampionDescription += " :star:";
                        }
                    }
                    if (inventory.mainItem.name) {
                        mainItemDescription = `${inventory.mainItem.discordIcon} ${inventory.mainItem.name}`;
                    }
                }
            }
            const embed = new builders_1.EmbedBuilder()
                .setTitle(`${interaction.user.username}'s profile`)
                .setColor(0x1abc9c)
                .addFields({
                name: "Balance",
                value: userGame.balance.toLocaleString(),
                inline: true,
            }, {
                name: "Points",
                value: userGame.points.toLocaleString(),
                inline: true,
            }, {
                name: "Equipped champion",
                value: mainChampionDescription,
                inline: true,
            }, {
                name: "Equipped item",
                value: mainItemDescription,
                inline: true,
            }, {
                name: "Daily cooldown",
                value: dailyCD,
            }, {
                name: "Linked League account",
                value: linkedLeagueAccountDescription,
            });
            yield interaction.reply({ embeds: [embed] });
        });
    }
    displayError(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            interaction.reply({
                content: "There was an error occured while execute this command. Please try again later",
                ephemeral: true,
            });
        });
    }
}
exports.default = GameInfoCommand;
