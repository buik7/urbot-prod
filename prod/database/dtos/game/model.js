"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const GameSchema = new mongoose_1.default.Schema({
    balance: {
        default: 30,
        type: Number,
    },
    points: {
        default: 0,
        type: Number,
    },
    dailyCooldown: {
        type: Date,
        default: new Date(),
    },
    inventoryId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Inventory",
    },
});
const Game = mongoose_1.default.model("Game", GameSchema);
exports.default = Game;
