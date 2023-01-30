"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const InventoryChampionType = {
    id: String,
    name: String,
    cost: Number,
    icon: String,
    stats: {
        armor: Number,
        damage: Number,
        hp: Number,
        magicResist: Number,
    },
    ability: {
        name: String,
        desc: String,
        icon: String,
    },
    count: Number,
};
const InventoryItemType = {
    name: { type: String },
    discordIcon: { type: String },
};
const InventorySchema = new mongoose_1.default.Schema({
    champions: [InventoryChampionType],
    mainChampion: InventoryChampionType,
    items: [InventoryItemType],
    mainItem: InventoryItemType,
});
const Inventory = mongoose_1.default.model("Inventory", InventorySchema);
exports.default = Inventory;
