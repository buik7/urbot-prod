"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApiTft = void 0;
const config_1 = require("../../config");
const base_1 = require("../base");
const game_1 = require("../game");
class BaseApiTft extends base_1.BaseApi {
    constructor() {
        super();
        this.game = game_1.BaseApiGames.TFT;
        this.API_KEY = config_1.TFT_API_KEY;
    }
}
exports.BaseApiTft = BaseApiTft;
