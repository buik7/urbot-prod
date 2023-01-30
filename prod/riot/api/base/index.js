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
exports.BaseApi = void 0;
const game_1 = require("../game");
const axios_1 = __importDefault(require("axios"));
class BaseApi {
    constructor() {
        this.game = game_1.BaseApiGames.LOL;
        this.baseUrl = game_1.BaseConstants.BASE_URL;
    }
    getBaseUrl() {
        return this.baseUrl.replace(":game", this.game);
    }
    getApiUrl(endpoint, params) {
        const { prefix, version, path } = endpoint;
        const basePath = `${prefix}/v${version}/${path}`;
        const re = /\$\(([^\)]+)?\)/g;
        let base = `${this.getBaseUrl()}/${basePath}`;
        let match;
        while ((match = re.exec(base))) {
            const [key, paramKey] = match;
            const value = encodeURI(String(params[paramKey]));
            base = base.replace(key, value);
            re.lastIndex = 0;
        }
        return base;
    }
    request(region, endpoint, params, queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            params = params || {};
            params.region = region.toLowerCase();
            const url = this.getApiUrl(endpoint, params);
            const options = {
                url,
                method: "GET",
                headers: {
                    Origin: null,
                    "X-Riot-Token": this.API_KEY,
                },
                params: queryParams,
            };
            return (yield (0, axios_1.default)(options)).data;
        });
    }
}
exports.BaseApi = BaseApi;
