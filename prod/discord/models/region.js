"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeagueRegionDiscordChoices = void 0;
const constants_1 = require("../../riot/constants");
const getLeagueRegionDiscordChoices = () => {
    const choices = [];
    for (let region in constants_1.regionProps) {
        choices.push({
            name: constants_1.regionProps[region],
            value: region,
        });
    }
    return choices;
};
exports.getLeagueRegionDiscordChoices = getLeagueRegionDiscordChoices;
