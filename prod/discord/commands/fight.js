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
const Command_1 = __importDefault(require("../types/Command"));
class FightCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName("fight")
            .setDescription("Fight a chosen user")
            .addUserOption((option) => option
            .setName("enemy")
            .setDescription("Tag the user that you want to fight")
            .setRequired(true));
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const discordEnemy = interaction.options.getUser("enemy");
            if (!discordEnemy) {
                yield interaction.reply("Please specify an enemy");
                return;
            }
            if (discordEnemy.id === interaction.user.id) {
                yield interaction.reply("You cannot fight yourself!");
                return;
            }
            if (discordEnemy.bot) {
                yield interaction.reply("Bots can't fight, unfornately.");
                return;
            }
            const userValidationResult = yield this.validateUserInventory(interaction.user.id, interaction.guildId);
            if (!userValidationResult.success) {
                yield interaction.reply(userValidationResult.errorMessage);
                return;
            }
            const { user, userInventory } = userValidationResult;
            const enemyValidationResult = yield this.validateUserInventory(discordEnemy.id, interaction.guildId);
            if (!enemyValidationResult.success) {
                yield interaction.reply(enemyValidationResult.errorMessage);
                return;
            }
            const enemy = enemyValidationResult.user;
            const enemyInventory = enemyValidationResult.userInventory;
            let FightAcceptanceActions;
            (function (FightAcceptanceActions) {
                FightAcceptanceActions["accept"] = "Accept";
                FightAcceptanceActions["decline"] = "Decline";
            })(FightAcceptanceActions || (FightAcceptanceActions = {}));
            const fightAcceptanceRows = new builders_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                .setCustomId(FightAcceptanceActions.accept)
                .setStyle(discord_js_1.ButtonStyle.Primary)
                .setLabel(FightAcceptanceActions.accept), new discord_js_1.ButtonBuilder()
                .setCustomId(FightAcceptanceActions.decline)
                .setStyle(discord_js_1.ButtonStyle.Danger)
                .setLabel(FightAcceptanceActions.decline));
            const acceptanceReply = yield interaction.reply({
                content: `${discordEnemy.toString()}, do you want to fight ${interaction.user.toString()}?`,
                components: [fightAcceptanceRows],
                fetchReply: true,
            });
            const acceptanceCollector = acceptanceReply.createMessageComponentCollector({
                filter: (i) => i.user.id === discordEnemy.id &&
                    i.message.id === acceptanceReply.id &&
                    (i.customId === FightAcceptanceActions.accept ||
                        i.customId === FightAcceptanceActions.decline),
                time: 100000,
            });
            let isFightAccepted = false;
            acceptanceCollector.on("collect", (buttonInteraction) => __awaiter(this, void 0, void 0, function* () {
                if (!buttonInteraction.deferred) {
                    yield buttonInteraction.deferUpdate();
                }
                if (buttonInteraction.customId === FightAcceptanceActions.accept)
                    isFightAccepted = true;
                acceptanceCollector.stop();
            }));
            acceptanceCollector.on("end", () => __awaiter(this, void 0, void 0, function* () {
                if (!isFightAccepted) {
                    yield interaction.editReply({
                        content: `${discordEnemy.username} declined the fight`,
                        components: [],
                    });
                    return;
                }
                yield interaction.editReply({
                    content: `${discordEnemy.toString()} accepted the fight`,
                    components: [],
                });
                const fightGame = new FightGame({ user: user, inventory: userInventory }, { user: enemy, inventory: enemyInventory });
                const fightActionRows = new builders_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId(FightAction.Attack)
                    .setStyle(discord_js_1.ButtonStyle.Primary)
                    .setLabel(FightAction.Attack), new discord_js_1.ButtonBuilder()
                    .setCustomId(FightAction.Spell)
                    .setStyle(discord_js_1.ButtonStyle.Success)
                    .setLabel(FightAction.Spell));
                const fightActionCollector = interaction.channel.createMessageComponentCollector({
                    filter: (i) => (i.customId === FightAction.Attack ||
                        i.customId === FightAction.Spell) &&
                        (i.user.id === interaction.user.id ||
                            i.user.id === discordEnemy.id),
                    time: 120000,
                });
                interaction.channel.send({
                    content: fightGame.getQuestion(),
                    components: [fightActionRows],
                });
                fightActionCollector.on("collect", (buttonInteraction) => __awaiter(this, void 0, void 0, function* () {
                    if (!buttonInteraction.deferred) {
                        yield buttonInteraction.deferUpdate();
                    }
                    if (buttonInteraction.user.id !==
                        fightGame.currentPlayer.user._id.discordUserId)
                        return;
                    let message = fightGame.executeAction(buttonInteraction.customId).message;
                    message = message + "\n" + fightGame.getHpDescription();
                    yield buttonInteraction.editReply({
                        content: buttonInteraction.message.content + "\n",
                        components: [],
                    });
                    if (fightGame.isOver()) {
                        interaction.channel.send(message + "\n" + fightGame.getWinnerMessage());
                        fightActionCollector.stop();
                    }
                    else {
                        fightGame.switchTurn();
                        yield interaction.channel.send({
                            content: message + "\n" + fightGame.getQuestion(),
                            components: [fightActionRows],
                        });
                    }
                }));
            }));
        });
    }
    validateUserInventory(discordUserId, discordGuildId) {
        return __awaiter(this, void 0, void 0, function* () {
            const noAccountError = `<@${discordUserId}> doesn't have an account. Use \`daily\` to create one!`;
            const serverError = "There was an error occured while execute this command. Please try again later";
            const emptyInventoryError = `<@${discordUserId}> haven't set their fighter. Use \`/equip <champion_name>\` to set the main fighter.`;
            const user = yield (0, controller_3.findDbUserById)({ discordUserId, discordGuildId });
            if (!user) {
                return { success: false, errorMessage: noAccountError };
            }
            const userGame = yield (0, controller_1.findGameById)(user.gameId);
            if (!userGame) {
                return { success: false, errorMessage: serverError };
            }
            if (!userGame.inventoryId) {
                return { success: false, errorMessage: emptyInventoryError };
            }
            const userInventory = yield (0, controller_2.findInventoryById)(userGame.inventoryId);
            if (!userInventory) {
                return { success: false, errorMessage: serverError };
            }
            if (!userInventory.mainChampion.name) {
                return { success: false, errorMessage: emptyInventoryError };
            }
            return {
                success: true,
                user,
                userGame,
                userInventory,
            };
        });
    }
}
var FightAction;
(function (FightAction) {
    FightAction["Attack"] = "Attack";
    FightAction["Spell"] = "Spell";
})(FightAction || (FightAction = {}));
class FightGame {
    constructor(user1, user2) {
        this.turn = true;
        this.currentPlayer = this.constructFightUser(user1, user2);
        this.enemyPlayer = this.constructFightUser(user2, user1);
    }
    constructFightUser(user, enemy) {
        const mainChampion = user.inventory.mainChampion;
        const star = champion_1.default.getChampionStar(mainChampion.count);
        const championStats = (0, controller_2.getChampionStats)(mainChampion, star);
        const fightUser = Object.assign(Object.assign({}, championStats), { user: user.user, championName: mainChampion.name, championAbility: mainChampion.ability.name });
        if (user.inventory.mainItem.name) {
            const tftItem = item_1.default.getItemByName(user.inventory.mainItem.name);
            if (tftItem) {
                for (let stat in tftItem.stats) {
                    fightUser[stat] += tftItem.stats[stat];
                }
            }
        }
        if (enemy.inventory.mainItem.name) {
            const tftItem = item_1.default.getItemByName(user.inventory.mainItem.name);
            if (tftItem) {
                if (tftItem.stats.physicalDamagePen) {
                    fightUser.armor -= tftItem.stats.physicalDamagePen;
                }
                if (tftItem.stats.magicDamagePen) {
                    fightUser.magicResist -= tftItem.stats.magicDamagePen;
                }
            }
        }
        return fightUser;
    }
    executeAction(action) {
        if (action === FightAction.Attack)
            return this.attack();
        return this.spell();
    }
    spell() {
        const miss = Math.random() < 0.4 ? true : false;
        if (miss)
            return {
                miss: true,
                crit: false,
                damageDealt: 0,
                message: `${this.currentPlayer.championName}'s spell missed!`,
            };
        const crit = Math.random() * 100 < this.currentPlayer.magicCritChance;
        const critMultiplier = crit ? 18 : 10;
        const magicDamageReduction = champion_1.default.getMagicDamageReduction(this.enemyPlayer.magicResist);
        const damageDealt = Math.floor(this.currentPlayer.magicDamage *
            critMultiplier *
            magicDamageReduction *
            0.01);
        this.enemyPlayer.hp -= damageDealt;
        let message = `${this.currentPlayer.championName} used ${this.currentPlayer.championAbility} and dealed **${damageDealt}** magic damage.`;
        if (crit) {
            message = `:zap: ${this.currentPlayer.championName}'s ${this.currentPlayer.championAbility} has critted and dealt **${damageDealt}** magic damage.`;
        }
        return {
            miss: false,
            crit,
            damageDealt,
            message,
        };
    }
    attack() {
        const crit = Math.random() * 100 < this.currentPlayer.physicalCritChance;
        const critMultiplier = crit ? 15 : 10;
        const physicalDamageReduction = champion_1.default.getPhysicalDamageReduction(this.enemyPlayer.armor);
        const damageDealt = Math.floor(this.currentPlayer.physicalDamage *
            critMultiplier *
            physicalDamageReduction *
            0.01);
        this.enemyPlayer.hp -= damageDealt;
        let message = `${this.currentPlayer.championName}'s attack dealed **${damageDealt}** physical damage.`;
        if (crit) {
            message = `:zap: ${this.currentPlayer.championName}'s attack dealed **${damageDealt}** physical damage.`;
        }
        return {
            miss: false,
            crit,
            damageDealt,
            message,
        };
    }
    switchTurn() {
        const tempPlayer = this.currentPlayer;
        this.currentPlayer = this.enemyPlayer;
        this.enemyPlayer = tempPlayer;
        this.turn = !this.turn;
    }
    getQuestion() {
        return `<@${this.currentPlayer.user._id.discordUserId}>, What does ${this.currentPlayer.championName} do?`;
    }
    getWinnerMessage() {
        return `<@${this.currentPlayer.user._id.discordUserId}> wins`;
    }
    getHpDescription() {
        const p1 = this.turn ? this.currentPlayer : this.enemyPlayer;
        const p2 = this.turn ? this.enemyPlayer : this.currentPlayer;
        return `${p1.user.tag}: **${p1.hp}** HP\n${p2.user.tag}: **${p2.hp}** HP`;
    }
    isOver() {
        return this.currentPlayer.hp <= 0 || this.enemyPlayer.hp <= 0;
    }
}
exports.default = FightCommand;
