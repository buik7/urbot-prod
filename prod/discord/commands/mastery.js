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
const champion_1 = require("../../riot/api/lol/champion");
const lol_1 = require("../../riot/api/lol/lol");
const summoner_1 = require("../../riot/api/lol/summoner");
const constants_1 = require("../../riot/constants");
const leagueCommandBuilder_1 = require("../models/leagueCommandBuilder");
const Command_1 = __importDefault(require("../types/Command"));
const extractLolSummoner_1 = require("../utils/extractLolSummoner");
class MasteryCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.data = (0, leagueCommandBuilder_1.buildCommand)({
            name: "mastery",
            description: "List 10 champions with the highest mastery of a summoner",
            options: {
                summonerName: {
                    description: "Summoner name (region also must be specified)",
                    required: false,
                },
                region: {
                    description: "The region of the summoner",
                    required: false,
                },
                discordUser: {
                    description: "Tag the user that you want to view champion masteries",
                    required: false,
                },
            },
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const lolApi = new lol_1.LolApi();
            const extractSummonerResult = yield (0, extractLolSummoner_1.extractLolSummoner)(interaction, lolApi);
            if (!extractSummonerResult.success) {
                yield interaction.reply(extractSummonerResult.errorMessage);
                return;
            }
            const { summoner } = extractSummonerResult;
            const championMasteries = yield lolApi.Champion.getTopChampionMasteryBySummoner(summoner.region, summoner.encryptedSummonerId, 10);
            if (championMasteries.length === 0) {
                yield interaction.reply(`${summoner.summonerName} hasn't played any games in League of Legends`);
                return;
            }
            const embed = new builders_1.EmbedBuilder()
                .setAuthor({
                name: `${summoner.summonerName} [${summoner.region}]`,
                iconURL: summoner_1.SummonerApi.getProfileIconURL(summoner.profileIconId),
            })
                .setColor(0xe91e63)
                .setDescription(this.displayChampionMastery(championMasteries));
            yield interaction.reply({ embeds: [embed] });
        });
    }
    displayChampionMastery(championMasteries) {
        let description = `${championMasteries.length} champions with the highest masteries:\n\n`;
        championMasteries.forEach(({ championLevel, championPoints, championId }) => {
            const champion = (0, constants_1.getChampionById)(championId, true);
            description += champion_1.ChampionApi.getMasteryDiscordIcon(championLevel) + " ";
            description += champion.discordIcon;
            description += ` **${champion.name}** - ${championPoints.toLocaleString()} \n`;
        });
        return description;
    }
}
exports.default = MasteryCommand;
