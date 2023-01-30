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
exports.DataDragonService = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../../constants");
const defaultLang = "en_US";
class DataDragonService {
    request(path, base = constants_1.DataDragonEnum.BASE) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                url: `${base}/${path}`,
                method: "GET",
            };
            return (yield (0, axios_1.default)(options)).data;
        });
    }
    getRealms(server) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = `realms/${server}.json`;
            return this.request(path);
        });
    }
    getVersions() {
        return __awaiter(this, void 0, void 0, function* () {
            const path = "api/versions.json";
            return this.request(path);
        });
    }
    getLanguages() {
        return __awaiter(this, void 0, void 0, function* () {
            const path = "cdn/languages.json";
            return this.request(path);
        });
    }
    getRunesReforged() {
        return __awaiter(this, void 0, void 0, function* () {
            const version = (yield this.getVersions())[0];
            const path = `cdn/${version}/data/${defaultLang}/runesReforged.json`;
            return this.request(path);
        });
    }
    getQueues() {
        return __awaiter(this, void 0, void 0, function* () {
            const path = "docs/lol/queues.json";
            return this.request(path, constants_1.DataDragonEnum.STATIC);
        });
    }
    getSeasons() {
        return __awaiter(this, void 0, void 0, function* () {
            const path = "docs/lol/seasons.json";
            return this.request(path, constants_1.DataDragonEnum.STATIC);
        });
    }
    getMaps() {
        return __awaiter(this, void 0, void 0, function* () {
            const path = "docs/lol/maps.json";
            return this.request(path, constants_1.DataDragonEnum.STATIC);
        });
    }
    getGameModes() {
        return __awaiter(this, void 0, void 0, function* () {
            const path = "docs/lol/gameModes.json";
            return this.request(path, constants_1.DataDragonEnum.STATIC);
        });
    }
    getGameTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            const path = "docs/lol/gameTypes.json";
            return this.request(path, constants_1.DataDragonEnum.STATIC);
        });
    }
}
exports.DataDragonService = DataDragonService;
