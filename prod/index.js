"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const client_1 = __importDefault(require("./discord/client"));
new client_1.default();
(0, database_1.connectToDatabase)();
