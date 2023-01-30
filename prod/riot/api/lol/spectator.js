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
exports.SpectatorApi = void 0;
const endpoints_1 = require("../endpoints");
const base_lol_1 = require("./base.lol");
class SpectatorApi extends base_lol_1.BaseApiLol {
    getSummonerActiveGame(region, encryptedSummonerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { encryptedSummonerId };
            try {
                return yield this.request(region, endpoints_1.lolEndpoints.SpectatorSummoner, params);
            }
            catch (e) {
                return null;
            }
        });
    }
}
exports.SpectatorApi = SpectatorApi;
