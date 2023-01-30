"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tftchampions_json_1 = __importDefault(require("./static/tftchampions.json"));
const tft_api_name_to_icon_json_1 = __importDefault(require("./static/tft_api_name_to_icon.json"));
class ChampionTftApi {
    static getChampions() {
        return tftchampions_json_1.default;
    }
    static getRandomChampion(cost) {
        if (!cost)
            return this.getRandomElementFromArray(tftchampions_json_1.default);
        return this.getRandomElementFromArray(this.getChampionsWithCost(cost));
    }
    static getChampionsWithCost(cost) {
        return tftchampions_json_1.default.filter((c) => c.cost === cost);
    }
    static getDiscordIconByApiName(name) {
        return tft_api_name_to_icon_json_1.default[name];
    }
    static mapChampionCostToColor(cost) {
        if (cost === 1)
            return 0x808080;
        if (cost === 2)
            return 0x11b288;
        if (cost === 3)
            return 0x207ac7;
        if (cost === 4)
            return 0xc440da;
        if (cost >= 5)
            return 0xffb93b;
        return 0x0099ff;
    }
    static getChampionStar(count) {
        if (count >= 9)
            return 3;
        if (count >= 3)
            return 2;
        return 1;
    }
    static getRandomElementFromArray(array) {
        const index = Math.floor(Math.random() * array.length);
        return array[index];
    }
}
ChampionTftApi.getPhysicalDamageReduction = (armor) => {
    return Math.floor((100 * armor) / (100 + armor));
};
ChampionTftApi.getMagicDamageReduction = (magicResist) => {
    return Math.floor((100 * magicResist) / (100 + magicResist));
};
exports.default = ChampionTftApi;
