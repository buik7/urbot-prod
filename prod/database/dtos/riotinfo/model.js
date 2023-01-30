"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RiotInfoSchema = new mongoose_1.default.Schema({
    summonerName: String,
    puuid: String,
    encryptedSummonerId: String,
    region: String,
    profileIconId: Number,
});
const RiotInfo = mongoose_1.default.model("RiotInfo", RiotInfoSchema);
exports.default = RiotInfo;
