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
exports.findGameById = exports.createDbGame = void 0;
const model_1 = __importDefault(require("./model"));
const createDbGame = (initialBalance) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let balance;
        if (!initialBalance || initialBalance < 0) {
            balance = undefined;
        }
        const dbGame = new model_1.default({ balance });
        yield dbGame.save();
        return dbGame;
    }
    catch (error) {
        console.error(error);
    }
});
exports.createDbGame = createDbGame;
const findGameById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const game = yield model_1.default.findById(_id);
        return game ? game : undefined;
    }
    catch (error) {
        console.error(error);
    }
});
exports.findGameById = findGameById;
