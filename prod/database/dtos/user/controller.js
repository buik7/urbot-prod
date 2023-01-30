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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rankGuildUserByPoints = exports.rankGuildUserByBalance = exports.updateUserBalance = exports.findOneOrCreateDbUser = exports.findDbUserById = exports.createDbUser = void 0;
const controller_1 = require("../game/controller");
const model_1 = __importDefault(require("./model"));
const createDbUser = (_id, discordUserTag, initialBalance = 30) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userGame = yield (0, controller_1.createDbGame)(initialBalance);
        if (!userGame) {
            throw new Error("Failed to create db game");
        }
        const user = new model_1.default({
            _id,
            tag: discordUserTag,
            gameId: userGame._id,
        });
        yield user.save();
        return user;
    }
    catch (error) {
        console.log(error);
    }
});
exports.createDbUser = createDbUser;
const findDbUserById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield model_1.default.findById(_id);
    return user ? user : undefined;
});
exports.findDbUserById = findDbUserById;
const findOneOrCreateDbUser = (_id, discordUserTag) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield model_1.default.findById(_id);
        if (user)
            return { user, created: false };
        return {
            user: yield (0, exports.createDbUser)(_id, discordUserTag),
            created: true,
        };
    }
    catch (error) {
        console.error;
    }
});
exports.findOneOrCreateDbUser = findOneOrCreateDbUser;
const updateUserBalance = (_id, newBalance) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield model_1.default.findById(_id).populate("gameId");
        if (!user)
            throw new Error("User not found");
        user.gameId.balance = newBalance;
        yield user.save();
        return user;
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateUserBalance = updateUserBalance;
const rankGuildUserByBalance = (discordGuildId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield model_1.default.find({
            "_id.discordGuildId": discordGuildId,
        }).populate("gameId");
        users.sort((a, b) => b.gameId.balance - a.gameId.balance);
        return users;
    }
    catch (error) {
        console.error(error);
    }
});
exports.rankGuildUserByBalance = rankGuildUserByBalance;
const rankGuildUserByPoints = (discordGuildId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield model_1.default.find({
            "_id.discordGuildId": discordGuildId,
        }).populate("gameId");
        users.sort((a, b) => b.gameId.points - a.gameId.points);
        return users;
    }
    catch (error) {
        console.error(error);
    }
});
exports.rankGuildUserByPoints = rankGuildUserByPoints;
