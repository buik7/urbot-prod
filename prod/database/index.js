"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
function connectToDatabase() {
    mongoose_1.default
        .connect(config_1.MONGODB_URI)
        .then(() => {
        console.log("Connected to database");
    })
        .catch(console.error);
}
exports.connectToDatabase = connectToDatabase;
