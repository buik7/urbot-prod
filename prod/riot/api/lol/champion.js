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
exports.ChampionApi = void 0;
const endpoints_1 = require("../endpoints");
const base_lol_1 = require("./base.lol");
class ChampionApi extends base_lol_1.BaseApiLol {
    getRotation(region) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(region, endpoints_1.lolEndpoints.ChampionRotation);
        });
    }
    getAllChampionMasteryBySummoner(region, encryptedSummonerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { encryptedSummonerId };
            return this.request(region, endpoints_1.lolEndpoints.ChampionMasteryBySummoner, params);
        });
    }
    getChampionMasteryBySummoner(region, encryptedSummonerId, championId) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { encryptedSummonerId, championId };
            return this.request(region, endpoints_1.lolEndpoints.ChampionMasteryBySummonerChampion, params);
        });
    }
    getChampionsScore(region, encryptedSummonerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { encryptedSummonerId };
            return this.request(region, endpoints_1.lolEndpoints.ChampionScore, params);
        });
    }
    getTopChampionMasteryBySummoner(region, encryptedSummonerId, count) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { encryptedSummonerId };
            const queryParams = { count };
            return this.request(region, endpoints_1.lolEndpoints.TopChampionMasteryBySummoner, params, queryParams);
        });
    }
    static getMasteryDiscordIcon(championLevel) {
        switch (championLevel) {
            case 1:
                return "<:mastery1:1062478728829083689>";
            case 2:
                return "<:mastery2:1062478746243837982>";
            case 3:
                return "<:mastery3:1062479004470349834>";
            case 4:
                return "<:mastery4:1062479015165829181>";
            case 5:
                return "<:mastery5:1062479025332814014>";
            case 6:
                return "<:mastery6:1062479035990552706>";
            case 7:
                return "<:mastery7:1062479045763276890>";
            default:
                return "<:mastery1:1062478728829083689>";
        }
    }
}
exports.ChampionApi = ChampionApi;
