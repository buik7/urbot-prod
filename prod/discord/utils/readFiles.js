"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAllFilesInDirectory = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const isDirectory = (filePath) => {
    return fs_1.default.statSync(filePath).isDirectory();
};
const readAllFilesInDirectory = (dirPath, files = []) => {
    const dirFiles = fs_1.default.readdirSync(dirPath);
    for (let file of dirFiles) {
        if (isDirectory(dirPath + "/" + file)) {
            files = (0, exports.readAllFilesInDirectory)(dirPath + "/" + file, files);
        }
        else {
            files.push(path_1.default.join(dirPath, "/", file));
        }
    }
    return files.filter((file) => file.endsWith(".js"));
};
exports.readAllFilesInDirectory = readAllFilesInDirectory;
