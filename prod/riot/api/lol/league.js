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
exports.LeagueAPI = void 0;
const endpoints_1 = require("../endpoints");
const base_lol_1 = require("./base.lol");
class LeagueAPI extends base_lol_1.BaseApiLol {
    bySummoner(region, encryptedSummonerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { encryptedSummonerId };
            return this.request(region, endpoints_1.lolEndpoints.SummonerLeague, params);
        });
    }
    entries(queue, tier, division, region, page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { queue, tier, division };
            const queryParams = { page };
            return this.request(region, endpoints_1.lolEndpoints.LeagueEntries, params, queryParams);
        });
    }
    getChallengerLeaguesByQueue(queue, region) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { queue };
            return this.request(region, endpoints_1.lolEndpoints.ChallengerLeaguesByQueue, params);
        });
    }
    getGrandMasterLeagueByQueue(queue, region) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { queue };
            return this.request(region, endpoints_1.lolEndpoints.GrandMasterLeaguesByQueue, params);
        });
    }
    getMasterLeagueByQueue(queue, region) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { queue };
            return this.request(region, endpoints_1.lolEndpoints.MasterLeaguesByQueue, params);
        });
    }
}
exports.LeagueAPI = LeagueAPI;
