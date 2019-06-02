import { Robot } from 'hubot';
import { DiscordAdapter } from './src/DiscordAdapter';

export function use(robot: Robot) {
    if (!process.env.HUBOT_DISCORD_TOKEN) {
        throw new Error('Environment variable named `HUBOT_DISCORD_TOKEN` required.');
    }

    return new DiscordAdapter(robot, process.env.HUBOT_DISCORD_TOKEN);
}
