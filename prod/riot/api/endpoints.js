"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tftEndpoints = exports.lolEndpoints = void 0;
exports.lolEndpoints = {
    ChampionMasteryBySummoner: {
        path: "champion-masteries/by-summoner/$(encryptedSummonerId)",
        prefix: "champion-mastery",
        version: 4,
    },
    ChampionMasteryBySummonerChampion: {
        path: "champion-masteries/by-summoner/$(encryptedSummonerId)/by-champion/$(championId)",
        prefix: "champion-mastery",
        version: 4,
    },
    TopChampionMasteryBySummoner: {
        path: "champion-masteries/by-summoner/$(encryptedSummonerId)/top",
        prefix: "champion-mastery",
        version: 4,
    },
    ChampionScore: {
        path: "scores/by-summoner/$(encryptedSummonerId)",
        prefix: "champion-mastery",
        version: 4,
    },
    ChampionRotation: {
        path: "champion-rotations",
        prefix: "platform",
        version: 3,
    },
    ChallengerLeaguesByQueue: {
        path: "challengerleagues/by-queue/$(queue)",
        prefix: "league",
        version: 4,
    },
    GrandMasterLeaguesByQueue: {
        path: "grandmasterleagues/by-queue/$(queue)",
        prefix: "league",
        version: 4,
    },
    MasterLeaguesByQueue: {
        path: "masterleagues/by-queue/$(queue)",
        prefix: "league",
        version: 4,
    },
    LeagueEntries: {
        path: "entries/$(queue)/$(tier)/$(division)",
        prefix: "league",
        version: 4,
    },
    SummonerLeague: {
        path: "entries/by-summoner/$(encryptedSummonerId)",
        prefix: "league",
        version: 4,
    },
    SpectatorFeaturedGames: {
        path: "featured-games",
        prefix: "spectator",
        version: 4,
    },
    SpectatorSummoner: {
        path: "active-games/by-summoner/$(encryptedSummonerId)",
        prefix: "spectator",
        version: 4,
    },
    SummonerByName: {
        path: "summoners/by-name/$(summonerName)",
        prefix: "summoner",
        version: 4,
    },
    SummonerByPUUID: {
        path: "summoners/by-puuid/$(encryptedPUUID)",
        prefix: "summoner",
        version: 4,
    },
    SummonerByEncryptedSummonerID: {
        path: "summoners/$(encryptedSummonerId)",
        prefix: "summoner",
        version: 4,
    },
    MatchListing: {
        path: "matches/by-puuid/$(puuid)/ids",
        prefix: "match",
        version: 5,
    },
    Match: {
        path: "matches/$(matchId)",
        prefix: "match",
        version: 5,
    },
};
exports.tftEndpoints = {
    LeagueMaster: {
        path: "master",
        prefix: "league",
        version: 1,
    },
    LeagueGrandMaster: {
        path: "grandmaster",
        prefix: "league",
        version: 1,
    },
    LeagueChallenger: {
        path: "challenger",
        prefix: "league",
        version: 1,
    },
    LeagueBySummoner: {
        path: "entries/by-summoner/$(encryptedSummonerId)",
        prefix: "league",
        version: 1,
    },
    SummonerByName: {
        path: "summoners/by-name/$(summonerName)",
        prefix: "summoner",
        version: 1,
    },
    SummonerByPUUID: {
        path: "summoners/by-puuid/$(encryptedPUUID)",
        prefix: "summoner",
        version: 1,
    },
    SummonerByEncryptedSummonerID: {
        path: "summoners/$(encryptedSummonerId)",
        prefix: "summoner",
        version: 1,
    },
    Match: {
        path: "matches/$(matchId)",
        prefix: "match",
        version: 1,
    },
    MatchListing: {
        path: "matches/by-puuid/$(puuid)/ids",
        prefix: "match",
        version: 1,
    },
};
