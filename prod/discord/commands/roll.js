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
const controller_2 = require("../../database/dtos/user/controller");
const champion_1 = __importDefault(require("../../riot/api/tft/champion"));
const Command_1 = __importDefault(require("../types/Command"));
class RollCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName("roll")
            .setDescription("Roll a champion in TFT Set 8")
            .addIntegerOption((option) => option
            .setName("multiplier")
            .setDescription("The higher the multiplier, the more gold you can get but also the more gold you can lose.")
            .setMinValue(1));
    }
    execute(interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const _id = {
                discordUserId: interaction.user.id,
                discordGuildId: interaction.guild.id,
            };
            const result = yield (0, controller_2.findOneOrCreateDbUser)(_id, interaction.user.tag);
            if (!result || !result.user) {
                yield this.displayError(interaction);
                return;
            }
            const { user, created } = result;
            const content = created
                ? "Your new account was created with an initial balance of 30!"
                : "";
            const userGame = yield (0, controller_1.findGameById)(user.gameId);
            if (!userGame) {
                yield this.displayError(interaction);
                return;
            }
            const multiplier = (_a = interaction.options.getInteger("multiplier")) !== null && _a !== void 0 ? _a : 1;
            if (userGame.balance < 3 * multiplier) {
                yield interaction.reply({
                    content: this.getNotEnoughBalanceError(interaction.user.id, multiplier, userGame.balance),
                    ephemeral: true,
                });
                return;
            }
            const { gain, fee, net, champion } = this.rollChampion(multiplier);
            const { netText, netDescription } = this.getNetOutput(net);
            userGame.balance += net;
            yield userGame.save();
            const embed = new builders_1.EmbedBuilder()
                .setColor(champion_1.default.mapChampionCostToColor(champion.cost))
                .setTitle(`You rolled a ${champion.name} (${champion.cost} :coin:)!`)
                .setAuthor({ name: interaction.user.tag })
                .setDescription(netDescription)
                .addFields({ name: "Gain:", value: gain.toString(), inline: true }, { name: "Fee:", value: fee.toString(), inline: true }, { name: "Net:", value: netText, inline: true }, { name: "Multiplier: ", value: multiplier.toString(), inline: true }, {
                name: "New balance: ",
                value: userGame.balance.toLocaleString(),
                inline: true,
            })
                .setImage(champion.icon);
            yield interaction.reply({ embeds: [embed], content });
        });
    }
    rollChampion(multiplier) {
        const champion = champion_1.default.getRandomChampion();
        const gain = champion.cost * multiplier;
        const fee = 3 * multiplier;
        const net = gain - fee;
        return { gain, fee, net, champion };
    }
    getNetOutput(net) {
        let netText = net.toString();
        let netDescription = "Your balance was unchanged.";
        if (net > 0) {
            netText = `+${net}`;
            netDescription = `You gained ${net} gold!`;
        }
        else if (net < 0) {
            netDescription = `You lost ${net * -1} gold.`;
        }
        return { netText, netDescription };
    }
    getNotEnoughBalanceError(discordUserId, multiplier, balance) {
        return `<@${discordUserId}>, You need at least ${3 * multiplier} gold to roll with a multiplier of ${multiplier}. (Current balance: ${balance})`;
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
exports.default = RollCommand;
