import { Robot } from 'hubot';

import DiscordAdapter from './src/DiscordAdapter';

export { DiscordAdapter };

const adapterName = 'discord-ts';
export function hasDiscordAdapter(robot: Robot): robot is Robot<DiscordAdapter> {
    return robot.adapterName === adapterName;
}

export function use(robot: Robot) {
    if (!process.env.HUBOT_DISCORD_TOKEN) {
        throw new Error('Environment variable named `HUBOT_DISCORD_TOKEN` required.');
    }

    return new DiscordAdapter(robot, process.env.HUBOT_DISCORD_TOKEN);
}
