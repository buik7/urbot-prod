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
const controller_1 = require("../../database/dtos/inventory/controller");
const item_1 = __importDefault(require("../../riot/api/tft/item"));
const tft_item_1 = require("../models/tft-item");
const Command_1 = __importDefault(require("../types/Command"));
const validateUser_1 = require("../utils/validateUser");
class ShopItemCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.itemPrice = 1000;
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName("shopitem")
            .setDescription("Buy items to increase your power!")
            .addStringOption((option) => option
            .setName("item")
            .setDescription("Price of each item: 1000 gold")
            .addChoices(...(0, tft_item_1.getTftItemDiscordChoices)()));
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = interaction.options.getString("item");
            if (!item) {
                const embed = this.getShopDescriptionEmbed();
                yield interaction.reply({ embeds: [embed] });
                return;
            }
            const validationResult = yield (0, validateUser_1.validateUser)(interaction.user.id, interaction.guildId, { game: true });
            if (!validationResult.success) {
                yield interaction.reply(validationResult.errorMessage);
                return;
            }
            const userGame = validationResult.userGame;
            if (userGame.balance < this.itemPrice) {
                yield interaction.reply(`You don't have enough gold to buy this item. (Price: ${this.itemPrice}, Current balance: ${userGame.balance})`);
                return;
            }
            let userInventory;
            if (!userGame.inventoryId) {
                userInventory = yield (0, controller_1.createInventory)();
                if (userInventory) {
                    userGame.inventoryId = userInventory._id;
                    yield userGame.save();
                }
            }
            else {
                userInventory = yield (0, controller_1.findInventoryById)(userGame.inventoryId);
            }
            if (!userInventory) {
                yield this.displayError(interaction);
                return;
            }
            const inventoryItem = userInventory.items.find((i) => i.name === item);
            if (inventoryItem) {
                yield interaction.reply(`You already bought ${item}. Use \`/inventory\` to see all of your bought items`);
                return;
            }
            const dbItem = {
                name: item,
                discordIcon: item_1.default.getItemByName(item).discordIcon,
            };
            userInventory.items.push(dbItem);
            userGame.balance -= this.itemPrice;
            userGame.points += 8;
            yield userGame.save();
            yield userInventory.save();
            const embed = new builders_1.EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle(`${dbItem.discordIcon} ${dbItem.name} has been added to your inventory`)
                .setAuthor({ name: interaction.user.tag })
                .setDescription("You gained 8 points")
                .addFields([
                {
                    name: "New balance",
                    value: userGame.balance.toLocaleString(),
                    inline: true,
                },
                {
                    name: "Points",
                    value: userGame.points.toLocaleString(),
                    inline: true,
                },
            ]);
            yield interaction.reply({ embeds: [embed] });
        });
    }
    getShopDescriptionEmbed() {
        return new builders_1.EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle("Welcome to Mercenary Item Shop")
            .setDescription("Use `/shopitem <item_name>` to buy an item.\nEach item costs 1000 :coin: and gain you 8 points.\nYou can only have 1 copy of each item in your inventory.")
            .addFields((0, tft_item_1.getTftItemDiscordEmbedFields)());
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
exports.default = ShopItemCommand;
