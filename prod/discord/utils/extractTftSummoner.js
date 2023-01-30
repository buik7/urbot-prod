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
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTftSummoner = void 0;
const leagueCommandBuilder_1 = require("../models/leagueCommandBuilder");
const validateUser_1 = require("./validateUser");
function extractTftSummoner(interaction, tftApi) {
    return __awaiter(this, void 0, void 0, function* () {
        const summonerName = interaction.options.getString(leagueCommandBuilder_1.LeagueOptionName.summonerName);
        const region = interaction.options.getString(leagueCommandBuilder_1.LeagueOptionName.region);
        let discordUser = interaction.options.getUser(leagueCommandBuilder_1.LeagueOptionName.discordUser);
        let summoner = {};
        if (summonerName && region) {
            try {
                const apiSummoner = yield tftApi.Summoner.getByName(region, summonerName);
                summoner.summonerName = summonerName;
                summoner.puuid = apiSummoner.puuid;
                summoner.encryptedSummonerId = apiSummoner.id;
                summoner.region = region;
                summoner.profileIconId = apiSummoner.profileIconId;
            }
            catch (error) {
                console.error(error);
                return {
                    success: false,
                    errorMessage: `Summoner ${summonerName} of region ${region} does not exist.`,
                };
            }
        }
        else if (summonerName || region) {
            return {
                success: false,
                errorMessage: `You need to specify both the summoner name and the region`,
            };
        }
        else {
            if (!discordUser)
                discordUser = interaction.user;
            const validationResult = yield (0, validateUser_1.validateUser)(discordUser.id, interaction.guildId, { riotInfo: true });
            if (!validationResult.success || !validationResult.userRiotInfo) {
                return {
                    success: false,
                    errorMessage: `${discordUser.toString()} has not linked their League Accout yet. Use \`/link\` to link your account!`,
                };
            }
            summoner = validationResult.userRiotInfo.toObject();
        }
        return {
            success: true,
            summoner,
        };
    });
}
exports.extractTftSummoner = extractTftSummoner;
