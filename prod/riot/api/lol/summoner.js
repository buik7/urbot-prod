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
exports.SummonerApi = void 0;
const endpoints_1 = require("../endpoints");
const base_lol_1 = require("./base.lol");
class SummonerApi extends base_lol_1.BaseApiLol {
    getByName(region, summonerName) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { summonerName };
            return this.request(region, endpoints_1.lolEndpoints.SummonerByName, params);
        });
    }
    getByPUUID(region, encryptedPUUID) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { encryptedPUUID };
            return this.request(region, endpoints_1.lolEndpoints.SummonerByPUUID, params);
        });
    }
    getById(region, encryptedSummonerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { encryptedSummonerId };
            return this.request(region, endpoints_1.lolEndpoints.SummonerByEncryptedSummonerID, params);
        });
    }
    static getProfileIconURL(profileIconId) {
        return `https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${profileIconId}.jpg`;
    }
}
exports.SummonerApi = SummonerApi;
