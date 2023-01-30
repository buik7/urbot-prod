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
const lol_1 = require("../../riot/api/lol/lol");
const summoner_1 = require("../../riot/api/lol/summoner");
const constants_1 = require("../../riot/constants");
const leagueCommandBuilder_1 = require("../models/leagueCommandBuilder");
const Command_1 = __importDefault(require("../types/Command"));
const extractLolSummoner_1 = require("../utils/extractLolSummoner");
class LolRankCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.data = (0, leagueCommandBuilder_1.buildCommand)({
            name: "lolrank",
            description: "Show a summoner's ranks in League of Legends (Solo/Duo, Flex)",
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
                    description: "Tag the user that you want to view LOL rank",
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
            const summonerRanks = yield lolApi.League.bySummoner(summoner.region, summoner.encryptedSummonerId);
            const soloDuoRank = summonerRanks.find((r) => r.queueType === constants_1.Queues.RANKED_SOLO_5x5);
            const flexRank = summonerRanks.find((r) => r.queueType === constants_1.Queues.RANKED_FLEX_5x5);
            let description = this.displayRank(soloDuoRank, constants_1.Queues.RANKED_SOLO_5x5) + "\n";
            description += this.displayRank(flexRank, constants_1.Queues.RANKED_FLEX_5x5);
            const embed = new builders_1.EmbedBuilder()
                .setAuthor({
                name: `${summoner.summonerName} [${summoner.region}]`,
                iconURL: summoner_1.SummonerApi.getProfileIconURL(summoner.profileIconId),
            })
                .setTitle("League of Legends ranking")
                .setColor(0xa84300)
                .setDescription(description);
            yield interaction.reply({ embeds: [embed] });
        });
    }
    displayRank(rank, queueType) {
        let description = "";
        if (queueType === constants_1.Queues.RANKED_SOLO_5x5) {
            description += "**Ranked Solo/Duo**: \n";
        }
        else if (queueType === constants_1.Queues.RANKED_FLEX_5x5) {
            description += "**Ranked Flex**: \n";
        }
        if (!rank) {
            description += `${(0, constants_1.getTierDiscordIcon)("Unranked")} Unranked`;
            return description;
        }
        description += `${(0, constants_1.getTierDiscordIcon)(rank.tier)} ${(0, constants_1.displayTierAndDivision)(rank.tier, rank.rank)}`;
        description += ` (${rank.wins} W, ${rank.losses} L)`;
        return description;
    }
}
exports.default = LolRankCommand;
