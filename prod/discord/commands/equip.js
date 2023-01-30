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
const champion_1 = __importDefault(require("../../riot/api/tft/champion"));
const item_1 = __importDefault(require("../../riot/api/tft/item"));
const tft_item_1 = require("../models/tft-item");
const Command_1 = __importDefault(require("../types/Command"));
class EquipCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName("equip")
            .setDescription("Set a champion to be your main fighter, and optionally equip an item")
            .addStringOption((option) => option
            .setName("champion")
            .setDescription("The name of the champion in your inventory"))
            .addStringOption((option) => option
            .setName("item")
            .setDescription("The name of the item in your inventory")
            .addChoices(...(0, tft_item_1.getTftItemDiscordChoices)()));
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
            const champion = interaction.options.getString("champion");
            let item = interaction.options.getString("item");
            if (!champion && !item) {
                yield interaction.reply("Please enter either a champion name or an item name.");
                return;
            }
            let inventoryHasChange = false;
            let selectedChampion;
            if (champion) {
                selectedChampion = userInventory.champions.find((c) => c.name.toLowerCase() === champion.toLowerCase().trim());
                if (!selectedChampion) {
                    yield interaction.reply("This champion does not exist in your inventory. Use `/inventory` to see all your champions");
                    return;
                }
                userInventory.mainChampion = selectedChampion;
                inventoryHasChange = true;
            }
            else if (userInventory.mainChampion.name) {
                selectedChampion = userInventory.mainChampion;
            }
            if (item) {
                const inventoryItem = userInventory.items.find((i) => i.name === item);
                if (!inventoryItem) {
                    yield interaction.reply(`Item ${item} does not exist in your inventory. Use \`/inventory\` to see all your items`);
                    return;
                }
                userInventory.mainItem = inventoryItem;
                inventoryHasChange = true;
            }
            else if (userInventory.mainItem.name) {
                item = userInventory.mainItem.name;
            }
            if (inventoryHasChange) {
                yield userInventory.save();
            }
            if (!selectedChampion) {
                const tftItem = item_1.default.getItemByName(item);
                const embed = new builders_1.EmbedBuilder()
                    .setTitle(`${tftItem.discordIcon} ${tftItem.name} has been equipped `)
                    .setAuthor({ name: interaction.user.tag })
                    .setDescription(`Bonus stats: ${tftItem.effectName}.\nYour main champion will gain the bonus stats when they are equipped`);
                yield interaction.reply({ embeds: [embed] });
                return;
            }
            let description = this.renderChampionDescription(selectedChampion, item);
            const embed = new builders_1.EmbedBuilder()
                .setTitle(`${selectedChampion.name} is now your main fighter!`)
                .setColor(champion_1.default.mapChampionCostToColor(selectedChampion.cost))
                .setThumbnail(selectedChampion.icon)
                .setDescription(description)
                .setImage(selectedChampion.ability.icon);
            yield interaction.reply({ embeds: [embed] });
        });
    }
    renderChampionDescription(champion, item) {
        const championStar = champion_1.default.getChampionStar(champion.count);
        let description = this.renderStarString(championStar) + "\n";
        let stats = (0, controller_2.getChampionStats)(champion, championStar);
        let statsDescription = {
            physicalDamage: {
                name: "Physical damage",
                description: stats.physicalDamage.toString(),
            },
            magicDamage: {
                name: "Magic damage",
                description: stats.magicDamage.toString(),
            },
            hp: {
                name: "HP",
                description: stats.hp.toString(),
            },
            armor: {
                name: "Armor",
                description: stats.armor.toString(),
            },
            magicResist: {
                name: "Magic resist",
                description: stats.magicResist.toString(),
            },
            physicalDamagePen: {
                name: "Armor penetration",
                description: stats.physicalDamagePen.toString(),
            },
            magicDamagePen: {
                name: "Magic penetration",
                description: stats.magicDamagePen.toString(),
            },
            physicalCritChance: {
                name: "Physical crit chance",
                description: `${stats.physicalCritChance}%`,
            },
            magicCritChance: {
                name: "Magic crit chance",
                description: `${stats.magicCritChance}%`,
            },
        };
        if (item) {
            const tftItem = item_1.default.getItemByName(item);
            description += `Equipped item: ${tftItem.discordIcon} ${tftItem.name}\n\n`;
            for (let stat in statsDescription) {
                if (tftItem.stats[stat]) {
                    if (stat === "physicalCritChance" || stat === "magicCritChance") {
                        statsDescription[stat].description += ` **(+ ${tftItem.stats[stat]}%)**`;
                    }
                    else {
                        statsDescription[stat].description += ` **(+ ${tftItem.stats[stat]})**`;
                    }
                }
            }
        }
        for (let stat in statsDescription) {
            description += `**${statsDescription[stat].name}**: ${statsDescription[stat].description}\n`;
        }
        description += `**Ability**: ${champion.ability.name}`;
        return description;
    }
    renderStarString(star) {
        let starString = "";
        for (let i = 0; i < star; i++) {
            starString += " :star:";
        }
        return starString;
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
exports.default = EquipCommand;
