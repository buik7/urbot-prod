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
const controller_1 = require("../../database/dtos/riotinfo/controller");
const summoner_1 = require("../../riot/api/lol/summoner");
const tft_1 = require("../../riot/api/tft/tft");
const leagueCommandBuilder_1 = require("../models/leagueCommandBuilder");
const Command_1 = __importDefault(require("../types/Command"));
const validateUser_1 = require("../utils/validateUser");
class LinkCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.data = (0, leagueCommandBuilder_1.buildCommand)({
            name: "link",
            description: "Link your League of Legends account to your Urbot account",
            options: {
                region: {
                    description: "The region that you are playing",
                    required: true,
                },
                summonerName: {
                    description: "Your summoner name (ingame name)",
                    required: true,
                },
            },
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const userValidation = yield (0, validateUser_1.validateUser)(interaction.user.id, interaction.guildId, {});
            if (!userValidation.success) {
                yield interaction.reply(userValidation.errorMessage);
                return;
            }
            const { user } = userValidation;
            const summonerName = interaction.options.getString(leagueCommandBuilder_1.LeagueOptionName.summonerName);
            const region = interaction.options.getString(leagueCommandBuilder_1.LeagueOptionName.region);
            const tftApi = new tft_1.TFTApi();
            const summonerInfo = yield tftApi.Summoner.getByName(region, summonerName);
            const userRiotInfo = yield (0, controller_1.createRiotInfo)({
                profileIconId: summonerInfo.profileIconId,
                summonerName: summonerInfo.name,
                encryptedSummonerId: summonerInfo.id,
                puuid: summonerInfo.puuid,
                region,
            });
            if (!userRiotInfo) {
                yield interaction.reply("Account linking failed. Please try again later.");
                return;
            }
            user.riotInfoId = userRiotInfo._id;
            yield user.save();
            const embed = new builders_1.EmbedBuilder()
                .setColor(0xeb459e)
                .setAuthor({ name: interaction.user.tag })
                .setTitle(`${summonerName} [${region}] is now linked to your Urbot account!`)
                .setDescription(`Level: ${summonerInfo.summonerLevel}`)
                .setThumbnail(summoner_1.SummonerApi.getProfileIconURL(summonerInfo.profileIconId));
            yield interaction.reply({ embeds: [embed] });
        });
    }
}
exports.default = LinkCommand;
