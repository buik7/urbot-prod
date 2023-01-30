"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TFTApi = void 0;
const base_tft_1 = require("./base.tft");
const league_1 = require("./league");
const match_1 = require("./match");
const summoner_1 = require("./summoner");
class TFTApi extends base_tft_1.BaseApiTft {
    constructor() {
        super(...arguments);
        this.League = new league_1.LeagueTFTApi();
        this.Summoner = new summoner_1.SummonerTftApi();
        this.Match = new match_1.MatchTftApi();
    }
}
exports.TFTApi = TFTApi;
