"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DiscordAdapter_1 = require("./src/DiscordAdapter");
exports.DiscordAdapter = DiscordAdapter_1.DiscordAdapter;
const adapterName = 'discord-ts';
function hasDiscordAdapter(robot) {
    return robot.adapterName === adapterName;
}
exports.hasDiscordAdapter = hasDiscordAdapter;
function use(robot) {
    if (!process.env.HUBOT_DISCORD_TOKEN) {
        throw new Error('Environment variable named `HUBOT_DISCORD_TOKEN` required.');
    }
    return new DiscordAdapter_1.DiscordAdapter(robot, process.env.HUBOT_DISCORD_TOKEN);
}
exports.use = use;
//# sourceMappingURL=index.js.map