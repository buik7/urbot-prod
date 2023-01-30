"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LolApi = void 0;
const base_lol_1 = require("./base.lol");
const league_1 = require("./league");
const summoner_1 = require("./summoner");
const champion_1 = require("./champion");
const spectator_1 = require("./spectator");
class LolApi extends base_lol_1.BaseApiLol {
    constructor() {
        super(...arguments);
        this.League = new league_1.LeagueAPI();
        this.Summoner = new summoner_1.SummonerApi();
        this.Champion = new champion_1.ChampionApi();
        this.Spectator = new spectator_1.SpectatorApi();
    }
}
exports.LolApi = LolApi;
