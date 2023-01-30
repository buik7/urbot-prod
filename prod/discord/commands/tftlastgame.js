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
const champion_1 = __importDefault(require("../../riot/api/tft/champion"));
const tft_1 = require("../../riot/api/tft/tft");
const constants_1 = require("../../riot/constants");
const leagueCommandBuilder_1 = require("../models/leagueCommandBuilder");
const Command_1 = __importDefault(require("../types/Command"));
const extractTftSummoner_1 = require("../utils/extractTftSummoner");
class TftLastGameCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.data = (0, leagueCommandBuilder_1.buildCommand)({
            name: "tftlastgame",
            description: "Show statistics of a summoner's last Teamfight Tactics game",
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
                    description: "Tag the user that you want to view TFT last game",
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
            const summonerRegionGroup = (0, constants_1.regionToRegionGroup)(summoner.region);
            const matchList = yield tftApi.Match.getMatchList(summonerRegionGroup, summoner.puuid, { count: 1 });
            if (matchList.length === 0) {
                yield interaction.reply("This user has not played since June 2021");
                return;
            }
            const match = yield tftApi.Match.getMatchDetail(summonerRegionGroup, matchList[0]);
            const participantNames = {};
            const participantResults = yield Promise.all(match.metadata.participants.map((puuid) => __awaiter(this, void 0, void 0, function* () {
                return yield tftApi.Summoner.getByPUUID(summoner.region, puuid);
            })));
            for (let participantResult of participantResults) {
                participantNames[participantResult.puuid] = participantResult.name;
            }
            const participants = match.info.participants;
            participants.sort((p1, p2) => p1.placement - p2.placement);
            let { firstCol, secondCol, thirdCol, fourthCol, fifthCol, sixthCol, seventhCol, eighthCol, ninthCol, } = this.renderMatchDescription(participants, summoner.summonerName, participantNames);
            const embed = new builders_1.EmbedBuilder()
                .setAuthor({
                name: `${summoner.summonerName} [${summoner.region}]`,
                iconURL: summoner_1.SummonerApi.getProfileIconURL(summoner.profileIconId),
            })
                .setTitle("Teamfight Tactics last game statistics")
                .setColor(0xa84300)
                .addFields([
                { name: "Participants", value: firstCol, inline: true },
                { name: this.renderStar(3), value: secondCol, inline: true },
                {
                    name: `${this.renderStar(2)} / ${this.renderStar(1)}`,
                    value: thirdCol,
                    inline: true,
                },
                { name: "-", value: fourthCol, inline: true },
                { name: "-", value: fifthCol, inline: true },
                { name: "-", value: sixthCol, inline: true },
                { name: "-", value: seventhCol, inline: true },
                { name: "-", value: eighthCol, inline: true },
                { name: "-", value: ninthCol, inline: true },
            ]);
            yield interaction.reply({ embeds: [embed] });
        });
    }
    renderMatchDescription(participants, currentParticipantName, participantNames) {
        let firstCol = "\n";
        let secondCol = "\n";
        let thirdCol = "\n";
        let fourthCol = "\n";
        let fifthCol = "\n";
        let sixthCol = "\n";
        let seventhCol = "\n";
        let eighthCol = "\n";
        let ninthCol = "\n";
        for (let i = 0; i < 3; i++) {
            const participant = participants[i];
            let participantName = participantNames[participant.puuid];
            if (participantName === currentParticipantName) {
                participantName = `**${participantName}**`;
            }
            const threeStarChamps = this.renderUnitByStar(participant.units, 3);
            const twoStarChamps = this.renderUnitByStar(participant.units, 2);
            const oneStarChamps = this.renderUnitByStar(participant.units, 1);
            firstCol += `${this.renderPlacement(i + 1)} ${participantName}\n`;
            secondCol += `${threeStarChamps}\n`;
            thirdCol += `${twoStarChamps} **/** ${oneStarChamps}\n`;
        }
        for (let i = 3; i < 6; i++) {
            const participant = participants[i];
            let participantName = participantNames[participant.puuid];
            if (participantName === currentParticipantName) {
                participantName = `**${participantName}**`;
            }
            const threeStarChamps = this.renderUnitByStar(participant.units, 3);
            const twoStarChamps = this.renderUnitByStar(participant.units, 2);
            const oneStarChamps = this.renderUnitByStar(participant.units, 1);
            fourthCol += `${this.renderPlacement(i + 1)} ${participantName}\n`;
            fifthCol += `${threeStarChamps}\n`;
            sixthCol += `${twoStarChamps} **/** ${oneStarChamps}\n`;
        }
        for (let i = 6; i < 8; i++) {
            const participant = participants[i];
            let participantName = participantNames[participant.puuid];
            if (participantName === currentParticipantName) {
                participantName = `**${participantName}**`;
            }
            const threeStarChamps = this.renderUnitByStar(participant.units, 3);
            const twoStarChamps = this.renderUnitByStar(participant.units, 2);
            const oneStarChamps = this.renderUnitByStar(participant.units, 1);
            seventhCol += `${this.renderPlacement(i + 1)} ${participantName}\n`;
            eighthCol += `${threeStarChamps}\n`;
            ninthCol += `${twoStarChamps} **/** ${oneStarChamps}\n`;
        }
        return {
            firstCol,
            secondCol,
            thirdCol,
            fourthCol,
            fifthCol,
            sixthCol,
            seventhCol,
            eighthCol,
            ninthCol,
        };
    }
    renderUnitByStar(units, star) {
        let output = "";
        units
            .filter((u) => u.tier === star)
            .forEach((u) => {
            output += `${champion_1.default.getDiscordIconByApiName(u.character_id)} `;
        });
        return output;
    }
    renderRow(colWidth, values, lengths) {
        let description = "";
        const numCols = colWidth.length;
        for (let i = 0; i < numCols; i++) {
            const spaceCount = Math.max(colWidth[i] - lengths[i], 0);
            description += `${values[i]}${" ".repeat(spaceCount)}`;
        }
        description += "\n";
        return description;
    }
    renderPlacement(placement) {
        if (placement === 1)
            return ":first_place:";
        if (placement === 2)
            return ":second_place:";
        if (placement === 3)
            return ":third_place:";
        if (placement === 4)
            return ":four:";
        if (placement === 5)
            return ":five:";
        if (placement === 6)
            return ":six:";
        if (placement === 7)
            return ":seven:";
        return ":eight:";
    }
    renderStar(count) {
        return ":star:".repeat(count);
    }
}
exports.default = TftLastGameCommand;
