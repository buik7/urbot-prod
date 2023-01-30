"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Event_1 = __importDefault(require("../types/Event"));
class ReadyEvent extends Event_1.default {
  constructor() {
    super(...arguments);
    this.name = "ready";
    this.once = true;
  }
  execute() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      // this.client.commands.deployCommands();
      (_a = this.client.user) === null || _a === void 0
        ? void 0
        : _a.setPresence({
            status: "online",
            activities: [
              {
                name: "/roll",
                type: discord_js_1.ActivityType.Playing,
              },
            ],
          });
      console.log(
        "Ready! Logged in as " +
          ((_b = this.client.user) === null || _b === void 0 ? void 0 : _b.tag)
      );
    });
  }
}
exports.default = ReadyEvent;
