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
const controller_1 = require("../../database/dtos/user/controller");
const controller_2 = require("../../database/dtos/game/controller");
const controller_3 = require("../../database/dtos/inventory/controller");
const champion_1 = __importDefault(require("../../riot/api/tft/champion"));
const constants_1 = require("../../riot/constants");
class ShopCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.championPrices = [50, 100, 200, 400, 800];
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName("shop")
            .setDescription("Buy champions to increase your power!")
            .addIntegerOption((option) => option
            .setName("cost")
            .setDescription("Champion tier (1, 2, 3, 4, 5)")
            .addChoices({ name: `1-cost (Price: ${this.championPrices[0]} gold)`, value: 1 }, { name: `2-cost (Price: ${this.championPrices[1]} gold)`, value: 2 }, { name: `3-cost (Price: ${this.championPrices[2]} gold)`, value: 3 }, { name: `4-cost (Price: ${this.championPrices[3]} gold)`, value: 4 }, { name: `5-cost (Price: ${this.championPrices[4]} gold)`, value: 5 }))
            .addIntegerOption((option) => option
            .setName("num-champions")
            .setDescription("Number of champions to buy (min: 1, max: 10)")
            .setMinValue(1)
            .setMaxValue(10));
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const cost = interaction.options.getInteger("cost");
            if (!cost) {
                const embed = this.getShopDescriptionEmbed();
                yield interaction.reply({ embeds: [embed] });
                return;
            }
            const _id = {
                discordUserId: interaction.user.id,
                discordGuildId: interaction.guild.id,
            };
            const user = yield (0, controller_1.findDbUserById)(_id);
            if (!user) {
                yield interaction.reply("Welcome to Mercenary Shop. Please use **`/daily`** to create an account before shopping!");
                return;
            }
            const userGame = yield (0, controller_2.findGameById)(user.gameId);
            if (!userGame) {
                yield this.displayError(interaction);
                return;
            }
            const championPrice = this.championPrices[cost - 1];
            const numChampions = interaction.options.getInteger("num-champions") || 1;
            const totalPrice = numChampions * championPrice;
            if (userGame.balance < championPrice * numChampions) {
                yield interaction.reply(`You don't have enough gold to buy ${numChampions} ${cost}-cost champion(s). (Price: ${totalPrice}, Current balance: ${userGame.balance})`);
                return;
            }
            let userInventory;
            if (!userGame.inventoryId) {
                userInventory = yield (0, controller_3.createInventory)();
                if (userInventory) {
                    userGame.inventoryId = userInventory._id;
                    yield userGame.save();
                }
            }
            else {
                userInventory = yield (0, controller_3.findInventoryById)(userGame.inventoryId);
            }
            if (!userInventory) {
                yield this.displayError(interaction);
                return;
            }
            const { pointsGained, boughtChampions, boughtChampionCount } = this.shopChampions(cost, userInventory, numChampions);
            if (boughtChampionCount === 0) {
                yield interaction.reply(`You have had all ${cost}-cost champion in your inventory. Please choose another champion tier cost`);
                return;
            }
            userGame.points += pointsGained;
            userGame.balance -= boughtChampionCount * championPrice;
            yield Promise.all([userGame.save(), userInventory.save()]);
            const newTwoStarChampions = [];
            const newThreeStarChampions = [];
            let description = "";
            if (boughtChampionCount < numChampions) {
                description +=
                    `Only ${boughtChampionCount} ${cost}-cost champions are added to your inventory.` +
                        ` You now have all ${cost}-cost champions. Congrats!\n`;
            }
            description += "**Bought champions:**\n";
            for (let championName in boughtChampions) {
                const boughtChampion = boughtChampions[championName];
                const championIcon = (0, constants_1.getChampionById)(boughtChampion.id).discordIcon;
                description += `${championIcon} ${championName} (x${boughtChampion.count})\n`;
                if (boughtChampion.newStar === 2) {
                    newTwoStarChampions.push(championName);
                }
                else if (boughtChampion.newStar === 3) {
                    newThreeStarChampions.push(championName);
                }
            }
            if (newTwoStarChampions.length > 0) {
                description += `\n**New 2-star champions:** `;
                for (let twoStarChamp of newTwoStarChampions) {
                    description += `${twoStarChamp} `;
                }
                description += "\n";
            }
            if (newThreeStarChampions.length > 0) {
                description += `**New 3-star champions:** `;
                for (let threeStarChamp of newThreeStarChampions) {
                    description += `${threeStarChamp} `;
                }
                description += "\n";
            }
            const embed = new builders_1.EmbedBuilder()
                .setColor(champion_1.default.mapChampionCostToColor(cost))
                .setTitle(`${boughtChampionCount} ${cost}-cost champion(s) have been added to your inventory.`)
                .setAuthor({ name: interaction.user.tag })
                .setDescription(description)
                .addFields({
                name: "Number of champions",
                value: boughtChampionCount.toString(),
                inline: true,
            }, {
                name: "Price",
                value: (boughtChampionCount * championPrice).toLocaleString(),
                inline: true,
            }, {
                name: "New balance",
                value: userGame.balance.toLocaleString(),
                inline: true,
            }, {
                name: "Points gained",
                value: pointsGained.toLocaleString(),
                inline: true,
            }, {
                name: "Points",
                value: userGame.points.toLocaleString(),
                inline: true,
            });
            yield interaction.reply({ embeds: [embed] });
        });
    }
    shopChampions(cost, userInventory, requiredNumberOfChampions) {
        const availableChampions = champion_1.default.getChampionsWithCost(cost);
        const getRandomChampionIndex = () => Math.floor(Math.random() * availableChampions.length);
        const getInventoryChampionIndex = (championName) => userInventory.champions.findIndex((c) => c.name === championName);
        const boughtChampions = {};
        let boughtChampionCount = 0;
        let pointsGained = 0;
        while (boughtChampionCount < requiredNumberOfChampions &&
            availableChampions.length > 0) {
            const championIndex = getRandomChampionIndex();
            const champion = availableChampions[championIndex];
            const inventoryChampionIndex = getInventoryChampionIndex(champion.name);
            if (inventoryChampionIndex === -1) {
                userInventory.champions.push((0, controller_3.tftToDbChampion)(champion, 1));
                boughtChampions[champion.name] = {
                    count: 1,
                    newStar: 1,
                    id: champion.id,
                };
                pointsGained += champion.cost;
                boughtChampionCount++;
                continue;
            }
            const inventoryChampion = userInventory.champions[inventoryChampionIndex];
            if (inventoryChampion.count >= 9) {
                availableChampions.splice(championIndex, 1);
                continue;
            }
            boughtChampionCount++;
            inventoryChampion.count++;
            if (!boughtChampions[champion.name]) {
                boughtChampions[champion.name] = {
                    count: 1,
                    newStar: 1,
                    id: champion.id,
                };
            }
            else {
                boughtChampions[champion.name].count++;
            }
            pointsGained += champion.cost;
            if (inventoryChampion.count === 9) {
                pointsGained += 50 * champion.cost;
                boughtChampions[champion.name].newStar = 3;
            }
            else if (inventoryChampion.count === 3 ||
                inventoryChampion.count === 6) {
                pointsGained += 5 * champion.cost;
                boughtChampions[champion.name].newStar = 2;
            }
        }
        return {
            boughtChampions,
            pointsGained,
            boughtChampionCount,
        };
    }
    getShopDescriptionEmbed() {
        return new builders_1.EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle("Welcome to Mercenary Shop")
            .setDescription(shopDescription)
            .addFields([
            {
                name: "1-cost tier",
                value: `Price: ${this.championPrices[0]} :coin:`,
                inline: true,
            },
            {
                name: "2-cost tier",
                value: `Price: ${this.championPrices[1]} :coin:`,
                inline: true,
            },
            {
                name: "3-cost tier",
                value: `Price: ${this.championPrices[2]} :coin:`,
                inline: true,
            },
            {
                name: "4-cost tier",
                value: `Price: ${this.championPrices[3]} :coin:`,
                inline: true,
            },
            {
                name: "5-cost tier",
                value: `Price: ${this.championPrices[4]} :coin:`,
                inline: true,
            },
        ]);
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
const shopDescription = `Use **\`/shop <champion_cost> <num_champions>\`** to buy champions. Examples: \n \`/shop 2\` to buy one 2-cost champion. \n \`/shop 2 5\` to buy five 2-cost champions.\n If you have 3 copies of a champion in your inventory, it will upgrade to a higher star and earn you additional points.`;
exports.default = ShopCommand;
