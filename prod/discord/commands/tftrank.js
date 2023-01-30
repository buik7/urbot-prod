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
const summoner_1 = require("../../riot/api/lol/summoner");
const tft_1 = require("../../riot/api/tft/tft");
const constants_1 = require("../../riot/constants");
const leagueCommandBuilder_1 = require("../models/leagueCommandBuilder");
const Command_1 = __importDefault(require("../types/Command"));
const extractTftSummoner_1 = require("../utils/extractTftSummoner");
class TftRankCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.data = (0, leagueCommandBuilder_1.buildCommand)({
            name: "tftrank",
            description: "Show a summoner's ranks in Teamfight Tactics (Ranked, TFT Turbo)",
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
                    description: "Tag the user that you want to view TFT rank",
                    required: false,
                },
            },
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const tftApi = new tft_1.TFTApi();
            const extractSummonerResult = yield (0, extractTftSummoner_1.extractTftSummoner)(interaction, tftApi);
            if (!extractSummonerResult.success) {
                yield interaction.reply(extractSummonerResult.errorMessage);
                return;
            }
            const { summoner } = extractSummonerResult;
            const summonerRanks = yield tftApi.League.bySummoner(summoner.region, summoner.encryptedSummonerId);
            const tftRank = summonerRanks.find((r) => r.queueType === constants_1.Queues.RANKED_TFT);
            const turboRank = summonerRanks.find((r) => r.queueType === constants_1.Queues.RANKED_TFT_TURBO);
            let description = this.displayRank(tftRank, constants_1.Queues.RANKED_TFT) + "\n";
            description += this.displayRank(turboRank, constants_1.Queues.RANKED_TFT_TURBO);
            description += `\n\nFirst placement is considered a win (W)\nOther placements are considered a loss (L)`;
            const embed = new builders_1.EmbedBuilder()
                .setAuthor({
                name: `${summoner.summonerName} [${summoner.region}]`,
                iconURL: summoner_1.SummonerApi.getProfileIconURL(summoner.profileIconId),
            })
                .setTitle("Teamfight Tactics ranking")
                .setColor(0xa84300)
                .setDescription(description);
            yield interaction.reply({ embeds: [embed] });
        });
    }
    displayRank(rank, queueType) {
        let description = "";
        if (queueType === constants_1.Queues.RANKED_TFT) {
            description += "**TFT Ranked**: \n";
        }
        else if (queueType === constants_1.Queues.RANKED_TFT_TURBO) {
            description += "** TFT Turbo: ** \n";
        }
        if (!rank) {
            description += `${(0, constants_1.getTierDiscordIcon)("Unranked")} Unranked`;
            return description;
        }
        if (rank.queueType === constants_1.Queues.RANKED_TFT_TURBO) {
            description += `Tier: ${rank.ratedTier}. Rating: ${rank.ratedRating} (${rank.wins} W, ${rank.losses} L)`;
            return description;
        }
        description += `${(0, constants_1.getTierDiscordIcon)(rank.tier)} ${(0, constants_1.displayTierAndDivision)(rank.tier, rank.rank)} (${rank.wins} W, ${rank.losses} L)`;
        return description;
    }
}
exports.default = TftRankCommand;
