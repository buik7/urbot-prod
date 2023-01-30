"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
const controller_1 = require("../../database/dtos/game/controller");
const controller_2 = require("../../database/dtos/inventory/controller");
const controller_3 = require("../../database/dtos/riotinfo/controller");
const controller_4 = require("../../database/dtos/user/controller");
const validateUser = (discordUserId, discordGuildId, validationLevel) => __awaiter(void 0, void 0, void 0, function* () {
    const noAccountError = `<@${discordUserId}> doesn't have an Urbot account. Use \`daily\` to create one!`;
    const noRiotInfoError = `<@${discordUserId}> hasn't linked their League account to their Urbot account yet. Use \`link\` to link both accounts together!`;
    const serverError = "There was an error occured while execute this command. Please try again later";
    const emptyInventoryError = `<@${discordUserId}> haven't set their fighter. Use \`/equip <champion_name>\` to set the main fighter.`;
    let user, userGame, userInventory, userRiotInfo;
    user = yield (0, controller_4.findDbUserById)({ discordUserId, discordGuildId });
    if (!user) {
        return { success: false, errorMessage: noAccountError };
    }
    if (validationLevel.game) {
        if (!user.gameId) {
            return { success: false, errorMessage: noAccountError };
        }
        userGame = yield (0, controller_1.findGameById)(user.gameId);
        if (!userGame) {
            return { success: false, errorMessage: serverError };
        }
        if (validationLevel.inventory) {
            userInventory = yield (0, controller_2.findInventoryById)(userGame.inventoryId);
            if (!userInventory) {
                return { success: false, errorMessage: serverError };
            }
            if (validationLevel.emptyInventory && !userInventory.mainChampion.name) {
                return { success: false, errorMessage: emptyInventoryError };
            }
        }
    }
    if (validationLevel.riotInfo) {
        userRiotInfo = yield (0, controller_3.findRiotInfoById)(user.riotInfoId);
        if (!userRiotInfo) {
            return { success: false, errorMessage: noRiotInfoError };
        }
    }
    return {
        success: true,
        user,
        userGame,
        userInventory,
        userRiotInfo,
    };
});
exports.validateUser = validateUser;
