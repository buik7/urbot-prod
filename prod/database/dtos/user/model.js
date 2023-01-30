"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    _id: {
        discordUserId: {
            type: String,
            required: true,
        },
        discordGuildId: {
            type: String,
            required: true,
        },
    },
    tag: {
        type: String,
        required: true,
    },
    gameId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Game",
        required: true,
    },
    riotInfoId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "RiotInfo",
    },
});
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
