"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTierDiscordIcon = exports.displayTierAndDivision = exports.getTierName = exports.Tiers = void 0;
var Tiers;
(function (Tiers) {
    Tiers["CHALLENGER"] = "CHALLENGER";
    Tiers["GRANDMASTER"] = "GRANDMASTER";
    Tiers["MASTER"] = "MASTER";
    Tiers["DIAMOND"] = "DIAMOND";
    Tiers["PLATINUM"] = "PLATINUM";
    Tiers["GOLD"] = "GOLD";
    Tiers["SILVER"] = "SILVER";
    Tiers["BRONZE"] = "BRONZE";
    Tiers["IRON"] = "IRON";
})(Tiers = exports.Tiers || (exports.Tiers = {}));
function getTierName(tier) {
    return tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
}
exports.getTierName = getTierName;
function displayTierAndDivision(tier, division) {
    if (tier === Tiers.CHALLENGER ||
        tier === Tiers.GRANDMASTER ||
        tier === Tiers.MASTER) {
        return `${getTierName(tier)}`;
    }
    return `${getTierName(tier)} ${division}`;
}
exports.displayTierAndDivision = displayTierAndDivision;
function getTierDiscordIcon(tier) {
    switch (tier) {
        case Tiers.CHALLENGER:
            return "<:challenger:1062468891135193108>";
        case Tiers.GRANDMASTER:
            return "<:grandmaster:1062468873326170122>";
        case Tiers.MASTER:
            return "<:master:1062468859887616112>";
        case Tiers.DIAMOND:
            return "<:diamond:1062468834881192066>";
        case Tiers.PLATINUM:
            return "<:platinum:1062468736122110022>";
        case Tiers.GOLD:
            return "<:gold:1062468707634393188>";
        case Tiers.SILVER:
            return "<:silver:1062468690278367333>";
        case Tiers.BRONZE:
            return "<:bronze:1062468629720997990>";
        case Tiers.IRON:
            return "<:iron:1062468669894041600>";
        default:
            return "<:unranked:1062477792131956797>";
    }
}
exports.getTierDiscordIcon = getTierDiscordIcon;
