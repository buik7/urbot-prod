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
const discord_js_1 = require("discord.js");
const controller_1 = require("../../database/dtos/game/controller");
const controller_2 = require("../../database/dtos/user/controller");
const Command_1 = __importDefault(require("../types/Command"));
const date_1 = require("../utils/date");
class DailyCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.data = new discord_js_1.SlashCommandBuilder()
            .setName("daily")
            .setDescription("Get your daily gold once every 6 hours.");
    }
    execute(interaction) {
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
            if (created) {
                yield interaction.reply("Your new account was created with an initial balance of 30!");
                return;
            }
            const userGame = yield (0, controller_1.findGameById)(user.gameId);
            if (!userGame) {
                yield this.displayError(interaction);
                return;
            }
            const now = new Date();
            if (userGame.dailyCooldown > now) {
                const waitingTime = userGame.dailyCooldown.getTime() - now.getTime();
                const { h, m, s } = (0, date_1.msToTime)(waitingTime);
                yield interaction.reply(`You must wait **${h} hours, ${m} minutes and ${s} seconds** for your next daily`);
                return;
            }
            const newDailyCooldown = now.getTime() + 1000 * 60 * 60 * 6;
            userGame.balance += 30;
            userGame.dailyCooldown = new Date(newDailyCooldown);
            yield userGame.save();
            yield interaction.reply(`30 gold was added to your account. New balance: ${userGame.balance.toLocaleString()}`);
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
exports.default = DailyCommand;
