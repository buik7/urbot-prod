"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCommand = exports.LeagueOptionName = void 0;
const discord_js_1 = require("discord.js");
const region_1 = require("./region");
const defaultDescriptions = {
    region: "Summoner's region",
    summonerName: "Summoner's name",
    discordUser: "Tag a discord user",
};
var LeagueOptionName;
(function (LeagueOptionName) {
    LeagueOptionName["region"] = "region";
    LeagueOptionName["summonerName"] = "summoner_name";
    LeagueOptionName["discordUser"] = "discord_user";
})(LeagueOptionName = exports.LeagueOptionName || (exports.LeagueOptionName = {}));
const buildCommand = ({ name, description, options, }) => {
    const command = new discord_js_1.SlashCommandBuilder()
        .setName(name)
        .setDescription(description);
    if (options.region) {
        const regionDescription = options.region.description || defaultDescriptions.summonerName;
        command.addStringOption((option) => {
            option
                .setName(LeagueOptionName.region)
                .setDescription(regionDescription)
                .addChoices(...(0, region_1.getLeagueRegionDiscordChoices)());
            if (options.region && options.region.required)
                option.setRequired(true);
            return option;
        });
    }
    if (options.summonerName) {
        const summonerNameDescription = options.summonerName.description || defaultDescriptions.summonerName;
        command.addStringOption((option) => {
            option
                .setName(LeagueOptionName.summonerName)
                .setDescription(summonerNameDescription);
            if (options.summonerName && options.summonerName.required)
                option.setRequired(true);
            return option;
        });
    }
    if (options.discordUser) {
        const discordUserDescription = options.discordUser.description || defaultDescriptions.summonerName;
        command.addUserOption((option) => {
            option
                .setName(LeagueOptionName.discordUser)
                .setDescription(discordUserDescription);
            if (options.discordUser && options.discordUser.required)
                option.setRequired(true);
            return option;
        });
    }
    return command;
};
exports.buildCommand = buildCommand;
