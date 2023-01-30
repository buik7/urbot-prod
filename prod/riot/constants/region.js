"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionProps = exports.regionToRegionGroup = exports.RegionGroups = exports.Regions = void 0;
var Regions;
(function (Regions) {
    Regions["VIETNAM"] = "VN2";
    Regions["SINGAPORE"] = "SG2";
    Regions["THAILAND"] = "TH2";
    Regions["TAIWAN"] = "TW2";
    Regions["PHILIPPINES"] = "PH2";
    Regions["BRAZIL"] = "BR1";
    Regions["EU_EAST"] = "EUN1";
    Regions["EU_WEST"] = "EUW1";
    Regions["KOREA"] = "KR";
    Regions["LAT_NORTH"] = "LA1";
    Regions["LAT_SOUTH"] = "LA2";
    Regions["AMERICA_NORTH"] = "NA1";
    Regions["OCEANIA"] = "OC1";
    Regions["TURKEY"] = "TR1";
    Regions["RUSSIA"] = "RU";
    Regions["JAPAN"] = "JP1";
    Regions["PBE"] = "PBE1";
})(Regions = exports.Regions || (exports.Regions = {}));
var RegionGroups;
(function (RegionGroups) {
    RegionGroups["ASIA"] = "ASIA";
    RegionGroups["AMERICAS"] = "AMERICAS";
    RegionGroups["EUROPE"] = "EUROPE";
    RegionGroups["SEA"] = "SEA";
})(RegionGroups = exports.RegionGroups || (exports.RegionGroups = {}));
function regionToRegionGroup(region) {
    switch (region) {
        case Regions.AMERICA_NORTH:
        case Regions.BRAZIL:
        case Regions.LAT_NORTH:
        case Regions.LAT_SOUTH:
            return RegionGroups.AMERICAS;
        case Regions.EU_EAST:
        case Regions.EU_WEST:
        case Regions.TURKEY:
        case Regions.RUSSIA:
            return RegionGroups.EUROPE;
        case Regions.JAPAN:
        case Regions.KOREA:
            return RegionGroups.ASIA;
        case Regions.VIETNAM:
        case Regions.SINGAPORE:
        case Regions.OCEANIA:
        case Regions.PHILIPPINES:
        case Regions.THAILAND:
        case Regions.TAIWAN:
            return RegionGroups.SEA;
    }
    throw new Error(`Unexpected region: ${region}`);
}
exports.regionToRegionGroup = regionToRegionGroup;
exports.regionProps = {
    [Regions.VIETNAM]: "Vietnam",
    [Regions.SINGAPORE]: "Singapore",
    [Regions.THAILAND]: "Thailand",
    [Regions.TAIWAN]: "Taiwan",
    [Regions.PHILIPPINES]: "Phillipines",
    [Regions.BRAZIL]: "Brazil",
    [Regions.EU_EAST]: "European East",
    [Regions.EU_WEST]: "European West",
    [Regions.KOREA]: "Korea",
    [Regions.LAT_NORTH]: "Latin North",
    [Regions.LAT_SOUTH]: "Latin South",
    [Regions.AMERICA_NORTH]: "North America",
    [Regions.OCEANIA]: "Oceania",
    [Regions.TURKEY]: "Turkey",
    [Regions.RUSSIA]: "Russia",
    [Regions.JAPAN]: "Japan",
};
