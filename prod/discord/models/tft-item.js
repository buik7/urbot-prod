"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTftItemDiscordEmbedFields = exports.getTftItemDiscordChoices = void 0;
const item_1 = __importDefault(require("../../riot/api/tft/item"));
const getTftItemDiscordChoices = () => {
    const tftItems = item_1.default.getItems();
    return tftItems.map((item) => ({
        name: `${item.name} (+${item.effectName})`,
        value: item.name,
    }));
};
exports.getTftItemDiscordChoices = getTftItemDiscordChoices;
const getTftItemDiscordEmbedFields = () => {
    const tftItems = item_1.default.getItems();
    return tftItems.map((item) => ({
        name: `${item.discordIcon}  ${item.name}`,
        value: `+${item.effectName}`,
        inline: true,
    }));
};
exports.getTftItemDiscordEmbedFields = getTftItemDiscordEmbedFields;
