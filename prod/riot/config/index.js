"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TFT_API_KEY = exports.LOL_API_KEY = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.LOL_API_KEY = process.env.LOL_API_KEY;
exports.TFT_API_KEY = process.env.TFT_API_KEY;
