"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApiLol = void 0;
const config_1 = require("../../config");
const base_1 = require("../base");
class BaseApiLol extends base_1.BaseApi {
    constructor() {
        super();
        this.API_KEY = config_1.LOL_API_KEY;
    }
}
exports.BaseApiLol = BaseApiLol;
