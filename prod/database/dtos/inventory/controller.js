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
exports.getChampionStats = exports.tftToDbChampion = exports.findInventoryById = exports.createInventory = void 0;
const model_1 = __importDefault(require("./model"));
const createInventory = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inventory = new model_1.default();
        yield inventory.save();
        return inventory;
    }
    catch (error) {
        console.error(error);
    }
});
exports.createInventory = createInventory;
const findInventoryById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (yield model_1.default.findById(_id)) || undefined;
    }
    catch (error) {
        console.error(error);
    }
});
exports.findInventoryById = findInventoryById;
const tftToDbChampion = (champion, count) => {
    return {
        id: champion.id,
        name: champion.name,
        icon: champion.icon,
        cost: champion.cost,
        stats: {
            armor: champion.stats.armor,
            damage: champion.stats.damage,
            hp: champion.stats.hp,
            magicResist: champion.stats.magicResist,
        },
        ability: {
            name: champion.ability.name,
            desc: champion.ability.desc,
            icon: champion.ability.icon,
        },
        count,
    };
};
exports.tftToDbChampion = tftToDbChampion;
const getChampionStats = (champion, star) => {
    return {
        physicalDamage: champion.stats.damage * star,
        magicDamage: Math.floor(champion.stats.damage * star * 1.5),
        physicalDamagePen: 0,
        magicDamagePen: 0,
        hp: champion.stats.hp * star,
        armor: champion.stats.armor * star,
        magicResist: champion.stats.magicResist * star,
        physicalCritChance: 35,
        magicCritChance: 15,
    };
};
exports.getChampionStats = getChampionStats;
