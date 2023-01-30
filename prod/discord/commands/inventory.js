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
const controller_3 = require("../../database/dtos/user/controller");
const constants_1 = require("../../riot/constants");
const Command_1 = __importDefault(require("../types/Command"));
var ButtonIds;
(function (ButtonIds) {
    ButtonIds["prev_page"] = "prev_page";
    ButtonIds["next_page"] = "next_page";
})(ButtonIds || (ButtonIds = {}));
class InventoryCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName("inventory")
            .setDescription("List all champions and items in your inventory");
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = {
                discordUserId: interaction.user.id,
                discordGuildId: interaction.guild.id,
            };
            const user = yield (0, controller_3.findDbUserById)(_id);
            if (!user) {
                yield interaction.reply("You do not have an account. Use `/daily` to create one");
                return;
            }
            const userGame = yield (0, controller_1.findGameById)(user.gameId);
            if (!userGame) {
                yield this.displayError(interaction);
                return;
            }
            if (!userGame.inventoryId) {
                yield this.displayEmptyInventoryError(interaction);
                return;
            }
            const userInventory = yield (0, controller_2.findInventoryById)(userGame.inventoryId);
            if (!userInventory) {
                yield this.displayError(interaction);
                return;
            }
            if (userInventory.champions.length === 0 &&
                userInventory.items.length === 0) {
                yield this.displayEmptyInventoryError(interaction);
                return;
            }
            if (userInventory.champions.length === 0) {
                const embed = new builders_1.EmbedBuilder()
                    .setColor(0xe74c3c)
                    .setTitle(`${interaction.user.username}'s inventory (includes ${userInventory.items.length} items)`)
                    .setDescription(`**Items:**\n ${this.renderInventoryItems(userInventory.items)}`);
                yield interaction.reply({ embeds: [embed] });
                return;
            }
            const itemsPerPage = 10;
            const champions = userInventory.champions;
            const championCount = champions.length;
            const items = userInventory.items;
            const totalPages = Math.ceil(championCount / itemsPerPage);
            let currentPage = 1;
            const buttonActionRows = new builders_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                .setCustomId(ButtonIds.prev_page)
                .setStyle(discord_js_1.ButtonStyle.Secondary)
                .setLabel("Prev")
                .setDisabled(true), new discord_js_1.ButtonBuilder()
                .setCustomId(ButtonIds.next_page)
                .setStyle(discord_js_1.ButtonStyle.Secondary)
                .setLabel("Next")
                .setDisabled(currentPage === totalPages));
            const inventoryEmbed = yield interaction.reply({
                embeds: [
                    this.renderEmbed(interaction, currentPage, itemsPerPage, champions, items),
                ],
                components: [buttonActionRows],
                fetchReply: true,
            });
            const collector = inventoryEmbed.createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id &&
                    i.message.id === inventoryEmbed.id &&
                    (i.customId === ButtonIds.next_page ||
                        i.customId === ButtonIds.prev_page),
                time: 100000,
            });
            collector.on("collect", (buttonInteraction) => __awaiter(this, void 0, void 0, function* () {
                if (!buttonInteraction.deferred) {
                    yield buttonInteraction.deferUpdate();
                }
                if (buttonInteraction.customId === ButtonIds.prev_page)
                    currentPage--;
                if (buttonInteraction.customId === ButtonIds.next_page)
                    currentPage++;
                buttonActionRows.components[0].setDisabled(currentPage === 1);
                buttonActionRows.components[1].setDisabled(currentPage === totalPages);
                yield interaction.editReply({
                    embeds: [
                        this.renderEmbed(interaction, currentPage, itemsPerPage, champions, items),
                    ],
                    components: [buttonActionRows],
                });
            }));
            collector.on("end", () => __awaiter(this, void 0, void 0, function* () {
                buttonActionRows.components[0].setDisabled(true);
                buttonActionRows.components[1].setDisabled(true);
                yield interaction.editReply({
                    embeds: [
                        this.renderEmbed(interaction, currentPage, itemsPerPage, champions, items),
                    ],
                    components: [buttonActionRows],
                });
            }));
        });
    }
    renderEmbed(interaction, currentPage, itemsPerPage, champions, items) {
        const championCount = champions.length;
        let totalCount = 0;
        let threeStarCount = 0;
        let twoStarCount = 0;
        let oneStarCount = 0;
        for (let { count } of champions) {
            threeStarCount += Math.floor(count / 9);
            twoStarCount += Math.floor((count % 9) / 3);
            oneStarCount += count % 3;
            totalCount += count;
        }
        const totalPages = Math.ceil(championCount / itemsPerPage);
        return new builders_1.EmbedBuilder()
            .setColor(0xe74c3c)
            .setTitle(`${interaction.user.username}'s inventory \n` +
            `(Includes ${items.length} items and ${totalCount} copies of ${championCount} different champions)`)
            .addFields({
            name: ":star: :star: :star:",
            value: threeStarCount.toString(),
            inline: true,
        }, {
            name: ":star: :star:",
            value: twoStarCount.toString(),
            inline: true,
        }, {
            name: ":star:",
            value: oneStarCount.toString(),
            inline: true,
        })
            .setDescription(this.renderEmbedContent(currentPage, itemsPerPage, champions, items))
            .setFooter({ text: `Page ${currentPage} of ${totalPages}` });
    }
    renderEmbedContent(currentPage, itemsPerPage, champions, items) {
        let startIndex = (currentPage - 1) * itemsPerPage;
        let endIndex = Math.min(startIndex + itemsPerPage, champions.length);
        let pageChampions = champions.slice(startIndex, endIndex);
        let content = "";
        if (currentPage === 1 && items.length > 0) {
            content += `**Items**\n ${this.renderInventoryItems(items)}\n\n**Champions**\n`;
        }
        for (let champion of pageChampions) {
            content += (0, constants_1.getChampionById)(champion.id).discordIcon;
            if (champion.cost >= 5) {
                content += ` **${champion.name}** x${champion.count}\n`;
            }
            else {
                content += ` ${champion.name} x${champion.count}\n`;
            }
        }
        return content;
    }
    renderInventoryItems(inventoryItems) {
        let output = "";
        for (let item of inventoryItems) {
            output += `${item.discordIcon} `;
        }
        return output;
    }
    displayEmptyInventoryError(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            interaction.reply("You do not have any champions or items in your inventory. Use `/shop` or `/shopitem` to buy some!");
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
exports.default = InventoryCommand;
