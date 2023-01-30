"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tftitems_json_1 = __importDefault(require("./static/tftitems.json"));
class ItemTftApi {
    static getItems() {
        return tftitems_json_1.default;
    }
    static getItemByName(name) {
        return tftitems_json_1.default.find((item) => item.name === name);
    }
}
exports.default = ItemTftApi;
